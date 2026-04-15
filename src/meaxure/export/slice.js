"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlice = exports.getCollectedSlices = exports.clearSliceCache = void 0;
const _1 = require(".");
const context_1 = require("../common/context");
const files_1 = require("./files");
const sketch_1 = require("../../sketch");
let slices = [];
let sliceCache = {};
function clearSliceCache() {
    slices = [];
    sliceCache = {};
}
exports.clearSliceCache = clearSliceCache;
function getCollectedSlices() {
    return slices;
}
exports.getCollectedSlices = getCollectedSlices;
function getSlice(layer, layerData, symbolLayer) {
    let sliceID = layer.id;
    let sliceName = layer.name;
    let formats;
    if (layer.exportFormats.length > 0) {
        formats = layer.exportFormats;
        if (symbolLayer) {
            sliceID = symbolLayer.id;
            sliceName = symbolLayer.name;
        }
    }
    else if (layer.type == sketch_1.sketch.Types.SymbolInstance) {
        let layerMaster = layer.master;
        // symbol instance of none, #4
        if (!layerMaster)
            return;
        if (!layerMaster.exportFormats.length)
            return;
        formats = layerMaster.exportFormats;
        sliceID = layerMaster.id;
        sliceName = layerMaster.name;
    }
    if (!formats)
        return;
    layerData.objectID = sliceID;
    // export it, if haven't yet
    if (!sliceCache[sliceID]) {
        NSFileManager.defaultManager()
            .createDirectoryAtPath_withIntermediateDirectories_attributes_error(_1.assetsPath, true, nil, nil);
        sliceCache[sliceID] = layerData.exportable = getExportable(layer, formats);
        slices.push({
            name: sliceName,
            objectID: sliceID,
            rect: layerData.rect,
            exportable: layerData.exportable
        });
    }
    else if (sliceCache[sliceID]) {
        layerData.exportable = sliceCache[sliceID];
    }
}
exports.getSlice = getSlice;
function getExportable(layer, formats) {
    let exportable = [];
    let exportFormats = formats.map(s => parseExportFormat(s, layer));
    for (let exportFormat of exportFormats) {
        let prefix = exportFormat.prefix || "", suffix = exportFormat.suffix || "";
        files_1.exportImage(layer, {
            scale: exportFormat.scale,
            prefix: prefix,
            suffix: suffix,
            format: exportFormat.format
        }, _1.assetsPath, '', layer.name);
        exportable.push({
            name: layer.name,
            format: exportFormat.format,
            path: prefix + layer.name + suffix + "." + exportFormat.format
        });
    }
    return exportable;
}
function parseExportFormat(format, layer) {
    let scale = 1;
    let numberReg = /\d+(\.\d+)?/i;
    let sizeNumber = parseFloat(numberReg.exec(format.size)[0]);
    if (format.size.endsWith('x')) {
        scale = sizeNumber / context_1.context.configs.resolution;
    }
    else if (format.size.endsWith('h') || format.size.endsWith('height')) {
        scale = sizeNumber / layer.frame.height;
    }
    else if (format.size.endsWith('w') || format.size.endsWith('width') || format.size.endsWith('px')) {
        scale = sizeNumber / layer.frame.width;
    }
    return {
        scale: scale,
        suffix: format.suffix ? format.suffix : "",
        prefix: format.prefix ? format.prefix : "",
        format: format.fileFormat,
    };
}
//# sourceMappingURL=slice.js.map