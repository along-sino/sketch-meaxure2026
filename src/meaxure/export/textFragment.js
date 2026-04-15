"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextFragment = void 0;
const sketch_1 = require("../../sketch");
const layerData_1 = require("./layerData");
const alignment_1 = require("../../sketch/layer/alignment");
const tempLayers_1 = require("./tempLayers");
function getTextFragment(artboard, layer, data) {
    var _a, _b, _c, _d, _e, _f;
    if (layer.type != sketch_1.sketch.Types.Text || layer.getFragmentsCount() < 2)
        return;
    let fragments = layer.getFragments();
    // stopwatch.tik('get text fragments');
    let offsetFragmentsY = 0;
    let textFrame = layer.frame;
    let heightIfSingleLine = layer.style.lineHeight || Math.max(...fragments.map(f => f.defaultLineHeight));
    let lines;
    if (textFrame.height > heightIfSingleLine) {
        // only getFragmentsByLines when multi-line
        lines = getFragmentsByLines(layer, fragments);
    }
    else {
        lines = [fragments];
    }
    let textGroup = new sketch_1.sketch.Group({ parent: artboard });
    tempLayers_1.tempLayers.add(textGroup);
    for (let frags of lines) {
        if (frags == null) {
            // it's a new paragraph
            offsetFragmentsY += layer.style.paragraphSpacing;
            continue;
        }
        let offsetFragmentsX = 0;
        let lineGroup = new sketch_1.sketch.Group({ parent: textGroup });
        lineGroup.frame.x = 0;
        lineGroup.frame.y = offsetFragmentsY;
        let currentLineHeight = layer.style.lineHeight || Math.max(...frags.map(f => f.defaultLineHeight));
        for (let fragment of frags) {
            // Fix for Sketch 2025.1: Avoid accessing potentially problematic style properties
            if (fragment.style && fragment.style.fills) {
                fragment.style.fills.forEach(fill => {
                    // https://github.com/qjebbs/sketch-meaxure/issues/2
                    // https://github.com/sketch-hq/SketchAPI/issues/726
                    if (fill.pattern && fill.pattern.image === null)
                        fill.pattern.image = undefined;
                });
            }
            let subText = new sketch_1.sketch.Text({ text: fragment.text, parent: lineGroup });
            // Fix for Sketch 2025.1: Create a minimal style object with only necessary properties
            subText.style = {
                textColor: ((_a = fragment.style) === null || _a === void 0 ? void 0 : _a.textColor) || '#000000FF',
                fontSize: ((_b = fragment.style) === null || _b === void 0 ? void 0 : _b.fontSize) || 12,
                fontFamily: ((_c = fragment.style) === null || _c === void 0 ? void 0 : _c.fontFamily) || 'Helvetica',
                fontWeight: ((_d = fragment.style) === null || _d === void 0 ? void 0 : _d.fontWeight) || 400,
                textStrikethrough: ((_e = fragment.style) === null || _e === void 0 ? void 0 : _e.textStrikethrough) || null,
                textUnderline: ((_f = fragment.style) === null || _f === void 0 ? void 0 : _f.textUnderline) || null,
                lineHeight: currentLineHeight
            };
            subText.frame.x = offsetFragmentsX;
            subText.frame.y = 0;
            offsetFragmentsX += subText.frame.width;
        }
        lineGroup.adjustToFit();
        offsetFragmentsY += currentLineHeight;
    }
    switch (layer.style.alignment) {
        case sketch_1.sketch.Text.Alignment.center:
            for (let line of textGroup.layers) {
                line.alignTo(layer, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, false);
            }
            break;
        case sketch_1.sketch.Text.Alignment.right:
            for (let line of textGroup.layers) {
                line.alignTo(layer, { from: alignment_1.Edge.right, to: alignment_1.Edge.right }, false);
            }
            break;
        default:
            break;
    }
    textGroup.adjustToFit();
    switch (layer.style.verticalAlignment) {
        case sketch_1.sketch.Text.VerticalAlignment.top:
            textGroup.alignTo(layer, { from: alignment_1.Edge.left, to: alignment_1.Edge.left }, { from: alignment_1.EdgeVertical.top, to: alignment_1.EdgeVertical.top });
            break;
        case sketch_1.sketch.Text.VerticalAlignment.center:
            textGroup.alignTo(layer, { from: alignment_1.Edge.left, to: alignment_1.Edge.left }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
            break;
        case sketch_1.sketch.Text.VerticalAlignment.bottom:
            textGroup.alignTo(layer, { from: alignment_1.Edge.left, to: alignment_1.Edge.left }, { from: alignment_1.EdgeVertical.bottom, to: alignment_1.EdgeVertical.bottom });
            break;
        default:
            break;
    }
    // stopwatch.tik('create temp texts for fragments');
    for (let text of sketch_1.sketch.find('Text', textGroup)) {
        layerData_1.getLayerData(artboard, text, data, false);
    }
    textGroup.remove();
}
exports.getTextFragment = getTextFragment;
function getFragmentsByLines(layer, fragments) {
    let svg = sketch_1.sketch.export(layer, {
        output: null,
        formats: 'svg',
        scales: '1'
    }).toString();
    let lines = getFragmentLinesFromSVG(svg);
    let fragmentsByLines = [];
    let currentFragment = undefined;
    let isPrevNewLine = false;
    for (let line of lines) {
        let lineFragments = [];
        for (let element of line.elements) {
            if (!currentFragment)
                currentFragment = fragments.shift();
            while (currentFragment.text.startsWith('\r') || // new line
                currentFragment.text.startsWith('\n') || // new paragraph
                currentFragment.text.startsWith('\u2028') // a LINE SEPARATOR, new line
            ) {
                let count = 1;
                if (currentFragment.text.startsWith('\r\n')) {
                    count = 2;
                }
                // if currentFragment.text start with \n, it creates a new line, which doesn't appear in svg.
                // so just push a null (presents a new paragraph) for it, and split the fragment
                let leftPart;
                [leftPart, currentFragment] = splitFragment(currentFragment, count);
                if (isPrevNewLine)
                    fragmentsByLines.push([]);
                // push a null to represent a new paragraph
                if (leftPart.text === '\n' || leftPart.text === '\r\n')
                    fragmentsByLines.push(null);
                if (!currentFragment)
                    currentFragment = fragments.shift();
                isPrevNewLine = true;
            }
            if (element.length == currentFragment.text.length) {
                // push and process next fragment
                lineFragments.push(currentFragment);
                currentFragment = undefined;
            }
            else {
                // element is short than fragment, fragment wrapped
                let leftPart;
                // console.log(`split "${currentFragment.text}" (${currentFragment.length}) for ${element}`);
                [leftPart, currentFragment] = splitFragment(currentFragment, element.length);
                lineFragments.push(leftPart);
            }
            isPrevNewLine = false;
        }
        fragmentsByLines.push(lineFragments);
    }
    return fragmentsByLines;
}
function splitFragment(fragment, length) {
    // Fix for Sketch 2025.1: Create a new fragment object manually instead of using Object.assign
    let left = {
        length: length,
        location: fragment.location,
        text: fragment.text.substr(0, length),
        style: fragment.style,
        defaultLineHeight: fragment.defaultLineHeight
    };
    fragment.text = fragment.text.substring(length);
    fragment.location += length;
    fragment.length -= length;
    if (fragment.length < 0)
        throw new Error('splitFragment: fragment splitted to negtive length');
    if (!fragment.length)
        fragment = undefined;
    return [left, fragment];
}
function getFragmentLinesFromSVG(svg) {
    const REG_TSPAN = /<tspan x="(.+?)" y="(.+?)".*?>(.+?)<\/tspan>/g;
    let curY = undefined;
    let lines = [];
    let lineElements = [];
    let execArray;
    while (execArray = REG_TSPAN.exec(svg)) {
        let x = parseFloat(execArray[1]);
        let y = parseFloat(execArray[2]);
        let text = execArray[3].replace(/&[#0-9a-z]+;/ig, " ");
        if (curY === undefined) {
            curY = y;
        }
        else if (curY !== y) {
            // next line now
            lines.push({
                elements: lineElements,
            });
            lineElements = [text];
            curY = y;
            continue;
        }
        // current line
        lineElements.push(text);
    }
    // push the last line
    lines.push({
        elements: lineElements,
    });
    return lines;
}
//# sourceMappingURL=textFragment.js.map