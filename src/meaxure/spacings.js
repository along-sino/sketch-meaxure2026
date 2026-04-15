"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSpacings = void 0;
const context_1 = require("./common/context");
const helper_1 = require("./helpers/helper");
const size_1 = require("./size");
const logger_1 = require("./common/logger");
const language_1 = require("./common/language");
const sketch_1 = require("../sketch");
const alignment_1 = require("../sketch/layer/alignment");
function drawSpacings(position) {
    if (context_1.context.selection.length != 1 && context_1.context.selection.length != 2) {
        sketch_1.sketch.UI.message(language_1.localize("Select 1 or 2 layers to mark!"));
        return false;
    }
    position = position || "";
    let layers = [];
    for (let layer of context_1.context.selection.layers) {
        layers.push(layer);
    }
    distance(layers, position);
}
exports.drawSpacings = drawSpacings;
function distance(layers, position) {
    let layerA = layers[0];
    let artboard = layerA.getParentArtboard();
    let layerB = layers.length == 1 ? artboard : layers[1];
    if (!layerB)
        return;
    let root = artboard || layerA.getParentPage();
    if (!root)
        return;
    let fromID = layerA.id;
    let toID = layerB.id;
    let from = context_1.context.configs.byInfluence ?
        layerA.frameInfluence.changeBasis({ from: layerA.parent, to: root }) :
        layerA.frame.changeBasis({ from: layerA.parent, to: root });
    let to = context_1.context.configs.byInfluence ?
        layerB.frameInfluence.changeBasis({ from: layerB.parent, to: root }) :
        layerB.frame.changeBasis({ from: layerB.parent, to: root });
    switch (position) {
        case "":
        case "horizontal":
            drawHorizontal(root, "#meaxure-spacing-horizontal-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        case "":
        case "vertical":
            drawVertical(root, "#meaxure-spacing-vertical-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        case "":
        case "top":
            drawTop(root, "#meaxure-spacing-top-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        case "":
        case "bottom":
            drawBottom(root, "#meaxure-spacing-bottom-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        case "":
        case "left":
            drawLeft(root, "#meaxure-spacing-left-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        case "":
        case "right":
            drawRight(root, "#meaxure-spacing-right-" + fromID + "-" + toID, from, to);
            if (position)
                return;
        default:
            break;
    }
}
function drawHorizontal(root, layerName, from, to) {
    // make sure from left shape to right
    if (from.x > to.x)
        [from, to] = swap(from, to);
    let rect = {};
    rect.x = from.x + from.width;
    rect.y = from.y;
    rect.width = to.x - rect.x;
    rect.height = from.height;
    if (rect.width <= 0) {
        logger_1.logger.debug('No horizontal space for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    drawSpacingShape(layerName, rect, alignment_1.EdgeVertical.middle, root);
}
function drawVertical(root, layerName, from, to) {
    // make sure from higher shape to lower
    if (from.y > to.y)
        [from, to] = swap(from, to);
    let rect = {};
    rect.x = from.x;
    rect.y = from.y + from.height;
    rect.width = from.width;
    rect.height = to.y - rect.y;
    if (rect.height <= 0) {
        logger_1.logger.debug('No vertical space for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    drawSpacingShape(layerName, rect, alignment_1.Edge.center, root);
}
function drawTop(root, layerName, from, to) {
    let rect = {};
    let intersection = helper_1.getIntersection(from, to);
    if (!intersection) {
        logger_1.logger.debug('No intersection for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    // make sure from lower shape to higher
    if (from.y < to.y)
        [from, to] = swap(from, to);
    rect.x = intersection.x;
    rect.y = to.y;
    rect.width = intersection.width;
    rect.height = intersection.y - to.y;
    if (!rect.height) {
        logger_1.logger.debug('No space for selected layers, skipping...');
        return;
    }
    drawSpacingShape(layerName, rect, alignment_1.Edge.center, root);
}
function drawBottom(root, layerName, from, to) {
    let rect = {};
    let intersection = helper_1.getIntersection(from, to);
    if (!intersection) {
        logger_1.logger.debug('No intersection for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    // make sure from higher bottom shape to lower
    if (from.y + from.height > to.y + to.height)
        [from, to] = swap(from, to);
    rect.x = intersection.x;
    rect.y = intersection.y + intersection.height;
    rect.width = intersection.width;
    rect.height = to.y + to.height - intersection.y - intersection.height;
    if (!rect.height) {
        logger_1.logger.debug('No space for selected layers, skipping...');
        return;
    }
    drawSpacingShape(layerName, rect, alignment_1.Edge.center, root);
}
function drawLeft(root, layerName, from, to) {
    let rect = {};
    let intersection = helper_1.getIntersection(from, to);
    if (!intersection) {
        logger_1.logger.debug('No intersection for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    // make sure from right shape to left
    if (from.x < to.x)
        [from, to] = swap(from, to);
    rect.x = to.x;
    rect.y = intersection.y;
    rect.width = intersection.x - to.x;
    rect.height = intersection.height;
    if (!rect.width) {
        logger_1.logger.debug('No space for selected layers, skipping...');
        return;
    }
    drawSpacingShape(layerName, rect, alignment_1.EdgeVertical.middle, root);
}
function drawRight(root, layerName, from, to) {
    let rect = {};
    let intersection = helper_1.getIntersection(from, to);
    if (!intersection) {
        logger_1.logger.debug('No intersection for selected layers, skipping...');
        return;
    }
    sketch_1.sketch.find(`Group, [name="${layerName}"]`, root).forEach(g => g.remove());
    // make sure from left shape (by right border) to right
    if (from.x + from.width > to.x + to.width)
        [from, to] = swap(from, to);
    rect.x = intersection.x + intersection.width;
    rect.y = intersection.y;
    rect.width = to.x + to.width - intersection.x - intersection.width;
    rect.height = intersection.height;
    if (!rect.width) {
        logger_1.logger.debug('No space for selected layers, skipping...');
        return;
    }
    drawSpacingShape(layerName, rect, alignment_1.EdgeVertical.middle, root);
}
function drawSpacingShape(name, rect, drawSizePosition, root) {
    let frame = new sketch_1.sketch.Rectangle(rect.x, rect.y, rect.width, rect.height);
    size_1.drawSizeForFrame(frame, drawSizePosition, {
        name: name,
        parent: root,
        background: context_1.context.meaxureStyles.spacing.background,
        foreground: context_1.context.meaxureStyles.spacing.foreground,
    });
}
function swap(a, b) {
    return [b, a];
}
//# sourceMappingURL=spacings.js.map