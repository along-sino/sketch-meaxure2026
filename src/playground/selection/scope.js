"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayersForScope = void 0;
const context_1 = require("../context");
function getLayersForScope(scope, currentPage) {
    if (scope instanceof Array)
        return scope;
    if (typeof scope === 'string') {
        let layers = [];
        context_1.sketch.find(scope, currentPage).forEach(find => layers.push(...find.getAllChildren()));
        return layers;
    }
    return scope.getAllChildren();
}
exports.getLayersForScope = getLayersForScope;
//# sourceMappingURL=scope.js.map