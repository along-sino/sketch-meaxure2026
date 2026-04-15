"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResizingConstraint = exports.setResizingConstraint = exports.ResizingConstraint = void 0;
var ResizingConstraint;
(function (ResizingConstraint) {
    ResizingConstraint[ResizingConstraint["top"] = 31] = "top";
    ResizingConstraint[ResizingConstraint["left"] = 59] = "left";
    ResizingConstraint[ResizingConstraint["right"] = 62] = "right";
    ResizingConstraint[ResizingConstraint["bottom"] = 55] = "bottom";
    ResizingConstraint[ResizingConstraint["height"] = 47] = "height";
    ResizingConstraint[ResizingConstraint["width"] = 61] = "width";
})(ResizingConstraint = exports.ResizingConstraint || (exports.ResizingConstraint = {}));
function setResizingConstraint(layer, constraint) {
    layer.sketchObject.setResizingConstraint(constraint);
}
exports.setResizingConstraint = setResizingConstraint;
function getResizingConstraint(layer) {
    return Number(layer.sketchObject.resizingConstraint());
}
exports.getResizingConstraint = getResizingConstraint;
//# sourceMappingURL=resizingConstraint.js.map