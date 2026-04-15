"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlow = void 0;
const sketch_1 = require("../../sketch");
function getFlow(layer, layerData) {
    if (!layer.flow)
        return;
    layerData.flow = {
        targetId: layer.flow.targetId == sketch_1.sketch.Flow.BackTarget ? 'back' : layer.flow.targetId,
        animationType: layer.flow.animationType,
    };
}
exports.getFlow = getFlow;
//# sourceMappingURL=flow.js.map