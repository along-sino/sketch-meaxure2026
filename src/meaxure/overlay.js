"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOverlays = void 0;
const language_1 = require("./common/language");
const context_1 = require("./common/context");
const sketch_1 = require("../sketch");
const resizingConstraint_1 = require("../sketch/layer/resizingConstraint");
function markOverlays() {
    let selection = context_1.context.selection;
    if (selection.length <= 0) {
        sketch_1.sketch.UI.message(language_1.localize("Select a layer to mark!"));
        return false;
    }
    for (let layer of selection.layers) {
        overlay(layer);
    }
}
exports.markOverlays = markOverlays;
function overlay(target) {
    let name = "#meaxure-overlay-" + target.id;
    let artboard = target.getParentArtboard();
    let root = artboard || target.getParentPage();
    if (!root)
        return;
    sketch_1.sketch.find(`Group, [name="${name}"]`, root).forEach(g => g.remove());
    let overlayStyle = context_1.context.meaxureStyles.overlay.background;
    let container = new sketch_1.sketch.Group({ name: name, parent: root });
    let overlay = new sketch_1.sketch.ShapePath({ name: 'overlay', parent: container });
    overlay.frame = target.frame.changeBasis({ from: target.parent, to: root });
    ;
    overlay.sharedStyle = overlayStyle;
    overlay.style = Object.assign({}, overlayStyle.style);
    overlay.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
        resizingConstraint_1.ResizingConstraint.bottom &
        resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.right;
    container.adjustToFit();
}
//# sourceMappingURL=overlay.js.map