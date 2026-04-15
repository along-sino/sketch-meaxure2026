"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
function confirm(title, prompt, defaultButton, alternateButton) {
    defaultButton = defaultButton || 'OK';
    alternateButton = alternateButton || 'Cancel';
    let alert = NSAlert.alertWithMessageText_defaultButton_alternateButton_otherButton_informativeTextWithFormat(title, defaultButton, alternateButton, '', prompt);
    var response = alert.runModal();
    if (response == NSAlertDefaultReturn) {
        return true;
    }
    return false;
}
exports.confirm = confirm;
//# sourceMappingURL=confirm.js.map