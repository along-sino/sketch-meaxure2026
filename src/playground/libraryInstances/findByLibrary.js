"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSymbolInstacesFrom = exports.findSymbolsWithStyleFrom = exports.findLayersWithStyleFrom = void 0;
const context_1 = require("../context");
function findLayersWithStyleFrom(document, library) {
    let lib;
    let instnaces = [];
    let styles = document.sharedLayerStyles
        .concat(document.sharedTextStyles)
        .filter(s => (lib = s.getLibrary()) && lib.name == library);
    for (let style of styles) {
        instnaces.push(...style.getAllInstancesLayers());
        if (instnaces.length) {
            console.log(style.name + ": " + instnaces.length);
            return instnaces;
        }
    }
    return [];
}
exports.findLayersWithStyleFrom = findLayersWithStyleFrom;
function findSymbolsWithStyleFrom(document, library) {
    for (let page of document.pages) {
        let symbols = context_1.sketch.find('SymbolInstance', page)
            .filter(s => s.overrides.reduce((p, c) => {
            if (p)
                return true;
            let id = c.value;
            if (!id)
                return false;
            let style = document.getSharedLayerStyleWithID(id) ||
                document.getSharedTextStyleWithID(id);
            if (!style)
                return false;
            let lib = style.getLibrary();
            if (!lib)
                return false;
            let isLib = lib.name == library;
            if (isLib)
                console.log(c.affectedLayer.name);
            return isLib;
        }, false));
        if (symbols.length) {
            console.log("SymbolInstances: " + symbols.length);
            return symbols;
        }
    }
    return [];
}
exports.findSymbolsWithStyleFrom = findSymbolsWithStyleFrom;
function findSymbolInstacesFrom(document, library) {
    let lib;
    let instnaces = [];
    let symbols = document.getSymbols()
        .filter(s => (lib = s.getLibrary()) && lib.name == library);
    for (let symbol of symbols) {
        instnaces.push(...symbol.getAllInstances());
        if (instnaces.length) {
            console.log(symbol.name + ": " + instnaces.length);
            return instnaces;
        }
    }
    return [];
}
exports.findSymbolInstacesFrom = findSymbolInstacesFrom;
//# sourceMappingURL=findByLibrary.js.map