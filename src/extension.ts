import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import Color from 'color';
import { generatePalette, generateThemeJson } from './themeGenerator';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('theme.generateFromColorTheory', async () => {
        
        const pattern = await vscode.window.showQuickPick(
            ['Monochromatic', 'Analogous', 'Complementary', 'Triadic'],
            { placeHolder: 'Select a color theory pattern' }
        );

        if (!pattern) {
            return; // User canceled
        }

        const baseColorHex = await vscode.window.showInputBox({
            prompt: 'Enter a base color in hex format (e.g., #3498db)',
            validateInput: (text: string) => {
                try {
                    Color(text);
                    return null; // Is a valid color
                } catch (e) {
                    return 'Please enter a valid hex color.';
                }
            }
        });

        if (!baseColorHex) {
            return; // User canceled
        }

        const palette = generatePalette(pattern, baseColorHex);
        const themeJson = {
            "name": "Generated AI Theme",
            "type": "dark",
            "colors": generateThemeJson(palette)
        };
        
        const themePath = path.join(context.extensionPath, 'themes', 'current-generated-theme.json');
        fs.writeFileSync(themePath, JSON.stringify(themeJson, null, 4));

        const config = vscode.workspace.getConfiguration();
        await config.update('workbench.colorTheme', 'Generated AI Theme', vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(`New ${pattern} theme applied!`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}