"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbol = void 0;
const interfaces_1 = require("../interfaces");
const layerData_1 = require("./layerData");
const tempLayers_1 = require("./tempLayers");
const layers_1 = require("./layers");
function getSymbol(artboard, layer, layerData, data, byInfluence) {
    if (layerData.type != interfaces_1.SMType.symbol)
        return;
    // symbol instance of none, #4
    if (!layer.master)
        return;
    let master = layer.master;
    let masterID = master.id;
    layerData.objectID = masterID;
    let masterAllLayers = master.getAllChildren();
    if (master.exportFormats.length || masterAllLayers.length < 2)
        return;
    let tempInstance = layer.duplicate();
    // do not trigger layer re-arrange from 3rd-party plugins, e.g.: Anima
    tempInstance.parent = artboard;
    tempInstance.frame = layer.frame.changeBasis({ from: layer.parent, to: artboard });
    // make sure it doesn't make another duplicated flow layer
    tempInstance.flow = undefined;
    let tempGroup = tempInstance.detach({ recursively: false });
    tempLayers_1.tempLayers.add(tempGroup);
    let [instanceAllLayers, count] = layers_1.getChildrenForExport(tempGroup);
    if (masterAllLayers.length < count) {
        // console.log('insert undefined into masterAllLayers[1] as master backgroud layer');
        masterAllLayers.splice(1, 0, undefined);
    }
    // stopwatch.tik('create temp detached symbol');
    // should keep its tint, though temp group is ignored
    // starts from 1, skip temp group which is create on detach
    let idx = 0;
    for (let instanceLayer of instanceAllLayers) {
        let masterLayer;
        if (!(instanceLayer instanceof layers_1.LayerPlaceholder)) {
            masterLayer = masterAllLayers[idx];
            idx++;
            // console.log(instanceLayer.name + ":" + (masterLayer ? masterLayer.name : 'undefined'));
        }
        layerData_1.getLayerData(artboard, instanceLayer, data, byInfluence, masterLayer);
    }
    tempGroup.remove();
}
exports.getSymbol = getSymbol;
//# sourceMappingURL=symbol.js.map