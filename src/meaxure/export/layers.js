"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildrenForExport = exports.LayerPlaceholder = exports.LayerPlaceholderType = void 0;
const tint_1 = require("./tint");
var LayerPlaceholderType;
(function (LayerPlaceholderType) {
    LayerPlaceholderType[LayerPlaceholderType["Tint"] = 0] = "Tint";
})(LayerPlaceholderType = exports.LayerPlaceholderType || (exports.LayerPlaceholderType = {}));
class LayerPlaceholder {
    static fromTint(tint) {
        let h = new LayerPlaceholder();
        h._type = LayerPlaceholderType.Tint;
        h._value = tint;
        return h;
    }
    getValue() {
        return this._value;
    }
    getType() {
        return this._type;
    }
}
exports.LayerPlaceholder = LayerPlaceholder;
// getChildrenForExport gets all children of the layer for export, it makes sure:
// 1. Order: children first, then their parent
// 2. Tint placeholder: insert it when parent group contains tint. Because according to 
// the order above, we met the parent last.
function getChildrenForExport(layer) {
    let layers = [];
    let count = 0;
    enumLayers(layer);
    function enumLayers(layer) {
        let t = tint_1.getTintInfo(layer);
        if (t) {
            layers.push(t);
        }
        if (layer.layers) {
            layer.layers.forEach(l => enumLayers(l));
        }
        count++;
        layers.push(layer);
    }
    return [layers, count];
}
exports.getChildrenForExport = getChildrenForExport;
//# sourceMappingURL=layers.js.map