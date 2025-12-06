import Color from 'color';

export function generatePalette(pattern: string, baseColor: string): string[] {
    const base = Color(baseColor);
    let palette: Color[] = [];

    // Adjustments for a better dark theme experience
    const background = base.darken(0.8).desaturate(0.5);
    const foreground = base.lighten(0.8).desaturate(0.2);

    switch (pattern) {
        case 'Monochromatic':
            palette = [
                background,
                foreground,
                base,
                base.lighten(0.2).saturate(0.3),
                base.darken(0.4).saturate(0.2)
            ];
            break;
        case 'Analogous':
            const analogous1 = base.rotate(-30);
            palette = [
                background,
                foreground,
                base,
                analogous1,
                base.rotate(30)
            ];
            break;
        case 'Complementary':
            const complement = base.rotate(180);
            palette = [
                background,
                foreground,
                base,
                complement,
                complement.lighten(0.2)
            ];
            break;
        case 'Triadic':
            const triadic1 = base.rotate(120);
            const triadic2 = base.rotate(-120);
            palette = [
                background,
                foreground,
                base,
                triadic1,
                triadic2
            ];
            break;
        default:
            palette = [background, foreground, base, base, base];
    }

    return palette.map(c => c.hex());
}

export function generateThemeJson(palette: string[]) {
    const [background, foreground, accent1, accent2, accent3] = palette;

    return {
        "activityBar.background": background,
        "activityBar.foreground": foreground,
        "sideBar.background": background,
        "sideBar.foreground": foreground,
        "editor.background": background,
        "editor.foreground": foreground,
        "editorGroupHeader.tabsBackground": background,
        "tab.inactiveBackground": background,
        "tab.activeBackground": accent1,
        "tab.activeForeground": background,
        "statusBar.background": accent1,
        "statusBar.foreground": background,
        "input.background": accent2,
        "list.hoverBackground": accent3,
        "list.activeSelectionBackground": accent1,
        "button.background": accent1,
        "button.foreground": background
    };
}
