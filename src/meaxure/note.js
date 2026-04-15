"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNote = void 0;
const language_1 = require("./common/language");
const context_1 = require("./common/context");
const sketch_1 = require("../sketch");
const elements_1 = require("./helpers/elements");
function markNote() {
    let selection = context_1.context.selection;
    if (selection.length <= 0) {
        sketch_1.sketch.UI.message(language_1.localize("Select a text layer to mark!"));
        return false;
    }
    for (let layer of selection.layers) {
        if (layer.type == sketch_1.sketch.Types.Text)
            note(layer);
    }
}
exports.markNote = markNote;
function note(target) {
    let background = context_1.context.meaxureStyles.note.background;
    let foreground = context_1.context.meaxureStyles.note.foreground;
    let root = target.getParentArtboard() || target.getParentPage();
    if (!root)
        return;
    let name = "#meaxure-note-" + new Date().getTime();
    let note = elements_1.createLabel(target.text, {
        name: name,
        parent: root,
        foreground: foreground,
        background: background,
    });
    note.alignTo(target, true, true);
    if (note.frame.width > 100)
        note.frame.width = 100;
    if (note.frame.height > 100)
        note.frame.height = 100;
    target.remove();
}
//# sourceMappingURL=note.js.map