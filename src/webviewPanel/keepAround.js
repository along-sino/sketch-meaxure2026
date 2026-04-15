"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv4 = exports.coscriptNotKeepAround = exports.coscriptKeepAround = void 0;
let globalShouldKeepAround = false;
let requested = {};
function coscriptKeepAround(requestID) {
    if (!requestID)
        throw 'requestID is needed for setShouldKeepAround';
    if (!globalShouldKeepAround) {
        coscript.setShouldKeepAround(true);
        globalShouldKeepAround = true;
    }
    requested[requestID] = true;
}
exports.coscriptKeepAround = coscriptKeepAround;
function coscriptNotKeepAround(requestID) {
    if (!requestID)
        throw 'requestID is needed for setShouldKeepAround';
    if (!requested[requestID])
        return;
    delete requested[requestID];
    if (!Object.keys(requested).length && globalShouldKeepAround) {
        coscript.setShouldKeepAround(false);
        globalShouldKeepAround = false;
    }
}
exports.coscriptNotKeepAround = coscriptNotKeepAround;
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.uuidv4 = uuidv4;
//# sourceMappingURL=keepAround.js.map