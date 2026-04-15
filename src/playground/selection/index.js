"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayersByCondition = exports.selectLayers = void 0;
const scope_1 = require("./scope");
const context_1 = require("../context");
function selectLayers(condition, scope) {
    let page = getPageFromScope(scope);
    if (!page)
        return;
    let document = page.parent;
    document.selectedLayers.layers = getLayersByCondition(condition, scope);
}
exports.selectLayers = selectLayers;
function getLayersByCondition(condition, scope) {
    let page = getPageFromScope(scope);
    if (!page)
        return;
    return scope_1.getLayersForScope(scope, page)
        .filter(layer => condition(layer));
}
exports.getLayersByCondition = getLayersByCondition;
function getPageFromScope(scope) {
    if (!scope || scope.length)
        return undefined;
    let page;
    if (scope instanceof context_1.sketch.Page) {
        page = scope;
    }
    else if (typeof scope !== 'string') {
        let layer = (scope instanceof Array) ? scope[0] : scope;
        page = layer.getParentPage();
    }
    else {
        page = context_1.context.page;
    }
    return page;
}
//# sourceMappingURL=index.js.map