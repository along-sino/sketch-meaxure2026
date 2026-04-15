"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendSymbolInstance = void 0;
const _1 = require(".");
function extendSymbolInstance() {
    let target = _1.sketch.SymbolInstance.prototype;
    target.changeSymbolMaster = function (master) {
        this.sketchObject.changeInstanceToSymbol(master.sketchObject);
        return this;
    };
}
exports.extendSymbolInstance = extendSymbolInstance;
//# sourceMappingURL=symbolInstance.js.map