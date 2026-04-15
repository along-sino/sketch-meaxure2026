"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMasks = exports.updateMaskStackBeforeLayer = exports.clearMaskStack = void 0;
const helper_1 = require("../helpers/helper");
let maskStack = [];
function clearMaskStack() {
    maskStack = [];
}
exports.clearMaskStack = clearMaskStack;
function updateMaskStackBeforeLayer(layer) {
    // This function depends on the enumerate order of layers.
    // It requires the enumeration order from bottom layer to up, 
    // children first siblings later, which is same to mask influence direction.
    // So we firstly meet the mask layer, then it's influenced siblings and their children.
    // check if masks still applies
    validateMasks(layer);
    tryAddMask(layer);
}
exports.updateMaskStackBeforeLayer = updateMaskStackBeforeLayer;
function applyMasks(layer, layerRect, artboard) {
    // if (maskStack.length) logger.debug(`${layer.name} has clip mask of ${maskStack.reduce((p, c) => p += c.mask.name + ',', '')}`)
    for (let mask of maskStack) {
        // caculate intersection of layer and mask, as the clipped frame of the layer
        layerRect = helper_1.getIntersection(mask.rect, layerRect);
    }
    // caculate intersection of layer and artboard
    layerRect = helper_1.getIntersection(artboard.frame.changeBasis({ from: artboard.parent, to: artboard }), layerRect);
    return layerRect;
}
exports.applyMasks = applyMasks;
function validateMasks(layer) {
    if (!maskStack.length)
        return;
    // remove mask from stack if meet stop layer
    // We must loop until current not match,
    // given that we can have 2 or more masks in one group.
    for (let i = maskStack.length - 1; i >= 0; i--) {
        let m = maskStack[i];
        if (layer.id !== m.stopAt.id) {
            break;
        }
        // console.log(`mask ${m.mask.name} stops at layer ${m.stopAt.name}`);
        maskStack.pop();
    }
}
function tryAddMask(layer) {
    if (!layer.hasClippingMask) {
        return;
    }
    // find a mask, keep in stack. 
    let stopAt;
    let sibilings = layer.parent.layers;
    for (let i = layer.index + 1; i < sibilings.length; i++) {
        if (sibilings[i].shouldBreakMaskChain) {
            stopAt = sibilings[i];
            break;
        }
    }
    if (!stopAt)
        stopAt = layer.parent;
    // console.log(`find mask ${layer.name} will stop at layer ${stopAt.name}`);
    maskStack.push({
        mask: layer,
        stopAt: stopAt,
        rect: layer.frame.changeBasis({
            from: layer.parent,
            to: layer.getParentArtboard(),
        })
    });
}
//# sourceMappingURL=mask.js.map