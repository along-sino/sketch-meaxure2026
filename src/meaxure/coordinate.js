"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCoordinate = void 0;
const context_1 = require("./common/context");
const language_1 = require("./common/language");
const sketch_1 = require("../sketch");
const elements_1 = require("./helpers/elements");
const alignment_1 = require("../sketch/layer/alignment");
const helper_1 = require("./helpers/helper");
const resizingConstraint_1 = require("../sketch/layer/resizingConstraint");
function drawCoordinate() {
    if (context_1.context.selection.length <= 0) {
        sketch_1.sketch.UI.message(language_1.localize("Select any layer to mark!"));
        return false;
    }
    for (let layer of context_1.context.selection.layers) {
        coordinateLayer(layer);
    }
}
exports.drawCoordinate = drawCoordinate;
function coordinateLayer(layer) {
    let layerID = layer.id;
    let layerName = "#meaxure-coordinate-" + layerID;
    let artboard = layer.getParentArtboard();
    let root = artboard || layer.getParentPage();
    if (!root)
        return;
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    let layerRect = context_1.context.configs.byInfluence ? layer.frameInfluence : layer.frame;
    let artboardRect = context_1.context.configs.byInfluence ? root.frameInfluence : root.frame;
    if (artboard) {
        layerRect = layerRect.changeBasis({ from: layer.parent, to: artboard });
        artboardRect = artboardRect.changeBasis({ from: artboard.parent, to: artboard });
    }
    let container = new sketch_1.sketch.Group({ name: layerName, parent: root });
    let cross = new sketch_1.sketch.Group({ name: 'cross', parent: container });
    let crossX = new sketch_1.sketch.ShapePath({ parent: cross });
    crossX.frame.width = 17;
    crossX.frame.height = 1;
    crossX.sharedStyle = context_1.context.meaxureStyles.coordinate.background;
    crossX.style = Object.assign({}, context_1.context.meaxureStyles.coordinate.background.style);
    let crossY = crossX.duplicate();
    crossY.transform.rotation = 90;
    crossY.alignToByPostion(crossX, alignment_1.Edge.center);
    cross.adjustToFit();
    let posX = helper_1.lengthUnit(layerRect.x - artboardRect.x);
    let posY = helper_1.lengthUnit(layerRect.y - artboardRect.y);
    let text = posX + ", " + posY;
    let label = elements_1.createLabel(text, {
        parent: container,
        name: 'label',
        foreground: context_1.context.meaxureStyles.coordinate.foreground,
        background: context_1.context.meaxureStyles.coordinate.background
    });
    label.alignTo(cross, { from: alignment_1.Edge.left, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.top, to: alignment_1.EdgeVertical.middle });
    label.frame.offset(2, 2);
    cross.resizingConstraint = resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height &
        resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.top;
    label.resizingConstraint = cross.resizingConstraint;
    container.adjustToFit();
    container.frame.x = layerRect.x - 8;
    container.frame.y = layerRect.y - 8;
}
//# sourceMappingURL=coordinate.js.map