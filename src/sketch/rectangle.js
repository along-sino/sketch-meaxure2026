"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendRectangle = void 0;
const _1 = require(".");
function extendRectangle() {
    let target = _1.sketch.Rectangle.prototype;
    target.intersection = function (to) {
        return getIntersection(this, to);
    };
    target.isEuqal = function (to) {
        return isEuqal(this, to);
    };
}
exports.extendRectangle = extendRectangle;
function getIntersection(a, b) {
    let x1 = Math.max(a.x, b.x);
    let y1 = Math.max(a.y, b.y);
    let x2 = Math.min(a.x + a.width, b.x + b.width);
    let y2 = Math.min(a.y + a.height, b.y + b.height);
    let width = x2 - x1;
    let height = y2 - y1;
    if (width < 0 || height < 0) {
        // no intersection
        return undefined;
    }
    return new _1.sketch.Rectangle(x1, y1, width, height);
}
function isEuqal(a, b) {
    return a.x == b.x && a.y == b.y &&
        a.width == b.width && a.height == b.height;
}
//# sourceMappingURL=rectangle.js.map