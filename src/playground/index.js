"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.onInit = void 0;
const context_1 = require("./context");
const swatches_1 = require("./swatches");
exports.onInit = context_1.initialize;
function run(ctx) {
    // // select locked MeaXure markers in current page
    // selectLayers(
    //     layer => layer.name.startsWith('#meaxure') && layer.locked,
    //     context.page
    // );
    swatches_1.linkColorsToSwatches(lib => lib.name == 'zent');
}
exports.run = run;
//# sourceMappingURL=index.js.map