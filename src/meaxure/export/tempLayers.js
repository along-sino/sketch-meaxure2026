"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempLayers = void 0;
class TempLayersManager {
    constructor() {
        this._layers = [];
        this._idMap = {};
    }
    removeAll() {
        for (let tmp of this._layers) {
            if (tmp)
                tmp.remove();
        }
        this._layers = [];
        this._idMap = {};
    }
    add(layer) {
        layer.name = '#tmp-' + layer.name;
        layer.hidden = true;
        this._layers.push(layer);
        this._idMap[layer.id] = true;
    }
    exists(para) {
        let id = (typeof para == 'string') ? para : para.id;
        return this._idMap[id];
    }
}
exports.tempLayers = new TempLayersManager();
//# sourceMappingURL=tempLayers.js.map