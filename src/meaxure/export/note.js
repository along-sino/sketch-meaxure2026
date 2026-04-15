"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNote = void 0;
const sketch_1 = require("../../sketch");
const helper_1 = require("../helpers/helper");
function makeNote(layer, artboard, symbolLayer) {
    if (!layer || layer.type != sketch_1.sketch.Types.Group || !layer.name.startsWith('#meaxure-note-'))
        return undefined;
    let textLayers = sketch_1.sketch.find('Text', layer);
    if (!textLayers.length)
        return undefined;
    let textLayer = textLayers[0];
    if (!layer.hidden)
        layer.hidden = true;
    if (symbolLayer && !symbolLayer.hidden)
        symbolLayer.hidden = true;
    return {
        rect: layer.frame.changeBasis({ from: layer.parent, to: artboard }),
        note: helper_1.toHTMLEncode(helper_1.emojiToEntities(textLayer.text)).replace(/\n/g, "<br>"),
    };
}
exports.makeNote = makeNote;
//# sourceMappingURL=note.js.map