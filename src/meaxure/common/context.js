"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContext = exports.context = void 0;
const sketch_1 = require("../../sketch");
const config_1 = require("./config");
const meaxureStyles_1 = require("../meaxureStyles");
exports.context = undefined;
function updateContext(ctx) {
    if (!ctx && !exports.context)
        throw new Error("Context not initialized");
    let notInitilized = exports.context === undefined;
    // initialized the context
    if (!exports.context && ctx) {
        // logger.debug("initContextRunOnce");
        initContextRunOnce();
    }
    // logger.debug("Update context");
    if (ctx)
        exports.context.sketchObject = ctx;
    // current document either from ctx or NSDocumentController
    let document = (ctx ? ctx.document : undefined) || NSDocumentController.sharedDocumentController().currentDocument();
    if (notInitilized || document != exports.context.sketchObject.document) {
        // properties updates only when document change
        // logger.debug("Update target document");
        exports.context.sketchObject.document = document;
        exports.context.document = sketch_1.sketch.Document.fromNative(exports.context.sketchObject.document);
        exports.context.configs = new config_1.ConfigsMaster(document);
    }
    if (document) {
        // properties always need to update
        exports.context.page = exports.context.document.selectedPage;
        // Fix for Sketch 2025.1: currentArtboard() was removed
        // Use the new find() API to get top-level containers with selection
        const topLevelContainersWithSelection = getTopLevelContainersWithSelection(exports.context.page);
        exports.context.artboard = topLevelContainersWithSelection.length > 0 ? topLevelContainersWithSelection[0] : null;
        exports.context.selection = exports.context.document.selectedLayers;
        exports.context.meaxureStyles = new meaxureStyles_1.MeaxureStyles(exports.context.document);
    }
    return exports.context;
}
exports.updateContext = updateContext;
// Helper function to get top-level containers with selection (replaces currentArtboard())
function getTopLevelContainersWithSelection(page) {
    return page.selectedLayers.reduce((prev, layer) => {
        // Include all explicitly selected top-level containers
        if (layer instanceof sketch_1.sketch.Artboard) {
            return prev.concat(layer);
        }
        // Otherwise try to reach this layer's top-level container if one exists
        // (i.e. this layer does not lay directly on the page)
        const parentArtboard = layer.getParentArtboard();
        if (parentArtboard && prev.indexOf(parentArtboard) === -1) {
            return prev.concat(parentArtboard);
        }
        return prev;
    }, []);
}
function initContextRunOnce() {
    exports.context = {};
}
//# sourceMappingURL=context.js.map