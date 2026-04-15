"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendShapePath = void 0;
const _1 = require(".");
function extendShapePath() {
    let target = _1.sketch.ShapePath.prototype;
    Object.defineProperty(target, "radius", {
        get: function () {
            if (!this.sketchObject.cornerRadiusString)
                return undefined;
            let cornerRadius = this.sketchObject.cornerRadiusString();
            if (!cornerRadius)
                return undefined;
            return cornerRadius.split(';').map(Number);
        }
    });
}
exports.extendShapePath = extendShapePath;
//# sourceMappingURL=shapePath.js.map