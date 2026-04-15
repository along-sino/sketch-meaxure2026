"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPropertiesAll = exports.markProperties = void 0;
const language_1 = require("./common/language");
const helper_1 = require("./helpers/helper");
const propertiesPanel_1 = require("./panels/propertiesPanel");
const context_1 = require("./common/context");
const sketch_1 = require("../sketch");
const styles_1 = require("./helpers/styles");
const interfaces_1 = require("./interfaces");
const elements_1 = require("./helpers/elements");
const alignment_1 = require("../sketch/layer/alignment");
const tint_1 = require("./export/tint");
function markProperties(position) {
    return __awaiter(this, void 0, void 0, function* () {
        let selection = context_1.context.selection;
        if (selection.length <= 0) {
            sketch_1.sketch.UI.message(language_1.localize("Select a layer to mark!"));
            return false;
        }
        if (!(yield propertiesPanel_1.propertiesPanel()))
            return false;
        for (let target of selection.layers) {
            properties({
                target: target,
                position: position,
                properties: context_1.context.configs.properties
            });
        }
    });
}
exports.markProperties = markProperties;
function markPropertiesAll() {
    let selection = context_1.context.selection.layers;
    if (selection.length <= 0) {
        sketch_1.sketch.UI.message(language_1.localize("Select a layer to mark!"));
        return false;
    }
    for (let target of selection) {
        properties({
            target: target,
            position: alignment_1.Edge.right,
            properties: ["layer-name", "color", "border", "opacity", "radius", "shadow", "font-size", "font-face", "character", "line-height", "paragraph", "style-name"]
        });
    }
}
exports.markPropertiesAll = markPropertiesAll;
function properties(options) {
    options = Object.assign({
        properties: ["layer-name", "color", "border", "opacity", "radius", "shadow", "font-size", "line-height", "font-face", "character", "paragraph", "style-name"]
    }, options);
    let target = options.target;
    let name = "#meaxure-properties-" + target.id;
    let artboard = target.getParentArtboard();
    let root = artboard || target.getParentPage();
    if (!root)
        return;
    sketch_1.sketch.find(`Group, [name="${name}"]`, root).forEach(g => g.remove());
    let bubble = elements_1.createBubble(options.content || getProperties(target, options.properties), {
        name: name,
        parent: root,
        foreground: context_1.context.meaxureStyles.property.foreground,
        background: context_1.context.meaxureStyles.property.background,
        bubblePosition: options.position,
    });
    bubble.alignToByPostion(target, options.position);
}
function findTint(layer) {
    let tint;
    let parent = layer.parent;
    while (parent && parent.type !== sketch_1.sketch.Types.Artboard && parent.type !== sketch_1.sketch.Types.Page) {
        if (parent.style && parent.style.fills && parent.style.fills.length) {
            let fills = parent.style.fills.filter(f => f.enabled);
            if (!fills.length)
                continue;
            tint = fills[0];
        }
        parent = parent.parent;
    }
    return tint;
}
function getProperties(target, properties) {
    let targetStyle = target.style;
    let elements = properties.map((property) => {
        let results = [];
        switch (property) {
            case "color":
                // don't mark tint color
                if (target.type == sketch_1.sketch.Types.Group ||
                    target.type == sketch_1.sketch.Types.SymbolInstance)
                    return undefined;
                let tint = findTint(target);
                if (target.type == sketch_1.sketch.Types.Text) {
                    let color = styles_1.parseColor(targetStyle.textColor);
                    if (tint)
                        color = tint_1.applyTintToSMColor(color, tint.color);
                    results.push("color: " + color[context_1.context.configs.format]);
                }
                let fills = styles_1.getFillsFromStyle(targetStyle).reverse();
                fills.forEach(fill => {
                    if (tint) {
                        if (fill.fillType == sketch_1.sketch.Style.FillType.Color) {
                            fill.color = tint_1.applyTintToSMColor(fill.color, tint.color);
                        }
                        else if (fill.fillType == sketch_1.sketch.Style.FillType.Gradient) {
                            fill.gradient = tint_1.applyTintToSMGradient(fill.gradient, tint.color);
                        }
                    }
                    results.push("fill: " + fillTypeContent(fill));
                });
                return results.join('\n');
            case "border":
                let bordersJSON = styles_1.getBordersFromStyle(targetStyle);
                if (bordersJSON.length <= 0)
                    return undefined;
                let borderJSON = bordersJSON.pop();
                return "border: " + helper_1.convertUnit(borderJSON.thickness) + " " + borderJSON.position + "\r\n * " + fillTypeContent(borderJSON);
            case "opacity":
                return "opacity: " + Math.round(targetStyle.opacity * 100) + "%";
            case "radius":
                if (target.type !== sketch_1.sketch.Types.ShapePath)
                    return undefined;
                return "radius: " + helper_1.convertUnit(styles_1.getLayerRadius(target));
            case "shadow":
                let shadows = styles_1.getShadowsFromStyle(targetStyle);
                let innerShadow = shadows.filter(s => s.type == interfaces_1.shadowType.inner)[0];
                let outerShadow = shadows.filter(s => s.type == interfaces_1.shadowType.outer)[0];
                if (outerShadow) {
                    results.push("shadow: outer\r\n" + shadowContent(outerShadow));
                }
                if (innerShadow) {
                    results.push("shadow: inner\r\n" + shadowContent(innerShadow));
                }
                return results.join('\n');
            case "font-size":
                if (target.type != sketch_1.sketch.Types.Text)
                    return undefined;
                return "font-size: " + helper_1.convertUnit(targetStyle.fontSize, true);
            case "line-height":
                if (target.type != sketch_1.sketch.Types.Text)
                    return undefined;
                let lineHeight = targetStyle.lineHeight;
                if (!lineHeight)
                    return undefined;
                return "line: " + helper_1.convertUnit(lineHeight, true) + " (" + Math.round(lineHeight / targetStyle.fontSize * 10) / 10 + ")";
            case "font-face":
                if (target.type != sketch_1.sketch.Types.Text)
                    return undefined;
                return "font-face: " + targetStyle.fontFamily;
            case "character":
                if (target.type != sketch_1.sketch.Types.Text)
                    return undefined;
                return "character: " + helper_1.convertUnit(targetStyle.kerning, true);
            case "paragraph":
                if (target.type != sketch_1.sketch.Types.Text)
                    return undefined;
                return "paragraph: " + helper_1.convertUnit(targetStyle.paragraphSpacing, true);
            case "style-name":
                // sharedStyle on group applies as tint, not looks exactly to it
                // don't mark style name to avoid confusion
                if (target.type == sketch_1.sketch.Types.Group ||
                    target.type == sketch_1.sketch.Types.SymbolInstance)
                    return undefined;
                let sharedStyle = target.sharedStyle;
                if (sharedStyle)
                    return "style-name: " + sharedStyle.name;
                break;
            case "layer-name":
                return "layer-name: " + target.name;
            default:
                break;
        }
    });
    return elements.filter(e => !!e).join('\n');
}
function fillTypeContent(fillJSON) {
    if (fillJSON.fillType == "Color") {
        return fillJSON.color[context_1.context.configs.format];
    }
    if (fillJSON.fillType == "Gradient") {
        let fc = [];
        fc.push(fillJSON.gradient.type);
        fillJSON.gradient.colorStops.forEach(function (stop) {
            fc.push(" " + Math.round(stop.position * 100) + "%: " + stop.color[context_1.context.configs.format]);
        });
        return fc.join("\n");
    }
}
function shadowContent(shadow) {
    let sc = [];
    sc.push(" * x, y - " + helper_1.convertUnit(shadow.offsetX) + ", " + helper_1.convertUnit(shadow.offsetY));
    if (shadow.blurRadius)
        sc.push(" * blur - " + helper_1.convertUnit(shadow.blurRadius));
    if (shadow.spread)
        sc.push(" * spread - " + helper_1.convertUnit(shadow.spread));
    return sc.join("\r\n");
}
//# sourceMappingURL=properties.js.map