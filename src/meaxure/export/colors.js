"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentColors = void 0;
const styles_1 = require("../helpers/styles");
function getDocumentColors(document) {
    let sw = document.swatches;
    if (sw && sw.length)
        return sw.map((s, index) => ({
            name: s.name || `Swatch ${index + 1}`,
            color: styles_1.parseColor(s.color),
        }));
    return [];
}
exports.getDocumentColors = getDocumentColors;
//# sourceMappingURL=colors.js.map