"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.alignLayersByPosition = exports.alignLayers = exports.EdgeVertical = exports.Edge = void 0;
const __1 = require("..");
var Edge;
(function (Edge) {
    Edge["left"] = "left";
    Edge["right"] = "right";
    Edge["center"] = "center";
})(Edge = exports.Edge || (exports.Edge = {}));
var EdgeVertical;
(function (EdgeVertical) {
    EdgeVertical["top"] = "top";
    EdgeVertical["bottom"] = "bottom";
    EdgeVertical["middle"] = "middle";
})(EdgeVertical = exports.EdgeVertical || (exports.EdgeVertical = {}));
function alignLayers(from, to, horizontal, vertical) {
    // TODO: align rotated layers
    if (!horizontal && !vertical)
        return;
    let hAligh;
    let vAligh;
    if (horizontal)
        hAligh = Object.assign({ from: Edge.left, to: Edge.left }, horizontal);
    if (vertical)
        vAligh = Object.assign({ from: EdgeVertical.top, to: EdgeVertical.top }, vertical);
    let root = from.getParentArtboard() || from.getParentPage();
    if (to instanceof __1.sketch.Layer) {
        let rootTo = to.getParentArtboard() || to.getParentPage();
        if (root.id !== rootTo.id) {
            // logger.debug(`from in ${root.name} while to in ${rootTo}, skipping`);
            return;
        }
    }
    let frameFrom = from.frame.changeBasis({ from: from.parent, to: root });
    let frameTo = (to instanceof __1.sketch.Layer) ? to.frame.changeBasis({ from: to.parent, to: root }) : to;
    let offsetX = 0;
    let offsetY = 0;
    if (hAligh) {
        // left-to-left offset
        offsetX = frameTo.x - frameFrom.x;
        if (hAligh.from == Edge.center)
            offsetX -= frameFrom.width / 2;
        if (hAligh.from == Edge.right)
            offsetX -= frameFrom.width;
        if (hAligh.to == Edge.center)
            offsetX += frameTo.width / 2;
        if (hAligh.to == Edge.right)
            offsetX += frameTo.width;
    }
    if (vertical) {
        // top-to-top offset
        offsetY = frameTo.y - frameFrom.y;
        if (vAligh.from == EdgeVertical.middle)
            offsetY -= frameFrom.height / 2;
        if (vAligh.from == EdgeVertical.bottom)
            offsetY -= frameFrom.height;
        if (vAligh.to == EdgeVertical.middle)
            offsetY += frameTo.height / 2;
        if (vAligh.to == EdgeVertical.bottom)
            offsetY += frameTo.height;
    }
    from.frame.offset(offsetX, offsetY);
}
exports.alignLayers = alignLayers;
function alignLayersByPosition(from, to, position) {
    switch (position) {
        case Edge.center:
        case EdgeVertical.middle:
            from.alignTo(to, { from: Edge.center, to: Edge.center }, { from: EdgeVertical.middle, to: EdgeVertical.middle });
            break;
        case Edge.left:
            from.alignTo(to, { from: Edge.right, to: Edge.left }, { from: EdgeVertical.middle, to: EdgeVertical.middle });
            break;
        case Edge.right:
            from.alignTo(to, { from: Edge.left, to: Edge.right }, { from: EdgeVertical.middle, to: EdgeVertical.middle });
            break;
        case EdgeVertical.top:
            from.alignTo(to, { from: Edge.center, to: Edge.center }, { from: EdgeVertical.bottom, to: EdgeVertical.top });
            break;
        case EdgeVertical.bottom:
            from.alignTo(to, { from: Edge.center, to: Edge.center }, { from: EdgeVertical.top, to: EdgeVertical.bottom });
            break;
        default:
            break;
    }
}
exports.alignLayersByPosition = alignLayersByPosition;
//# sourceMappingURL=alignment.js.map