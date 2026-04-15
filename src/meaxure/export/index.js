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
exports.exportSpecification = exports.stopwatch = exports.assetsPath = exports.savePath = void 0;
const exportPanel_1 = require("../panels/exportPanel");
const sketch_1 = require("../../sketch");
const language_1 = require("../common/language");
const context_1 = require("../common/context");
const webviewPanel_1 = require("../../webviewPanel");
const helper_1 = require("../helpers/helper");
const files_1 = require("./files");
const logger_1 = require("../common/logger");
const layerData_1 = require("./layerData");
const slice_1 = require("./slice");
const mask_1 = require("./mask");
const colors_1 = require("./colors");
const tint_1 = require("./tint");
const tempLayers_1 = require("./tempLayers");
const layers_1 = require("./layers");
exports.stopwatch = helper_1.newStopwatch();
function exportSpecification() {
    return __awaiter(this, void 0, void 0, function* () {
        const RUNNING_FLAG_KEY = "co.jebbs.sketch-meaxure.exporting";
        if (sketch_1.sketch.Settings.sessionVariable(RUNNING_FLAG_KEY)) {
            sketch_1.sketch.UI.message(language_1.localize('Please wait for former task to exit'));
            return;
        }
        let results = yield exportPanel_1.exportPanel();
        if (!results)
            return;
        if (results.selection.length <= 0)
            return false;
        let document = context_1.context.document;
        exports.savePath = sketch_1.sketch.UI.savePanel(language_1.localize("Export spec"), language_1.localize("Export to:"), language_1.localize("Export"), true, document.fileName);
        if (!exports.savePath)
            return;
        exports.assetsPath = exports.savePath + "/assets";
        sketch_1.sketch.Settings.setSessionVariable(RUNNING_FLAG_KEY, true);
        exports.stopwatch.restart();
        mask_1.clearMaskStack();
        // stopwatch.tik('clearMaskStack');
        tint_1.clearTintStack();
        // stopwatch.tik('clearTintStack');
        slice_1.clearSliceCache();
        // stopwatch.tik('clearSliceCache');
        let processingPanel = webviewPanel_1.createWebviewPanel({
            url: helper_1.getResourcePath() + "/panel/processing.html",
            width: 304,
            height: 104,
        });
        processingPanel.onClose(() => cancelled = true);
        processingPanel.show();
        // stopwatch.tik('processingPanel');
        let onFinishCleanup = function () {
            tempLayers_1.tempLayers.removeAll();
            sketch_1.sketch.Settings.setSessionVariable(RUNNING_FLAG_KEY, false);
            processingPanel.close();
        };
        let template = NSString.stringWithContentsOfFile_encoding_error(helper_1.getResourcePath() + "/template.html", 4, nil);
        let data = {
            resolution: context_1.context.configs.resolution,
            unit: context_1.context.configs.units,
            colorFormat: context_1.context.configs.format,
            artboards: [],
            slices: [],
            colors: colors_1.getDocumentColors(document),
            languages: language_1.getAllLanguage(),
        };
        // stopwatch.tik('load template');
        let cancelled = false;
        let layerIndex = 0;
        for (let i = 0; i < results.selection.length; i++) {
            let select = results.selection[i];
            let artboard = select.artboard;
            let page = artboard.parent;
            let fileName = helper_1.toSlug(page.name + ' ' + (artboard.index + 1) + ' ' + artboard.name);
            data.artboards[i] = {
                notes: [],
                layers: [],
            };
            data.artboards[i].pageName = helper_1.toHTMLEncode(helper_1.emojiToEntities(page.name));
            data.artboards[i].pageObjectID = page.id;
            data.artboards[i].name = helper_1.toHTMLEncode(helper_1.emojiToEntities(artboard.name));
            data.artboards[i].slug = fileName;
            data.artboards[i].objectID = artboard.id;
            data.artboards[i].width = artboard.frame.width;
            data.artboards[i].height = artboard.frame.height;
            data.artboards[i].flowStartPoint = artboard.flowStartPoint;
            // stopwatch.tik('collect artboards info');
            for (let layer of select.children) {
                layerIndex++;
                if (cancelled) {
                    onFinishCleanup();
                    sketch_1.sketch.UI.message(language_1.localize('Cancelled by user'));
                    return;
                }
                // stopwatch.tik('renameIfIsMarker');
                let taskError;
                // stopwatch.tik('before promise');
                yield getLayerTask(artboard, layer, data.artboards[i], results.byInfluence)
                    .catch(err => taskError = err);
                if (taskError) {
                    onFinishCleanup();
                    if (!(layer instanceof layers_1.LayerPlaceholder)) {
                        // select the error layer
                        document.selectedLayers.layers = [layer];
                        let msg = `Error processing layer ${layer.name}.`;
                        logger_1.logger.error(msg, taskError);
                    }
                    else {
                        logger_1.logger.error(taskError);
                    }
                    return;
                }
                // stopwatch.tik('after promise');
                // post messages after an async task, 
                // so that processingPanel has time to initialize,
                // or we get a promise reject of reply timeout.
                processingPanel.postMessage('process', {
                    percentage: Math.round(layerIndex / results.layersCount * 100),
                    text: language_1.localize("Processing layer %@ of %@", layerIndex, results.layersCount)
                });
                // stopwatch.tik('show process');
            }
            if (results.advancedMode) {
                exportArtboardAdvanced(artboard, data, exports.savePath, i);
            }
            else {
                exportArtboard(artboard, data, i, exports.savePath, template);
            }
            // stopwatch.tik('export artboard');
        }
        data.slices = slice_1.getCollectedSlices();
        let selectingPath = exports.savePath;
        if (results.advancedMode) {
            files_1.writeFile({
                content: files_1.buildTemplate(template, data),
                path: exports.savePath,
                fileName: "index.html"
            });
            files_1.writeFile({
                content: '<meta http-equiv="refresh" content="0;url=index.html#p">',
                path: exports.savePath,
                fileName: "proto.html"
            });
            selectingPath = exports.savePath + "/index.html";
        }
        // stopwatch.tik('generate index.html');
        onFinishCleanup();
        sketch_1.sketch.UI.showFiles([selectingPath]);
        sketch_1.sketch.UI.message(language_1.localize("Export complete! Takes %@ seconds", exports.stopwatch.elpased() / 1000));
        // let statistics = stopwatch.statistics()
        // sketch.UI.alert('statistics', Object.keys(statistics).map(key => `${key}: ${statistics[key] / 1000}s`).join('\n'))
    });
}
exports.exportSpecification = exportSpecification;
function getLayerTask(artboard, layer, data, byInfluence, symbolLayer) {
    return new Promise((resolve, reject) => {
        try {
            layerData_1.getLayerData(artboard, layer, data, byInfluence, symbolLayer);
        }
        catch (error) {
            reject(error);
        }
        resolve(true);
    });
}
function exportArtboardAdvanced(artboard, data, savePath, i) {
    // data.artboards[artboardIndex].imagePath = "preview/" + objectID + ".png";
    data.artboards[i].imagePath = files_1.exportImage(artboard, {
        format: 'png',
        // always export @2x (logic points * 2)
        // if design resolution @2x, we export as is (scale=1)
        // if design resolution @4x, we export half size (scale=0.5)
        scale: 2 / data.resolution,
        prefix: "",
        suffix: "",
    }, savePath, "preview/" + data.artboards[i].slug, data.artboards[i].name);
    data.artboards[i].imageIconPath = files_1.exportImage(artboard, {
        format: 'png',
        // scale: 300 / Math.max(data.artboards[i].width, data.artboards[i].height),
        scale: 0.5,
        prefix: "",
        suffix: "",
    }, savePath, "preview/icons/" + data.artboards[i].slug, data.artboards[i].name);
    files_1.writeFile({
        content: "<meta http-equiv=\"refresh\" content=\"0;url=../index.html#" + i + "\">",
        path: savePath + "/links",
        fileName: data.artboards[i].slug + ".html"
    });
}
function exportArtboard(artboard, exportData, index, savePath, template) {
    let data = JSON.parse(JSON.stringify(exportData.artboards[index]));
    let imageBase64 = files_1.exportImageToBuffer(artboard, {
        format: 'png',
        // always export @2x (logic points * 2)
        // if design resolution @2x, we export as is (scale=1)
        // if design resolution @4x, we export half size (scale=0.5)
        scale: 2 / exportData.resolution,
        prefix: "",
        suffix: "",
    }).toString('base64');
    data.imageBase64 = 'data:image/png;base64,' + imageBase64;
    let newData = {
        resolution: exportData.resolution,
        unit: exportData.unit,
        colorFormat: exportData.colorFormat,
        artboards: [data],
        slices: [],
        colors: [],
        languages: exportData.languages,
    };
    files_1.writeFile({
        content: files_1.buildTemplate(template, newData),
        path: savePath,
        fileName: data.slug + ".html"
    });
}
//# sourceMappingURL=index.js.map