"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPanel = void 0;
const context_1 = require("../common/context");
const webviewPanel_1 = require("../../webviewPanel");
const helper_1 = require("../helpers/helper");
const language_1 = require("../common/language");
const sketch_1 = require("../../sketch");
const layers_1 = require("../export/layers");
function exportPanel() {
    let panel = webviewPanel_1.createWebviewPanel({
        identifier: 'co.jebbs.sketch-meaxure.export',
        url: helper_1.getResourcePath() + "/panel/export.html",
        width: 320,
        height: 597,
    });
    if (!panel)
        return undefined;
    let [data, allArtboards] = prepareExportData();
    panel.onDidReceiveMessage('init', () => data);
    panel.onDidReceiveMessage('sort', rdata => {
        data.order = rdata.order;
        data.reverse = rdata.reverse;
        for (let p = 0; p < data.pages.length; p++) {
            data.pages[p].artboards = sortArtboards(data.pages[p].artboards, rdata.order, rdata.reverse);
        }
        return data;
    });
    return new Promise((resolve, reject) => {
        panel.onClose(() => resolve(undefined));
        panel.onDidReceiveMessage('submit', rdata => {
            let exportArtboards = [];
            let layersCount = 0;
            for (let page of data.pages) {
                // don't sort again, already done in sort requests.
                // artboards = sortArtboards(artboards, message.data.order, message.data.reverse);
                for (let info of page.artboards) {
                    if (rdata.selection[info.objectID]) {
                        let artboard = allArtboards[info.objectID];
                        let [children, count] = layers_1.getChildrenForExport(artboard);
                        layersCount += count;
                        exportArtboards.push({ artboard: artboard, children: children });
                    }
                }
            }
            resolve({
                selection: exportArtboards,
                layersCount: layersCount,
                advancedMode: rdata.exportOption,
                byInfluence: rdata.exportInfluenceRect,
            });
            panel.close();
        });
        panel.show();
    });
}
exports.exportPanel = exportPanel;
function prepareExportData() {
    let allArtboards = {};
    let data = {
        language: language_1.getLanguage(),
        selection: [],
        current: [],
        pages: [],
        exportOption: true,
        exportInfluenceRect: context_1.context.configs.byInfluence,
        order: 'artboard-rows',
        reverse: false,
    };
    let artboardSet = new Set();
    if (context_1.context.selection.length > 0) {
        for (let layer of context_1.context.selection.layers) {
            if (layer.type == sketch_1.sketch.Types.Artboard || layer.type == sketch_1.sketch.Types.SymbolMaster) {
                artboardSet.add(layer.id);
                continue;
            }
            let artboard = layer.getParentArtboard();
            if (artboard)
                artboardSet.add(artboard.id);
        }
        data.selection = Array.from(artboardSet);
    }
    if (context_1.context.artboard) {
        data.current.push(context_1.context.artboard.id);
    }
    if (context_1.context.document.selectedPage) {
        data.currentPageID = context_1.context.document.selectedPage.id;
    }
    for (let page of context_1.context.document.pages) {
        let pageData = {};
        let artboards = page.layers.filter(p => p.type == sketch_1.sketch.Types.Artboard || artboardSet.has(p.id));
        pageData.name = page.name;
        pageData.objectID = page.id;
        pageData.artboards = [];
        let layerOrder = 0;
        for (let artboard of artboards) {
            layerOrder++;
            let artboardData = {};
            artboardData.name = artboard.name;
            artboardData.objectID = artboard.id;
            allArtboards[artboardData.objectID] = artboard;
            artboardData.layerOrder = layerOrder;
            artboardData.x1 = artboard.frame.x;
            artboardData.y1 = artboard.frame.y;
            artboardData.x2 = artboardData.x1 + artboard.frame.width;
            artboardData.y2 = artboardData.y1 + artboard.frame.height;
            artboardData.row = undefined;
            artboardData.column = undefined;
            pageData.artboards.push(artboardData);
        }
        data.pages.push(pageData);
    }
    return [data, allArtboards];
}
function sortArtboards(artboards, artboardOrder, reverse) {
    switch (artboardOrder) {
        case 'layer-order':
            artboards = artboards.sort(function (a, b) {
                return b.layerOrder - a.layerOrder;
            });
            break;
        case 'alphabet':
            artboards = artboards.sort(function (a, b) {
                let nameA = a.name.toUpperCase(), nameB = b.name.toUpperCase();
                return nameA > nameB ? 1 : -1;
            });
            break;
        case 'artboard-cols':
            calcArtboardsColumn(artboards);
            artboards = artboards.sort((a, b) => {
                let larger = a.column > b.column ||
                    (a.column == b.column && a.y1 > b.y1) ||
                    (a.column == b.column && a.y1 == b.y1 && a.x1 > b.x2);
                return larger ? 1 : -1;
            });
            break;
        case 'artboard-rows':
            calcArtboardsRow(artboards);
            artboards = artboards.sort((a, b) => {
                let larger = a.row > b.row ||
                    (a.row == b.row && a.x1 > b.x1) ||
                    (a.row == b.row && a.x1 == b.x1 && a.y1 > b.y2);
                return larger ? 1 : -1;
            });
            break;
        default:
            break;
    }
    if (reverse)
        return artboards.reverse();
    return artboards;
}
function calcArtboardsRow(artboardDatas) {
    let curRow = 0;
    let unCalcData = artboardDatas;
    let rowTop = 0;
    let rowBottom = 0;
    while (unCalcData.length) {
        curRow++;
        // Find the top most artboard to start the row
        let topMost = unCalcData[0];
        for (let item of unCalcData) {
            if (topMost.y1 > item.y1) {
                topMost = item;
            }
        }
        // logger.debug("top most: " + topMost.name);
        rowTop = topMost.y1;
        rowBottom = topMost.y2;
        // Find intersecting artboards
        let isRangeExtened = true;
        while (isRangeExtened) {
            // Row range may updates when new item found,
            // new range could include more items.
            // So, loop until range not extended.
            isRangeExtened = false;
            for (let item of artboardDatas.filter(a => !a.row)) {
                // If not beneath or above the range,
                // we found an intersecting artboard.
                if (!(item.y1 > rowBottom || item.y2 < rowTop)) {
                    // Extend row range.
                    if (rowTop > item.y1) {
                        rowTop = item.y1;
                        isRangeExtened = true;
                    }
                    if (rowBottom < item.y2) {
                        rowBottom = item.y2;
                        isRangeExtened = true;
                    }
                    item.row = curRow;
                }
            }
        }
        // Calculate next row.
        unCalcData = artboardDatas.filter(a => !a.row);
    }
}
function calcArtboardsColumn(artboardDatas) {
    let Col = 0;
    let unCalcData = artboardDatas;
    let colLeft = 0;
    let colRight = 0;
    while (unCalcData.length) {
        Col++;
        // Find the left most artboard to start the column
        let leftMost = unCalcData[0];
        for (let item of unCalcData) {
            if (leftMost.x1 > item.x1) {
                leftMost = item;
            }
        }
        // logger.debug("left most: " + leftMost.name);
        colLeft = leftMost.x1;
        colRight = leftMost.x2;
        // Find intersecting artboards
        let isRangeExtened = true;
        while (isRangeExtened) {
            // Column range may updates when new item found,
            // new range could include more items.
            // So, loop until range not extended.
            isRangeExtened = false;
            for (let item of artboardDatas.filter(a => !a.column)) {
                // If not on right or left of the range,
                // we found an intersecting artboard.
                if (!(item.x1 > colRight || item.x2 < colLeft)) {
                    // Extend column range.
                    if (colLeft > item.x1) {
                        colLeft = item.x1;
                        isRangeExtened = true;
                    }
                    if (colRight < item.x2) {
                        colRight = item.x2;
                        isRangeExtened = true;
                    }
                    item.column = Col;
                }
            }
        }
        // Calculate next column.
        unCalcData = artboardDatas.filter(a => !a.column);
    }
}
//# sourceMappingURL=exportPanel.js.map