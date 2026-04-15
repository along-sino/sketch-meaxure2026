"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsPanel = void 0;
const context_1 = require("../common/context");
const webviewPanel_1 = require("../../webviewPanel");
const helper_1 = require("../helpers/helper");
const language_1 = require("../common/language");
function settingsPanel() {
    let panel = webviewPanel_1.createWebviewPanel({
        identifier: 'co.jebbs.sketch-meaxure.settings',
        url: helper_1.getResourcePath() + "/panel/settings.html",
        width: 280,
        height: 338,
    });
    if (!panel)
        return undefined;
    let data = {};
    data.language = language_1.getLanguage();
    if (context_1.context.configs) {
        data.scale = context_1.context.configs.resolution;
        data.units = context_1.context.configs.units;
        data.colorFormat = context_1.context.configs.format;
    }
    panel.onDidReceiveMessage('init', () => data);
    panel.onDidReceiveMessage('submit', data => {
        context_1.context.configs.resolution = data.scale;
        context_1.context.configs.units = data.units;
        context_1.context.configs.format = data.colorFormat;
        panel.close();
    });
    panel.show();
}
exports.settingsPanel = settingsPanel;
//# sourceMappingURL=settingsPanel.js.map