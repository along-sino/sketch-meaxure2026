"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendLayer = void 0;
const __1 = require("..");
const alignment_1 = require("./alignment");
const resizingConstraint_1 = require("./resizingConstraint");
function extendLayer() {
    let target = __1.sketch.Layer.prototype;
    Object.defineProperty(target, "frameInfluence", {
        get: function () {
            let parent;
            if (this.type == __1.sketch.Types.Page) {
                return new __1.sketch.Rectangle(0, 0, 0, 0);
            }
            else {
                parent = this.parent;
            }
            let parentRect = parent.sketchObject.absoluteRect().rect();
            let influenceCGRect = this.sketchObject.absoluteInfluenceRect();
            return new __1.sketch.Rectangle(influenceCGRect.origin.x - parentRect.origin.x, influenceCGRect.origin.y - parentRect.origin.y, influenceCGRect.size.width, influenceCGRect.size.height);
        }
    });
    Object.defineProperty(target, "shouldBreakMaskChain", {
        get: function () {
            return !!this.sketchObject.shouldBreakMaskChain();
        }
    });
    Object.defineProperty(target, "hasClippingMask", {
        get: function () {
            return !!this.sketchObject.hasClippingMask();
        }
    });
    Object.defineProperty(target, "CSSAttributes", {
        get: function () {
            let layerCSSAttributes = this.sketchObject.CSSAttributes();
            let css = [];
            for (let i = 0; i < layerCSSAttributes.count(); i++) {
                let attribute = new String(layerCSSAttributes[i]).toString();
                css.push(attribute);
            }
            if (this.sketchObject.font && this.sketchObject.font()) {
                const fontWeightCss = `font-weight: ${AppKitWeightToCssWeightIndex[Number(NSFontManager.sharedFontManager().weightOfFont(this.sketchObject.font()))]};`;
                css.push(fontWeightCss);
            }
            return css;
        }
    });
    Object.defineProperty(target, "resizingConstraint", {
        get: function () {
            return resizingConstraint_1.getResizingConstraint(this);
        },
        set: function (value) {
            resizingConstraint_1.setResizingConstraint(this, value);
        }
    });
    target.getAllChildren = function () {
        let layers = [];
        enumLayers(this);
        function enumLayers(layer) {
            if (layer.layers) {
                layer.layers.forEach(l => enumLayers(l));
            }
            layers.push(layer);
        }
        return layers;
    };
    target.alignTo = function (target, horizontal, vertical) {
        alignment_1.alignLayers(this, target, horizontal, vertical);
    };
    target.alignToByPostion = function (target, position) {
        alignment_1.alignLayersByPosition(this, target, position);
    };
}
exports.extendLayer = extendLayer;
const AppKitWeightToCssWeightIndex = [100, 100, 100, 200, 300, 400, 500, 500, 600, 700, 800, 900, 900, 900, 900, 900];
//# sourceMappingURL=index.js.map