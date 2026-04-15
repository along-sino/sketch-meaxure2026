"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayerData = void 0;
const interfaces_1 = require("../interfaces");
const sketch_1 = require("../../sketch");
const helper_1 = require("../helpers/helper");
const textFragment_1 = require("./textFragment");
const mask_1 = require("./mask");
const styles_1 = require("../helpers/styles");
const slice_1 = require("./slice");
const note_1 = require("./note");
const symbol_1 = require("./symbol");
const tint_1 = require("./tint");
const flow_1 = require("./flow");
const tempLayers_1 = require("./tempLayers");
const renameOldMarkers_1 = require("../helpers/renameOldMarkers");
const layers_1 = require("./layers");
function getLayerData(artboard, layer, data, byInfluence, symbolLayer) {
    if (layer instanceof layers_1.LayerPlaceholder) {
        dealWithPlaceholder(layer);
        return;
    }
    // compatible with meaxure markers
    renameOldMarkers_1.renameIfIsMarker(layer);
    // stopwatch.tik('before updateMaskStackBeforeLayer');
    mask_1.updateMaskStackBeforeLayer(layer);
    tint_1.updateTintStackBeforeLayer(layer);
    getLayerData2(artboard, layer, data, byInfluence, symbolLayer);
    // stopwatch.tik('update stack');
}
exports.getLayerData = getLayerData;
function dealWithPlaceholder(p) {
    switch (p.getType()) {
        case layers_1.LayerPlaceholderType.Tint:
            tint_1.pushTintStack(p.getValue());
            break;
        default:
            throw ("unknown LayerPlaceholder type: " + p.getType());
    }
}
function getLayerData2(artboard, layer, data, byInfluence, symbolLayer) {
    // stopwatch.tik('updateMaskStackBeforeLayer');
    let layerRect = getSMRect(layer, artboard, byInfluence);
    layerRect = mask_1.applyMasks(layer, layerRect, artboard);
    if (!layerRect) {
        return;
    }
    // stopwatch.tik('applyMasks');
    let note = note_1.makeNote(layer, artboard, symbolLayer);
    if (note) {
        data.notes.push(note);
        return;
    }
    // stopwatch.tik('make notes');
    let layerStates = getLayerStates(layer);
    // stopwatch.tik('getLayerStates');
    if (!isExportable(layer) ||
        layerStates.isHidden ||
        (layerStates.isLocked && layer.type != sketch_1.sketch.Types.Slice) ||
        layerStates.isEmptyText ||
        layerStates.isInSlice ||
        layerStates.isMeaXure ||
        layerStates.isInShapeGroup) {
        return;
    }
    let layerType = getSMType(layer);
    // stopwatch.tik('get layerType');
    let layerData = {
        objectID: symbolLayer ? symbolLayer.id : layer.id,
        type: layerType,
        name: helper_1.toHTMLEncode(helper_1.emojiToEntities(layer.name)),
        rect: layerRect,
    };
    data.layers.push(layerData);
    flow_1.getFlow(layer, layerData);
    // stopwatch.tik('getFlow');
    if (layerType == interfaces_1.SMType.hotspot) {
        return;
    }
    // stopwatch.tik('prepare layer data');
    getLayerStyles(layer, layerType, layerData);
    // stopwatch.tik('getLayerStyles');
    tint_1.applyTint(layer, layerData);
    // stopwatch.tik('applyTint');
    slice_1.getSlice(layer, layerData, symbolLayer);
    // stopwatch.tik('getSlice');
    if (layerData.type == interfaces_1.SMType.symbol) {
        symbol_1.getSymbol(artboard, layer, layerData, data, byInfluence);
    }
    textFragment_1.getTextFragment(artboard, layer, data);
    // stopwatch.tik('getTextFragment');
}
function getSMType(layer) {
    if (layer.exportFormats.length > 0)
        return interfaces_1.SMType.slice;
    let master = layer.master;
    if (master && master.exportFormats.length)
        return interfaces_1.SMType.slice;
    if (layer.type == sketch_1.sketch.Types.Text)
        return interfaces_1.SMType.text;
    if (layer.type == sketch_1.sketch.Types.SymbolInstance)
        return interfaces_1.SMType.symbol;
    if (layer.type == sketch_1.sketch.Types.Group)
        return interfaces_1.SMType.group;
    if (layer.type == sketch_1.sketch.Types.HotSpot)
        return interfaces_1.SMType.hotspot;
    return interfaces_1.SMType.shape;
}
function getLayerStyles(layer, layerType, layerData) {
    if (layerType != interfaces_1.SMType.slice) {
        let layerStyle = layer.style;
        layerData.shadows = styles_1.getShadowsFromStyle(layerStyle);
        layerData.rotation = layer.transform.rotation;
        layerData.opacity = layerStyle.opacity;
        if (layer.type !== sketch_1.sketch.Types.Group) {
            layerData.radius = styles_1.getLayerRadius(layer);
            layerData.borders = styles_1.getBordersFromStyle(layerStyle);
            // don't show tint fills for group
            layerData.fills = styles_1.getFillsFromStyle(layerStyle);
            let sharedStyle = layer.sharedStyle;
            layerData.styleName = sharedStyle ? sharedStyle.name : '';
        }
    }
    if (layerType == "text") {
        let text = layer;
        layerData.content = helper_1.toHTMLEncode(helper_1.emojiToEntities(text.text));
        layerData.color = styles_1.parseColor(text.style.textColor);
        layerData.fontSize = text.style.fontSize;
        layerData.fontFace = text.style.fontFamily;
        layerData.textAlign = text.style.alignment;
        layerData.letterSpacing = text.style.kerning || 0;
        layerData.lineHeight = text.style.lineHeight;
    }
    layerData.css = layer.CSSAttributes.filter(attr => !/\/\*/.test(attr));
}
function getSMRect(layer, artboard, byInfluence) {
    let layerFrame;
    if (byInfluence && layer.type != sketch_1.sketch.Types.Text) {
        // export the influence rect.(include the area of shadows and outside borders...)
        layerFrame = layer.frameInfluence.changeBasis({ from: layer.parent, to: artboard });
    }
    else {
        // export the default rect.
        layerFrame = layer.frame.changeBasis({ from: layer.parent, to: artboard });
    }
    return {
        x: layerFrame.x,
        y: layerFrame.y,
        width: layerFrame.width,
        height: layerFrame.height,
    };
}
function isExportable(layer) {
    return layer.type == sketch_1.sketch.Types.Text ||
        layer.type == sketch_1.sketch.Types.Group ||
        layer.type == sketch_1.sketch.Types.Shape ||
        layer.type == sketch_1.sketch.Types.ShapePath ||
        layer.type == sketch_1.sketch.Types.Image ||
        layer.type == sketch_1.sketch.Types.Slice ||
        layer.type == sketch_1.sketch.Types.SymbolInstance ||
        layer.type == sketch_1.sketch.Types.HotSpot;
}
function getLayerStates(layer) {
    let isHidden = false;
    let isLocked = false;
    let isInSlice = false;
    let isEmptyText = false;
    let isMeaXure = false;
    let isInShapeGroup = false;
    while (layer.type != sketch_1.sketch.Types.Artboard && layer.type != sketch_1.sketch.Types.SymbolMaster) {
        let parent = layer.parent;
        if (!isMeaXure)
            isMeaXure = layer.name.startsWith('#meaxure-');
        // if parents is shape, this is in shape group
        if (!isInShapeGroup)
            isInShapeGroup = parent.type == sketch_1.sketch.Types.Shape;
        if (!isHidden)
            isHidden = layer.hidden && !tempLayers_1.tempLayers.exists(layer);
        if (!isLocked)
            isLocked = layer.locked;
        if (!isInSlice)
            isInSlice = parent.type == sketch_1.sketch.Types.Group && parent.exportFormats.length > 0;
        if (!isEmptyText)
            isEmptyText = layer.type == sketch_1.sketch.Types.Text && layer.isEmpty;
        layer = parent;
    }
    return {
        isHidden: isHidden,
        isLocked: isLocked,
        isInSlice: isInSlice,
        isMeaXure: isMeaXure,
        isEmptyText: isEmptyText,
        isInShapeGroup: isInShapeGroup
    };
}
//# sourceMappingURL=layerData.js.map