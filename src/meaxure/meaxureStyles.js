"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeaxureStyles = void 0;
const sketch_1 = require("../sketch");
let overrides = {
    coordinate: {
        background: { fills: [makeFill('#4A8FE3FF')] },
        foreground: { textColor: '#FFFFFFFF' },
    },
    overlay: {
        background: { fills: [makeFill('#FF55004C')] },
        foreground: { textColor: '#FFFFFFFF' },
    },
    spacing: {
        background: { fills: [makeFill('#50E3C2FF')] },
        foreground: { textColor: '#FFFFFFFF' },
    },
    size: {
        background: { fills: [makeFill('#FF5500FF')] },
        foreground: { textColor: '#FFFFFFFF' },
    },
    property: {
        background: { fills: [makeFill('#F5A623FF')] },
        foreground: {
            textColor: '#FFFFFFFF',
            alignment: sketch_1.sketch.Text.Alignment.left,
            verticalAlignment: sketch_1.sketch.Text.VerticalAlignment.top,
            lineHeight: null,
        },
    },
    note: {
        background: { fills: [makeFill('#FFFCDCFF')], borders: [makeBorder('#CCCCCCFF')] },
        foreground: {
            textColor: '#555555FF',
            alignment: sketch_1.sketch.Text.Alignment.left,
            verticalAlignment: sketch_1.sketch.Text.VerticalAlignment.top,
            lineHeight: null,
        },
    },
};
class MeaxureStyles {
    constructor(document) {
        this._document = document;
    }
    get coordinate() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Coordinate', 'coordinate');
    }
    get overlay() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Overlay', 'overlay');
    }
    get spacing() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Spacing', 'spacing');
    }
    get size() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Size', 'size');
    }
    get property() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Property', 'property');
    }
    get note() {
        return getMeaxureStyle(this._document, 'Sketch MeaXure / Note', 'note');
    }
}
exports.MeaxureStyles = MeaxureStyles;
function getMeaxureStyle(document, name, overrideName) {
    let override = overrides[overrideName];
    let background = findSharedLayerStyle(document, name);
    if (!background)
        background = maskSharedStyle(document, name, override.background, 'layer');
    let foreground = findSharedTextStyle(document, name);
    if (!foreground)
        foreground = maskSharedStyle(document, name, override.foreground, 'text');
    return {
        background: background,
        foreground: foreground,
    };
}
function findSharedTextStyle(document, name) {
    let sharedStyles = document.sharedTextStyles;
    return sharedStyles.find(s => s.name == name);
}
function findSharedLayerStyle(document, name) {
    let sharedStyles = document.sharedLayerStyles;
    return sharedStyles.find(s => s.name == name);
}
function makeFill(color) {
    return {
        enabled: true,
        fillType: sketch_1.sketch.Style.FillType.Color,
        color: color,
    };
}
function makeBorder(color) {
    return {
        enabled: true,
        fillType: sketch_1.sketch.Style.FillType.Color,
        color: color,
        thickness: 1,
        position: sketch_1.sketch.Style.BorderPosition.Inside,
    };
}
function maskSharedStyle(document, name, override, type) {
    let base = type == 'layer' ? makeBaseLayerStyle() : makeBaseTextStyle();
    let style = Object.assign(Object.assign({}, base), override);
    let sharedStyle = sketch_1.sketch.SharedStyle.fromStyle({ name: name, document: document, style: style });
    return sharedStyle;
}
function makeBaseLayerStyle() {
    let baseStyle = new sketch_1.sketch.Style();
    baseStyle.fills = [makeFill('#FFFCDCFF')];
    baseStyle.borders = [];
    baseStyle.opacity = 1;
    baseStyle.blur = null;
    baseStyle.shadows = [];
    baseStyle.innerShadows = [];
    return baseStyle;
}
function makeBaseTextStyle() {
    let baseStyle = new sketch_1.sketch.Style();
    baseStyle.fills = [];
    baseStyle.borders = [];
    baseStyle.alignment = sketch_1.sketch.Text.Alignment.center;
    baseStyle.verticalAlignment = sketch_1.sketch.Text.VerticalAlignment.center;
    baseStyle.fontSize = 12;
    baseStyle.lineHeight = 12;
    baseStyle.paragraphSpacing = null;
    baseStyle.fontFamily = 'Helvetica Neue';
    baseStyle.fontStyle = null;
    baseStyle.fontStretch = null;
    baseStyle.fontWeight = 5;
    baseStyle.kerning = 0;
    baseStyle.textUnderline = null;
    baseStyle.textStrikethrough = null;
    baseStyle.textColor = '#FFFFFFFF';
    baseStyle.opacity = 1;
    baseStyle.blur = null;
    baseStyle.shadows = [];
    baseStyle.innerShadows = [];
    baseStyle.textTransform = 'none';
    return baseStyle;
}
//# sourceMappingURL=meaxureStyles.js.map