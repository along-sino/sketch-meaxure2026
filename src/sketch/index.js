"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.sketch = void 0;
const document_1 = require("./document");
const ui_1 = require("./ui");
const layer_1 = require("./layer");
const text_1 = require("./text");
const shapePath_1 = require("./shapePath");
const symbolInstance_1 = require("./symbolInstance");
const rectangle_1 = require("./rectangle");
exports.sketch = require('sketch');
if (!exports.sketch.__Extended_by_Jebbs__) {
    // In some cases, like running a panel, and later, another
    // since 'coscript.setShouldKeepAround(true)' is set,
    // On the 2nd run, the sketch extensions seems to be kept, 
    // but the module is re-initialized.
    // It leads to 'TypeError: Attempting to change the getter 
    // of an unconfigurable property.' error.
    // The __Extended_by_Jebbs__ flag is used to avoid it.
    document_1.extendDocument();
    ui_1.extendUI();
    layer_1.extendLayer();
    text_1.extendText();
    shapePath_1.extendShapePath();
    symbolInstance_1.extendSymbolInstance();
    rectangle_1.extendRectangle();
    exports.sketch.__Extended_by_Jebbs__ = true;
}
//# sourceMappingURL=index.js.map