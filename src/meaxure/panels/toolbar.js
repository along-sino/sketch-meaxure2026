"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.markToolbar = void 0;
const context_1 = require("../common/context");
const webviewPanel_1 = require("../../webviewPanel");
const helper_1 = require("../helpers/helper");
const language_1 = require("../common/language");
const size_1 = require("../size");
const coordinate_1 = require("../coordinate");
const spacings_1 = require("../spacings");
const properties_1 = require("../properties");
const note_1 = require("../note");
const manage_1 = require("../manage");
const export_1 = require("../export");
const settingsPanel_1 = require("./settingsPanel");
const overlay_1 = require("../overlay");
const exportable_1 = require("../exportable");
const workers = {
    coordinate: coordinate_1.drawCoordinate,
    overlay: overlay_1.markOverlays,
    addSlice: exportable_1.markAddSlice,
    size: size_1.drawSizes,
    spacing: spacings_1.drawSpacings,
    properties: properties_1.markProperties,
    note: note_1.markNote,
    clear: manage_1.clearAllMarks,
    visibility: manage_1.toggleHidden,
    lock: manage_1.toggleLocked,
    export: export_1.exportSpecification,
    settings: settingsPanel_1.settingsPanel,
};
function markToolbar() {
    let panel = webviewPanel_1.createWebviewPanel({
        identifier: 'co.jebbs.sketch-meaxure.toolbar',
        url: helper_1.getResourcePath() + "/panel/toolbar.html",
        acceptsFirstMouse: true,
        width: 120,
        height: 472,
    });
    if (!panel)
        return undefined;
    let data = {};
    data.language = language_1.getLanguage();
    if (context_1.context.configs) {
        data.byInfluence = context_1.context.configs.byInfluence;
        data.byPercentage = context_1.context.configs.byPercentage;
    }
    panel.onDidReceiveMessage('init', () => data);
    panel.onDidReceiveMessage('command', msg => {
        context_1.updateContext();
        context_1.context.configs.byInfluence = msg.byInfluence;
        context_1.context.configs.byPercentage = msg.byPercentage;
        // if update configs only
        if (!msg.action)
            return;
        workers[msg.action](msg.options);
    });
    panel.show();
}
exports.markToolbar = markToolbar;
//# sourceMappingURL=toolbar.js.map