"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBubble = exports.createLabel = exports.createRuler = void 0;
const sketch_1 = require("../../sketch");
const alignment_1 = require("../../sketch/layer/alignment");
const text_1 = require("../../sketch/text");
const resizingConstraint_1 = require("../../sketch/layer/resizingConstraint");
function createRuler(size, options) {
    if (!options || options.isHorizontal) {
        return createMeterHorizontal(size, options);
    }
    return createMeterVertical(size, options);
}
exports.createRuler = createRuler;
function createMeterHorizontal(size, options) {
    if (size <= 0)
        return;
    options = Object.assign({}, options);
    let container = new sketch_1.sketch.Group({ name: options.name, parent: options.parent });
    let start = new sketch_1.sketch.ShapePath({ name: 'start', parent: container });
    let body = new sketch_1.sketch.ShapePath({ name: 'body', parent: container });
    start.frame.width = 1;
    start.frame.height = 5;
    body.frame.width = size;
    body.frame.height = 1;
    if (options.background) {
        start.sharedStyle = options.background;
        start.style = Object.assign({}, options.background.style);
        body.sharedStyle = options.background;
        body.style = Object.assign({}, options.background.style);
    }
    let end = start.duplicate();
    start.alignTo(body, { from: alignment_1.Edge.left, to: alignment_1.Edge.left }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
    end.alignTo(body, { from: alignment_1.Edge.right, to: alignment_1.Edge.right }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
    start.resizingConstraint = resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height;
    end.resizingConstraint = resizingConstraint_1.ResizingConstraint.right &
        resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height;
    body.resizingConstraint = resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.right &
        resizingConstraint_1.ResizingConstraint.height;
    container.adjustToFit();
    return container;
}
function createMeterVertical(size, options) {
    if (size <= 0)
        return;
    options = Object.assign({}, options);
    let container = new sketch_1.sketch.Group({ name: options.name, parent: options.parent });
    let start = new sketch_1.sketch.ShapePath({ name: 'start', parent: container });
    let body = new sketch_1.sketch.ShapePath({ name: 'body', parent: container });
    start.frame.width = 5;
    start.frame.height = 1;
    body.frame.width = 1;
    body.frame.height = size;
    if (options.background) {
        start.sharedStyle = options.background;
        start.style = Object.assign({}, options.background.style);
        body.sharedStyle = options.background;
        body.style = Object.assign({}, options.background.style);
    }
    let end = start.duplicate();
    start.alignTo(body, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.top, to: alignment_1.EdgeVertical.top });
    end.alignTo(body, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.bottom, to: alignment_1.EdgeVertical.bottom });
    start.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
        resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height;
    end.resizingConstraint = resizingConstraint_1.ResizingConstraint.bottom &
        resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height;
    body.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
        resizingConstraint_1.ResizingConstraint.bottom &
        resizingConstraint_1.ResizingConstraint.width;
    container.adjustToFit();
    return container;
}
function createLabel(content, options) {
    content = content || 'Label';
    let container = new sketch_1.sketch.Group({ name: options.name, parent: options.parent });
    let box = new sketch_1.sketch.ShapePath({ name: 'background', parent: container });
    let text = new sketch_1.sketch.Text({ name: 'text', text: content, parent: container });
    if (options.foreground) {
        text.sharedStyle = options.foreground;
        text.style = Object.assign({}, options.foreground.style);
    }
    if (options.background) {
        box.sharedStyle = options.background;
        box.style = Object.assign({}, options.background.style);
    }
    text.textBehaviour = text_1.TextBehaviour.fixedSize;
    text.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
        resizingConstraint_1.ResizingConstraint.bottom &
        resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.right;
    // set radius
    box.points.forEach(p => p.cornerRadius = 2);
    // update frame parameters except postion
    box.frame.width = text.frame.width + (options.padding || 8);
    box.frame.height = text.frame.height + (options.padding || 8);
    text.alignTo(box, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
    container.adjustToFit();
    return container;
}
exports.createLabel = createLabel;
function createBubble(content, options) {
    let container = new sketch_1.sketch.Group({ name: options.name, parent: options.parent });
    let label = createLabel(content, {
        name: 'label',
        parent: container,
        foreground: options.foreground,
        background: options.background,
        padding: options.padding,
    });
    label.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
        resizingConstraint_1.ResizingConstraint.bottom &
        resizingConstraint_1.ResizingConstraint.left &
        resizingConstraint_1.ResizingConstraint.right;
    let arrow = createArrowFor(label, {
        background: options.background,
        bubblePosition: options.bubblePosition,
    });
    container.adjustToFit();
    return container;
}
exports.createBubble = createBubble;
function createArrowFor(target, options) {
    if (options.bubblePosition == alignment_1.Edge.center || options.bubblePosition == alignment_1.EdgeVertical.middle) {
        return undefined;
    }
    let arrow = new sketch_1.sketch.ShapePath({ name: 'arrow', parent: target.parent });
    if (options.background) {
        arrow.sharedStyle = options.background;
        arrow.style = Object.assign({}, options.background.style);
    }
    arrow.frame.width = 6;
    arrow.frame.height = 6;
    arrow.transform.rotation = 45;
    let arrowConstraint;
    let position = options.bubblePosition || alignment_1.Edge.right;
    switch (position) {
        case alignment_1.EdgeVertical.top:
            arrow.alignTo(target, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.bottom });
            arrowConstraint = resizingConstraint_1.ResizingConstraint.bottom;
            break;
        case alignment_1.Edge.right:
            arrow.alignTo(target, { from: alignment_1.Edge.center, to: alignment_1.Edge.left }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
            arrowConstraint = resizingConstraint_1.ResizingConstraint.left;
            break;
        case alignment_1.EdgeVertical.bottom:
            arrow.alignTo(target, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.top });
            arrowConstraint = resizingConstraint_1.ResizingConstraint.top;
            break;
        case alignment_1.Edge.left:
            arrow.alignTo(target, { from: alignment_1.Edge.center, to: alignment_1.Edge.right }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
            arrowConstraint = resizingConstraint_1.ResizingConstraint.right;
            break;
        default:
            break;
    }
    arrow.resizingConstraint = arrowConstraint &
        resizingConstraint_1.ResizingConstraint.width &
        resizingConstraint_1.ResizingConstraint.height;
    return arrow;
}
//# sourceMappingURL=elements.js.map