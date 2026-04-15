"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSizeForFrame = exports.drawSizes = void 0;
const context_1 = require("./common/context");
const language_1 = require("./common/language");
const sketch_1 = require("../sketch");
const elements_1 = require("./helpers/elements");
const alignment_1 = require("../sketch/layer/alignment");
const helper_1 = require("./helpers/helper");
const resizingConstraint_1 = require("../sketch/layer/resizingConstraint");
function drawSizes(position) {
    if (context_1.context.selection.length <= 0) {
        sketch_1.sketch.UI.message(language_1.localize("Select any layer to mark!"));
        return false;
    }
    position = position || alignment_1.EdgeVertical.top;
    for (let layer of context_1.context.selection.layers) {
        drawSize(layer, position);
    }
}
exports.drawSizes = drawSizes;
function drawSize(layer, position) {
    let sizeType = position === alignment_1.EdgeVertical.top ||
        position === alignment_1.EdgeVertical.middle ||
        position === alignment_1.EdgeVertical.bottom ?
        "width" : "height";
    let name = "#meaxure-" + sizeType + "-" + position + "-" + layer.id;
    let artboard = layer.getParentArtboard();
    let root = artboard || layer.getParentPage();
    if (!root)
        return;
    sketch_1.sketch.find(`Group, [name="${name}"]`, root).forEach(g => g.remove());
    let frame = context_1.context.configs.byInfluence ? layer.frameInfluence : layer.frame;
    frame = frame.changeBasis({ from: layer.parent, to: root });
    drawSizeForFrame(frame, position, {
        name: name,
        parent: root,
        background: context_1.context.meaxureStyles.size.background,
        foreground: context_1.context.meaxureStyles.size.foreground,
    });
}
function drawSizeForFrame(frame, position, options) {
    let isHorizontal = position === alignment_1.EdgeVertical.top ||
        position === alignment_1.EdgeVertical.middle ||
        position === alignment_1.EdgeVertical.bottom;
    let size;
    let text;
    size = isHorizontal ? frame.width : frame.height;
    text = helper_1.lengthUnit(size);
    if (context_1.context.configs.byPercentage && options.parent.type != sketch_1.sketch.Types.Page) {
        let containerFrame = context_1.context.configs.byInfluence ? options.parent.frameInfluence : options.parent.frame;
        let containerSize = isHorizontal ? containerFrame.width : containerFrame.height;
        text = helper_1.lengthUnit(size, containerSize);
    }
    let container = new sketch_1.sketch.Group({ name: options.name, parent: options.parent });
    let ruler = elements_1.createRuler(size, {
        name: 'ruler',
        parent: container,
        background: options.background,
        isHorizontal: isHorizontal,
    });
    ruler.alignToByPostion(
    // expand the frame so that the ruler offsets to target by 1px;
    new sketch_1.sketch.Rectangle(frame.x - 1, frame.y - 1, frame.width + 2, frame.height + 2), position);
    let bubbleOptions = {
        name: 'label',
        parent: container,
        foreground: options.foreground,
        background: options.background,
        bubblePosition: position,
    };
    let bubble = elements_1.createBubble(text, bubbleOptions);
    alignBubbleToRuler(bubble, ruler, bubbleOptions.bubblePosition);
    // in case the bubble in middle/center of ruler, but the ruler is too small
    if (bubbleOptions.bubblePosition == alignment_1.Edge.center) {
        if (bubble.frame.height + 10 > ruler.frame.height) {
            bubbleOptions.bubblePosition = alignment_1.Edge.right;
            // console.log(`center bubble(${text}) too large, move to ${bubblePosition}`);
            bubble.remove();
            bubble = elements_1.createBubble(text, bubbleOptions);
            alignBubbleToRuler(bubble, ruler, bubbleOptions.bubblePosition);
        }
    }
    else if (bubbleOptions.bubblePosition == alignment_1.EdgeVertical.middle) {
        if (bubble.frame.width + 10 > ruler.frame.width) {
            bubbleOptions.bubblePosition = alignment_1.EdgeVertical.top;
            // console.log(`middle bubble(${text}) too large, move to ${bubblePosition}`);
            bubble.remove();
            bubble = elements_1.createBubble(text, bubbleOptions);
            alignBubbleToRuler(bubble, ruler, bubbleOptions.bubblePosition);
        }
    }
    // in case the bubble is out side the artboard
    let newBubblePosition = getCounterPositionIfOutside(bubble, bubbleOptions.bubblePosition);
    if (bubbleOptions.bubblePosition !== newBubblePosition) {
        bubbleOptions.bubblePosition = newBubblePosition;
        // console.log(`bubble(${text}) outside the artboard, move to ${bubblePosition}`);
        bubble.remove();
        bubble = elements_1.createBubble(text, bubbleOptions);
        alignBubbleToRuler(bubble, ruler, bubbleOptions.bubblePosition);
    }
    bubble.resizingConstraint = resizingConstraint_1.ResizingConstraint.width & resizingConstraint_1.ResizingConstraint.height;
    if (isHorizontal) {
        bubble.resizingConstraint = bubble.resizingConstraint & resizingConstraint_1.ResizingConstraint.top;
        ruler.resizingConstraint = resizingConstraint_1.ResizingConstraint.left &
            resizingConstraint_1.ResizingConstraint.right &
            resizingConstraint_1.ResizingConstraint.height &
            resizingConstraint_1.ResizingConstraint.top;
    }
    else {
        bubble.resizingConstraint = bubble.resizingConstraint & resizingConstraint_1.ResizingConstraint.left;
        ruler.resizingConstraint = resizingConstraint_1.ResizingConstraint.top &
            resizingConstraint_1.ResizingConstraint.bottom &
            resizingConstraint_1.ResizingConstraint.width &
            resizingConstraint_1.ResizingConstraint.left;
    }
    container.adjustToFit();
}
exports.drawSizeForFrame = drawSizeForFrame;
function alignBubbleToRuler(bubble, ruler, position) {
    if (position == alignment_1.Edge.left || position == alignment_1.Edge.center || position == alignment_1.Edge.right) {
        bubble.alignTo(ruler, { from: getCounterEdge(position), to: position }, { from: alignment_1.EdgeVertical.middle, to: alignment_1.EdgeVertical.middle });
    }
    else {
        bubble.alignTo(ruler, { from: alignment_1.Edge.center, to: alignment_1.Edge.center }, { from: getCounterEdge(position), to: position });
    }
}
function getCounterPositionIfOutside(bubble, position) {
    let artboard = bubble.getParentArtboard();
    if (!artboard)
        return position;
    let frameBubble = bubble.frame.changeBasis({ from: bubble.parent, to: artboard });
    let frameArtboard = artboard.frame.changeBasis({ from: artboard.parent, to: artboard });
    let intersection = frameBubble.intersection(frameArtboard);
    if (intersection && intersection.isEuqal(frameBubble))
        return position;
    let isHorizontal = position === alignment_1.EdgeVertical.top ||
        position === alignment_1.EdgeVertical.middle ||
        position === alignment_1.EdgeVertical.bottom;
    if (isHorizontal && (!intersection || intersection.height != frameBubble.height))
        return getCounterEdge(position);
    if (!isHorizontal && (!intersection || intersection.width != frameBubble.width))
        return getCounterEdge(position);
    return position;
}
function getCounterEdge(position) {
    switch (position) {
        case alignment_1.Edge.left:
            return alignment_1.Edge.right;
        case alignment_1.Edge.right:
            return alignment_1.Edge.left;
        case alignment_1.EdgeVertical.top:
            return alignment_1.EdgeVertical.bottom;
        case alignment_1.EdgeVertical.bottom:
            return alignment_1.EdgeVertical.top;
        default:
            return position;
    }
}
//# sourceMappingURL=size.js.map