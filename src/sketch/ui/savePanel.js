"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePanel = void 0;
function savePanel(title, nameFieldLabel, prompt, canCreateDirectories, fileName) {
    let savePanel = NSSavePanel.savePanel();
    savePanel.setTitle(title);
    savePanel.setNameFieldLabel(nameFieldLabel);
    savePanel.setPrompt(prompt);
    savePanel.setCanCreateDirectories(canCreateDirectories);
    savePanel.setNameFieldStringValue(fileName);
    if (savePanel.runModal() != NSOKButton) {
        return undefined;
    }
    return savePanel.URL().path();
}
exports.savePanel = savePanel;
//# sourceMappingURL=savePanel.js.map