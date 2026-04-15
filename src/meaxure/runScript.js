"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScript = void 0;
const sketch_1 = require("../sketch");
const context_1 = require("./common/context");
function runScript() {
    if (!context_1.context.sketchObject.script)
        return;
    let script = decodeURIComponent(context_1.context.sketchObject.script);
    try {
        let ctx = {
            sketch: sketch_1.sketch,
            context: context_1.context,
        };
        let exports = eval(script);
        if (exports['onInit']) {
            exports['onInit'](ctx);
        }
        exports['run'](ctx);
    }
    catch (error) {
        console.error(error);
    }
}
exports.runScript = runScript;
//# sourceMappingURL=runScript.js.map