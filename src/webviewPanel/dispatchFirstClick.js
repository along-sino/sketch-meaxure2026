"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchFirstClick = void 0;
function dispatchFirstClick(panel, event) {
    if (event.type() !== NSEventTypeLeftMouseDown)
        return;
    let point = panel.webview.convertPoint_fromView(event.locationInWindow(), null);
    point.y = NSHeight(panel.panel.contentView().frame()) - point.y;
    let script = `
        let el = document.elementFromPoint(${point.x}, ${point.y});
        if (!el) return;
        el.dispatchEvent(new Event("click", {
            bubbles: true
        }))
    `;
    panel.evaluateWebScript(script);
}
exports.dispatchFirstClick = dispatchFirstClick;
//# sourceMappingURL=dispatchFirstClick.js.map