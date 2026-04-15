"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendText = exports.TextBehaviour = void 0;
const __1 = require("..");
const textFragment_1 = require("./textFragment");
var TextBehaviour;
(function (TextBehaviour) {
    TextBehaviour[TextBehaviour["autoWidth"] = 0] = "autoWidth";
    TextBehaviour[TextBehaviour["autoHeight"] = 1] = "autoHeight";
    TextBehaviour[TextBehaviour["fixedSize"] = 2] = "fixedSize";
})(TextBehaviour = exports.TextBehaviour || (exports.TextBehaviour = {}));
function extendText() {
    let target = __1.sketch.Text.prototype;
    Object.defineProperty(target, "isEmpty", {
        get: function () {
            return this.sketchObject.isEmpty();
        }
    });
    Object.defineProperty(target, "textBehaviour", {
        get: function () {
            let val = this.sketchObject.textBehaviour();
            return TextBehaviour[val];
        },
        set: function (val) {
            return this.sketchObject.setTextBehaviour(val);
        }
    });
    target.getFragments = function () { return textFragment_1.getFragments(this); };
    target.getFragmentsCount = function () { return textFragment_1.getFragmentsCount(this); };
}
exports.extendText = extendText;
//# sourceMappingURL=index.js.map