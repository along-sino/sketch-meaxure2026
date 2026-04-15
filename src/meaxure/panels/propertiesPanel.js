"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesPanel = void 0;
const context_1 = require("../common/context");
const webviewPanel_1 = require("../../webviewPanel");
const helper_1 = require("../helpers/helper");
const language_1 = require("../common/language");
function propertiesPanel() {
    let panel = webviewPanel_1.createWebviewPanel({
        identifier: 'co.jebbs.sketch-meaxure.properties',
        url: helper_1.getResourcePath() + "/panel/properties.html",
        width: 280,
        height: 296,
    });
    if (!panel)
        return false;
    let data = {
        language: language_1.getLanguage(),
        // placement: context.runningConfig.placement ? context.runningConfig.placement : "top",
        properties: context_1.context.configs.properties && context_1.context.configs.properties.length ? context_1.context.configs.properties : ["color", "border"],
    };
    panel.onDidReceiveMessage('init', () => data);
    return new Promise((resolve, reject) => {
        panel.onClose(() => resolve(false));
        panel.onDidReceiveMessage('submit', (data) => {
            context_1.context.configs.properties = data.properties;
            // context.runningConfig.placement = data.placement;
            resolve(true);
            panel.close();
        });
        panel.show();
    });
}
exports.propertiesPanel = propertiesPanel;
//# sourceMappingURL=propertiesPanel.js.map