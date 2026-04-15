"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkHome = exports.linkFeedback = exports.commandRunScript = exports.commandRenameOldMarkers = exports.commandExport = exports.commandClear = exports.commandLocked = exports.commandHidden = exports.commandCoordinate = exports.commandNote = exports.commandProperties = exports.commandSpacingRight = exports.commandSpacingLeft = exports.commandSpacingBottom = exports.commandSpacingTop = exports.commandSpacingHorizontal = exports.commandSpacingVertical = exports.commandSpacings = exports.commandSizeRight = exports.commandSizeCenter = exports.commandSizeLeft = exports.commandSizeBottom = exports.commandSizeMiddle = exports.commandSizeTop = exports.commandSizes = exports.commandExportable = exports.commandOverlays = exports.commandToolbar = exports.commandSettings = exports.commandInit = void 0;
const settingsPanel_1 = require("./meaxure/panels/settingsPanel");
const context_1 = require("./meaxure/common/context");
const logger_1 = require("./meaxure/common/logger");
const toolbar_1 = require("./meaxure/panels/toolbar");
const helper_1 = require("./meaxure/helpers/helper");
const export_1 = require("./meaxure/export");
const note_1 = require("./meaxure/note");
const properties_1 = require("./meaxure/properties");
const overlay_1 = require("./meaxure/overlay");
const exportable_1 = require("./meaxure/exportable");
const coordinate_1 = require("./meaxure/coordinate");
const size_1 = require("./meaxure/size");
const spacings_1 = require("./meaxure/spacings");
const manage_1 = require("./meaxure/manage");
const sketch_1 = require("./sketch");
const alignment_1 = require("./sketch/layer/alignment");
const renameOldMarkers_1 = require("./meaxure/helpers/renameOldMarkers");
const runScript_1 = require("./meaxure/runScript");
function commandInit(context) { context_1.updateContext(context); return false; }
exports.commandInit = commandInit;
function commandSettings(context) { runAndCatch(settingsPanel_1.settingsPanel, context); }
exports.commandSettings = commandSettings;
function commandToolbar(context) { runAndCatch(toolbar_1.markToolbar, context); }
exports.commandToolbar = commandToolbar;
function commandOverlays(context) { runAndCatch(overlay_1.markOverlays, context); }
exports.commandOverlays = commandOverlays;
function commandExportable(context) { exportable_1.exportable(context), context; }
exports.commandExportable = commandExportable;
function commandSizes(context) { commandSizeTop(context); commandSizeRight(context); }
exports.commandSizes = commandSizes;
function commandSizeTop(context) { runAndCatch(size_1.drawSizes, context, alignment_1.EdgeVertical.top); }
exports.commandSizeTop = commandSizeTop;
function commandSizeMiddle(context) { runAndCatch(size_1.drawSizes, context, alignment_1.EdgeVertical.middle); }
exports.commandSizeMiddle = commandSizeMiddle;
function commandSizeBottom(context) { runAndCatch(size_1.drawSizes, context, alignment_1.EdgeVertical.bottom); }
exports.commandSizeBottom = commandSizeBottom;
function commandSizeLeft(context) { runAndCatch(size_1.drawSizes, context, alignment_1.Edge.left); }
exports.commandSizeLeft = commandSizeLeft;
function commandSizeCenter(context) { runAndCatch(size_1.drawSizes, context, alignment_1.Edge.center); }
exports.commandSizeCenter = commandSizeCenter;
function commandSizeRight(context) { runAndCatch(size_1.drawSizes, context, alignment_1.Edge.right); }
exports.commandSizeRight = commandSizeRight;
function commandSpacings(context) { runAndCatch(spacings_1.drawSpacings, context); }
exports.commandSpacings = commandSpacings;
function commandSpacingVertical(context) { runAndCatch(spacings_1.drawSpacings, context, "vertical"); }
exports.commandSpacingVertical = commandSpacingVertical;
function commandSpacingHorizontal(context) { runAndCatch(spacings_1.drawSpacings, context, "horizontal"); }
exports.commandSpacingHorizontal = commandSpacingHorizontal;
function commandSpacingTop(context) { runAndCatch(spacings_1.drawSpacings, context, "top"); }
exports.commandSpacingTop = commandSpacingTop;
function commandSpacingBottom(context) { runAndCatch(spacings_1.drawSpacings, context, "bottom"); }
exports.commandSpacingBottom = commandSpacingBottom;
function commandSpacingLeft(context) { runAndCatch(spacings_1.drawSpacings, context, "left"); }
exports.commandSpacingLeft = commandSpacingLeft;
function commandSpacingRight(context) { runAndCatch(spacings_1.drawSpacings, context, "right"); }
exports.commandSpacingRight = commandSpacingRight;
function commandProperties(context) { runAndCatch(properties_1.markPropertiesAll, context); }
exports.commandProperties = commandProperties;
function commandNote(context) { runAndCatch(note_1.markNote, context); }
exports.commandNote = commandNote;
function commandCoordinate(context) { runAndCatch(coordinate_1.drawCoordinate, context); }
exports.commandCoordinate = commandCoordinate;
function commandHidden(context) { runAndCatch(manage_1.toggleHidden, context); }
exports.commandHidden = commandHidden;
function commandLocked(context) { runAndCatch(manage_1.toggleLocked, context); }
exports.commandLocked = commandLocked;
function commandClear(context) { runAndCatch(manage_1.clearAllMarks, context); }
exports.commandClear = commandClear;
function commandExport(context) { runAndCatch(export_1.exportSpecification, context); }
exports.commandExport = commandExport;
function commandRenameOldMarkers(context) { runAndCatch(renameOldMarkers_1.renameOldMarkers, context); }
exports.commandRenameOldMarkers = commandRenameOldMarkers;
function commandRunScript(context) { runAndCatch(runScript_1.runScript, context); }
exports.commandRunScript = commandRunScript;
function linkFeedback(context) { runAndCatch(helper_1.openURL, context, "https://gitee.com/hubzyy/sketch-meaxure/issues"); }
exports.linkFeedback = linkFeedback;
function linkHome(context) { runAndCatch(helper_1.openURL, context, "https://gitee.com/hubzyy/sketch-meaxure"); }
exports.linkHome = linkHome;
function runAndCatch(fn, context, ...args) {
    try {
        context_1.updateContext(context);
        let returns = fn(...args);
        if (returns instanceof Promise) {
            returns.catch(error => showError(error));
        }
    }
    catch (error) {
        showError(error);
    }
    function showError(error) {
        logger_1.logger.error(error);
        sketch_1.sketch.UI.message(error);
    }
}
//# sourceMappingURL=index.js.map