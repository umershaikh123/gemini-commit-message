import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';

// Interfaces for the Git extension API
interface GitExtension {
    getAPI(version: 1): API;
}
interface API {
    repositories: Repository[];
}
interface Repository {
    inputBox: { value: string };
    rootUri: vscode.Uri;
}

const CONFIG_SECTION = 'gemini-commit-generator';

export function activate(context: vscode.ExtensionContext) {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    if (!gitExtension) {
        vscode.window.showErrorMessage('Git extension not found.');
        return;
    }

    const disposable = vscode.commands.registerCommand(`${CONFIG_SECTION}.generateCommitMessage`, async () => {
        const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
        let apiKey = config.get<string>('apiKey');
        const model = config.get<string>('model');

        if (!apiKey) {
            const newApiKey = await vscode.window.showInputBox({
                prompt: "Please enter your Gemini API Key to continue",
                placeHolder: "Paste your API key here",
                password: true,
                ignoreFocusOut: true,
            });

            if (newApiKey) {
                await config.update('apiKey', newApiKey, vscode.ConfigurationTarget.Global);
                apiKey = newApiKey;
                vscode.window.showInformationMessage("Gemini API Key saved successfully!");
            } else {
                vscode.window.showErrorMessage("A Gemini API Key is required to use this extension.");
                return;
            }
        }

        const api = gitExtension.exports.getAPI(1);
        const repo = api.repositories[0];
        if (!repo) {
            vscode.window.showErrorMessage('No Git repository found.');
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.SourceControl,
            title: 'Generating commit message...',
            cancellable: false
        }, async (progress) => {
            try {
                const diff = await getStagedDiff(repo.rootUri.fsPath);
                if (!diff) {
                    vscode.window.showInformationMessage('No staged changes found.');
                    return;
                }

                const genAI = new GoogleGenerativeAI(apiKey);
                const generativeModel = genAI.getGenerativeModel({ model: model || "gemini-2.5-flash-lite" });

                const prompt = `You are an expert programmer responsible for writing concise and meaningful commit messages.

Your task is to generate a single-line commit message based on the provided git diff. The commit message MUST strictly follow the Conventional Commits specification (v1.0.0).

Refer to https://www.conventionalcommits.org/en/v1.0.0/ for details.

The message should start with a type (e.g., 'feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert'), followed by an optional scope, a colon, a space, and a short, imperative description. The first line (subject) should be no longer than 72 characters. Do NOT include a body or a footer.

Avoid generic messages like 'update files', 'refactor code', 'fix bug' if more specific detail can be inferred. Do not produce empty messages or messages that only describe whitespace or formatting changes unless that is the *primary* and *only* logical change.

Do not include any explanation or markdown formatting (e.g., \`\`\`).

---diff
${diff}
---`;

                const result = await generativeModel.generateContentStream(prompt);

                repo.inputBox.value = ''; // Clear the input box
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    repo.inputBox.value += chunkText;
                }

            } catch (error) {
                console.error(error);
                vscode.window.showErrorMessage(`Error generating commit message: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getStagedDiff(cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('git diff --staged', { cwd }, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.error('Git stderr:', stderr);
            }
            resolve(stdout);
        });
    });
}

export function deactivate() {}
