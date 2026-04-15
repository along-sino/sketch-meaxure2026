"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameIfIsMarker = exports.renameOldMarkers = void 0;
const sketch_1 = require("../../sketch");
const helper_1 = require("./helper");
const webviewPanel_1 = require("../../webviewPanel");
const logger_1 = require("../common/logger");
const language_1 = require("../common/language");
const MARK_V1 = /^(OVERLAY|WIDTH|HEIGHT|TOP|RIGHT|BOTTOM|LEFT|VERTICAL|HORIZONTAL|NOTE|PROPERTY)#/;
const MARK_V2 = /^#(?:width|height|spacing|coordinate|overlay|properties|note)/;
function renameOldMarkers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sketch_1.sketch.UI.confirm('Rename Old Markers', 'Rename markers created by Sketch Measure, so that this plugin can manage them.' + '\n\n' +
            'Would you like to continue?'))
            return;
        let stopwatch = helper_1.newStopwatch();
        let processingPanel = webviewPanel_1.createWebviewPanel({
            url: helper_1.getResourcePath() + "/panel/processing.html",
            width: 304,
            height: 104,
        });
        processingPanel.show();
        let doc = sketch_1.sketch.getSelectedDocument();
        for (let i = 0; i < doc.pages.length; i++) {
            let page = doc.pages[i];
            for (let j = 0; j < page.layers.length; j++) {
                let artboard = page.layers[j];
                let taskError;
                yield processingArtboard(artboard)
                    .catch(err => taskError = err);
                if (taskError) {
                    logger_1.logger.error(taskError);
                    return;
                }
                processingPanel.postMessage('process', {
                    percentage: Math.round((i + (j + 1) / page.layers.length) / doc.pages.length * 100),
                    text: language_1.localize("Processing artboard %@ of %@", i + 1, doc.pages.length)
                });
            }
        }
        processingPanel.close();
        sketch_1.sketch.UI.message(`All markers are renamed, takes ${stopwatch.elpased() / 1000} seconds.`);
    });
}
exports.renameOldMarkers = renameOldMarkers;
function processingArtboard(artboard) {
    return new Promise((resolve, reject) => {
        for (let layer of artboard.getAllChildren()) {
            renameIfIsMarker(layer);
        }
        resolve(true);
    });
}
function renameIfIsMarker(layer) {
    if (layer.type !== sketch_1.sketch.Types.Group)
        return;
    if (renameMarkerV1(layer))
        return;
    renameMarkerV2(layer);
}
exports.renameIfIsMarker = renameIfIsMarker;
function renameMarkerV2(mark) {
    if (!MARK_V2.test(mark.name))
        return false;
    mark.name = '#meaxure-' + mark.name.substring(1);
    return true;
}
function renameMarkerV1(mark) {
    let match = MARK_V1.exec(mark.name);
    if (!match)
        return false;
    let leftPart = '';
    switch (match[1]) {
        case 'WIDTH':
            leftPart = 'width-bottom';
            break;
        case 'HEIGHT':
            leftPart = 'height-left';
            break;
        case 'TOP':
            leftPart = 'spacing-top';
            break;
        case 'RIGHT':
            leftPart = 'spacing-right';
            break;
        case 'BOTTOM':
            leftPart = 'spacing-bottom';
            break;
        case 'LEFT':
            leftPart = 'spacing-left';
            break;
        case 'VERTICAL':
            leftPart = 'spacing-left';
            break;
        case 'HORIZONTAL':
            leftPart = 'spacing-left';
            break;
        case 'NOTE':
            leftPart = 'note';
            break;
        case 'PROPERTY':
            leftPart = 'properties';
            break;
        case 'OVERLAY':
            leftPart = 'overlay';
            break;
        default:
            break;
    }
    mark.name = '#meaxure-' + leftPart + '-' + mark.name.split('#')[1];
    return true;
}
//# sourceMappingURL=renameOldMarkers.js.map