"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectLayersByLibrary = void 0;
const findByLibrary_1 = require("./findByLibrary");
function selectLayersByLibrary(document, library) {
    let instnaces = findByLibrary_1.findLayersWithStyleFrom(document, library);
    if (!instnaces.length)
        instnaces = findByLibrary_1.findSymbolInstacesFrom(document, library);
    if (!instnaces.length)
        instnaces = findByLibrary_1.findSymbolsWithStyleFrom(document, library);
    if (!instnaces.length)
        return;
    document.selectedPage = instnaces[0].getParentPage();
    document.selectedLayers.layers = instnaces;
}
exports.selectLayersByLibrary = selectLayersByLibrary;
//# sourceMappingURL=index.js.map