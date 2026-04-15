"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendDocument = void 0;
const _1 = require(".");
function extendDocument() {
    let prototype = _1.sketch.Document.prototype;
    Object.defineProperty(prototype, "filePath", {
        get: function () {
            let sketchObject = this.sketchObject;
            return sketchObject.fileURL() ? sketchObject.fileURL().path().stringByDeletingLastPathComponent() : "~";
        }
    });
    Object.defineProperty(prototype, "fileName", {
        get: function () {
            let sketchObject = this.sketchObject;
            return sketchObject.displayName().stringByDeletingPathExtension();
        }
    });
}
exports.extendDocument = extendDocument;
//# sourceMappingURL=document.js.map