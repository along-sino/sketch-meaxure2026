"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTintInfo = exports.applyTintToSMGradient = exports.applyTintToSMColor = exports.applyTint = exports.updateTintStackBeforeLayer = exports.pushTintStack = exports.clearTintStack = void 0;
const sketch_1 = require("../../sketch");
const styles_1 = require("../helpers/styles");
const layers_1 = require("./layers");
let tintStack = [];
function clearTintStack() {
    tintStack = [];
}
exports.clearTintStack = clearTintStack;
function pushTintStack(tint) {
    tintStack.push(tint);
}
exports.pushTintStack = pushTintStack;
function updateTintStackBeforeLayer(layer) {
    if (!tintStack.length)
        return;
    // check if tints still applies
    // remove tint from stack if meet stop layer
    while (true) {
        // pop all stopped tint stops from stack
        if (!tintStack.length)
            return;
        let tint = tintStack[tintStack.length - 1];
        if (layer.id !== tint.stopLayerID)
            return;
        tintStack.pop();
    }
}
exports.updateTintStackBeforeLayer = updateTintStackBeforeLayer;
function applyTint(layer, layerData) {
    // If no active tints, nothing to do
    if (!tintStack.length)
        return;
    if (layer.type == sketch_1.sketch.Types.Group)
        return;
    // the first tint of the stack applied to current layer
    // logger.debug(`${layer.name} has tint from ${tintStack.reduce((p, c) => p += c.name + ',', '')}`)
    let tint = tintStack[0];
    // apply tint to fills and text color
    if (layerData.fills)
        layerData.fills.forEach(fill => {
            if (fill.fillType == sketch_1.sketch.Style.FillType.Color) {
                fill.color = applyTintToSMColor(fill.color, tint.color);
                return;
            }
            else if (fill.fillType == sketch_1.sketch.Style.FillType.Gradient) {
                fill.gradient = applyTintToSMGradient(fill.gradient, tint.color);
                return;
            }
        });
    if (layerData.color)
        layerData.color = applyTintToSMColor(layerData.color, tint.color);
}
exports.applyTint = applyTint;
function applyTintToSMColor(color, tintColor) {
    if (!color)
        return color;
    // logger.debug(`current: ${color}, tint: ${tintColor}`);
    let tintAlpha = parseInt(tintColor.substr(7, 2), 16);
    let alpha = Math.round(color.alpha * tintAlpha / 255);
    // logger.debug(`new alpha: ${alpha.toString(16)}, ${alpha / 255 * 100}%`);
    let appliedColor = `${tintColor.substr(0, 7)}${alpha.toString(16)}`;
    color = styles_1.parseColor(appliedColor);
    // logger.debug(`applied: ${color["rgba-hex"]}`);
    return color;
}
exports.applyTintToSMColor = applyTintToSMColor;
function applyTintToSMGradient(gradient, tintColor) {
    if (!gradient)
        return gradient;
    gradient.colorStops.forEach(stop => {
        stop.color = applyTintToSMColor(stop.color, tintColor);
    });
    return gradient;
}
exports.applyTintToSMGradient = applyTintToSMGradient;
function getTintInfo(layer) {
    if (layer.type !== sketch_1.sketch.Types.Group || !layer.style.fills || !layer.style.fills.length)
        return null;
    let fills = layer.style.fills.filter(f => f.enabled);
    if (!fills.length)
        return null;
    let tint = { color: fills[0].color, stopLayerID: layer.id };
    return layers_1.LayerPlaceholder.fromTint(tint);
}
exports.getTintInfo = getTintInfo;
//# sourceMappingURL=tint.js.map