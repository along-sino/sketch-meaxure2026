"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkColorsToSwatches = void 0;
const context_1 = require("./context");
/**
 * linkColorsToSwatches links colors of shardStyles and layer styles to Swatches
 * if their colors are match. Swatches could come from both current document
 * and shared libraries.
 */
function linkColorsToSwatches(libSelector) {
    let document = context_1.context.document;
    let swatches = [];
    swatches.push(...document.swatches);
    for (let lib of context_1.sketch.getLibraries()) {
        if (libSelector && !libSelector(lib))
            continue;
        for (let i of lib.getImportableSwatchReferencesForDocument(document)) {
            let sw = i.import();
            if (sw) {
                // console.log("import:", i.name, "=", sw.color)
                swatches.push(sw);
            }
        }
    }
    // console.log(swatches.length, "swatches fuound.");
    for (let s of document.sharedLayerStyles) {
        updateColorsOfStyle(s.style, swatches);
    }
    for (let s of document.sharedTextStyles) {
        updateColorsOfStyle(s.style, swatches);
    }
    for (let p of document.pages) {
        for (let layer of p.getAllChildren()) {
            if (layer.type == context_1.sketch.Types.Text && layer.getFragmentsCount() > 1) {
                continue;
            }
            updateColorsOfStyle(layer.style, swatches);
        }
    }
}
exports.linkColorsToSwatches = linkColorsToSwatches;
function updateColorsOfStyle(s, swatches) {
    if (!s)
        return;
    if (s.fills && s.fills.length)
        updateColorAttributes(s.fills, swatches);
    if (s.borders && s.borders.length)
        updateColorAttributes(s.borders, swatches);
    if (!s.textColor)
        return;
    let sw = swatches.find(sw => {
        return sw.color == s.textColor;
    });
    if (!sw)
        return;
    s.textColor = sw.referencingColor;
}
function updateColorAttributes(attrs, swatches) {
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        let sw = swatches.find(s => {
            return s.color == attr.color;
        });
        if (!sw)
            continue;
        attr.color = sw.referencingColor;
    }
}
//# sourceMappingURL=swatches.js.map