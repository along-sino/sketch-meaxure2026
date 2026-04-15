"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsMaster = void 0;
const sketch_1 = require("../../sketch");
class ConfigsMaster {
    constructor(document) {
        this._document = document;
    }
    /**
     * Design resolution, 2 represents @2x
     */
    get resolution() {
        return this._readDocumentSetting('scale', 1);
    }
    /**
     * Design resolution, 2 represents @2x
     */
    set resolution(value) {
        this._setDocumentSetting('scale', value);
    }
    get units() {
        return this._readDocumentSetting('units', "px");
    }
    set units(value) {
        this._setDocumentSetting('units', value);
    }
    get format() {
        return this._readDocumentSetting('format', "color-hex");
    }
    set format(value) {
        this._setDocumentSetting('format', value);
    }
    get properties() {
        return this._readSessionVariable('properties', []);
    }
    set properties(value) {
        this._setSessionVariable('properties', value);
    }
    get byInfluence() {
        return this._readSessionVariable('byInfluence', false);
    }
    set byInfluence(value) {
        this._setSessionVariable('byInfluence', value);
    }
    get byPercentage() {
        return this._readSessionVariable('byPercentage', false);
    }
    set byPercentage(value) {
        this._setSessionVariable('byPercentage', value);
    }
    _readDocumentSetting(field, defaultValue) {
        let value = sketch_1.sketch.Settings.documentSettingForKey(this._document, field);
        // logger.debug(`read config: "${field}"=${value}`);
        if (value === undefined) {
            // logger.debug(`use default ${defaultValue} for "${field}"`);
            return defaultValue;
        }
        return value;
    }
    _setDocumentSetting(field, value) {
        sketch_1.sketch.Settings.setDocumentSettingForKey(this._document, field, value);
    }
    _readSessionVariable(field, defaultValue) {
        let value = sketch_1.sketch.Settings.sessionVariable(field);
        // logger.debug(`read config: "${field}"=${value}`);
        if (value === undefined) {
            // logger.debug(`use default ${defaultValue} for "${field}"`);
            return defaultValue;
        }
        return value;
    }
    _setSessionVariable(field, value) {
        sketch_1.sketch.Settings.setSessionVariable(field, value);
    }
}
exports.ConfigsMaster = ConfigsMaster;
//# sourceMappingURL=config.js.map