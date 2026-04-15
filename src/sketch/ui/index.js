"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendUI = void 0;
const __1 = require("..");
const savePanel_1 = require("./savePanel");
const confirm_1 = require("./confirm");
const finder_1 = require("./finder");
function extendUI() {
    let target = __1.sketch.UI;
    target.savePanel = savePanel_1.savePanel;
    target.confirm = confirm_1.confirm;
    target.showFiles = finder_1.showFiles;
}
exports.extendUI = extendUI;
//# sourceMappingURL=index.js.map