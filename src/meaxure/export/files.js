"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTemplate = exports.writeFile = exports.exportImageToBuffer = exports.exportImage = void 0;
const sketch_1 = require("../../sketch");
const context_1 = require("../common/context");
const helper_1 = require("../helpers/helper");
function exportImage(layer, format, savePath, path, name) {
    let document = context_1.context.sketchObject.document;
    // Fix for Sketch 2025.1: Use the new export API instead of MSExportRequest
    let fileName = [
        name,
        format.scale ? `@${format.scale}x` : "",
        ".",
        format.format
    ].join("");
    // Create directory if it doesn't exist
    NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, true, nil, nil);
    // Use the new sketch.export API for file export
    sketch_1.sketch.export(layer, {
        output: savePath + '/' + path,
        formats: format.format,
        scales: format.scale.toString(),
    });
    return encodeURI(path + "/" + fileName);
}
exports.exportImage = exportImage;
function exportImageToBuffer(layer, format) {
    return sketch_1.sketch.export(layer, {
        output: null,
        formats: format.format,
        scales: format.scale.toString(),
    });
}
exports.exportImageToBuffer = exportImageToBuffer;
function writeFile(options) {
    options = Object.assign({
        content: "Type something!",
        path: helper_1.toJSString(NSTemporaryDirectory()),
        fileName: "temp.txt"
    }, options);
    let content = NSString.stringWithString(options.content), savePathName = [];
    NSFileManager
        .defaultManager()
        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);
    savePathName.push(options.path, "/", options.fileName);
    let savePath = savePathName.join("");
    content.writeToFile_atomically_encoding_error(savePath, false, 4, null);
}
exports.writeFile = writeFile;
function buildTemplate(content, data) {
    return content.replace("'{{data}}'", JSON.stringify(data));
}
exports.buildTemplate = buildTemplate;
//# sourceMappingURL=files.js.map