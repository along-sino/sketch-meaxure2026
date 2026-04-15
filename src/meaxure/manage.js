"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLocked = exports.toggleHidden = exports.clearAllMarks = void 0;
const context_1 = require("./common/context");
const sketch_1 = require("../sketch");
function clearAllMarks() {
    let targets = context_1.context.selection.length ? context_1.context.selection.layers : [context_1.context.page];
    for (let target of targets) {
        for (let layer of target.getAllChildren()) {
            if (layer.type == sketch_1.sketch.Types.Group && layer.name.startsWith('#meaxure-')) {
                layer.remove();
            }
        }
    }
}
exports.clearAllMarks = clearAllMarks;
function toggleHidden() {
    let isHidden = true;
    let marks = sketch_1.sketch.find('Group, [name^="#meaxure-"]', context_1.context.page);
    for (let mark of marks) {
        // if one mark of all is visible, 
        // the curent state is visible, hide them all first
        if (!isHidden)
            break;
        isHidden = mark.hidden;
    }
    // invert the state
    isHidden = !isHidden;
    for (let mark of marks) {
        mark.hidden = isHidden;
    }
}
exports.toggleHidden = toggleHidden;
function toggleLocked() {
    let isLocked = true;
    let marks = sketch_1.sketch.find('Group, [name^="#meaxure-"]', context_1.context.page);
    for (let mark of marks) {
        // if one mark of all is unlocked, 
        // the curent state is unlocked, lock them all first
        if (!isLocked)
            break;
        isLocked = mark.locked;
    }
    // invert the state
    isLocked = !isLocked;
    for (let mark of marks) {
        mark.locked = isLocked;
    }
}
exports.toggleLocked = toggleLocked;
function customFindRange(layers, includingSelf) {
    return {
        type: sketch_1.sketch.Types.Group,
        _isWrappedObject: true,
        sketchObject: {
            childrenIncludingSelf: function () {
                return layers.reduce((prev, layer) => {
                    prev.addObjectsFromArray(layer.sketchObject.childrenIncludingSelf(includingSelf));
                    return prev;
                }, NSMutableArray.new());
            }
        }
    };
}
//# sourceMappingURL=manage.js.map