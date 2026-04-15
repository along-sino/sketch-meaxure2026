"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LOGGER_LEVEL = void 0;
const sketch_1 = require("../../sketch");
var LOGGER_LEVEL;
(function (LOGGER_LEVEL) {
    LOGGER_LEVEL[LOGGER_LEVEL["DEBUG"] = 1] = "DEBUG";
    LOGGER_LEVEL[LOGGER_LEVEL["INFO"] = 2] = "INFO";
    LOGGER_LEVEL[LOGGER_LEVEL["WARN"] = 3] = "WARN";
    LOGGER_LEVEL[LOGGER_LEVEL["ERROR"] = 4] = "ERROR";
    LOGGER_LEVEL[LOGGER_LEVEL["DISABLED"] = 5] = "DISABLED";
})(LOGGER_LEVEL = exports.LOGGER_LEVEL || (exports.LOGGER_LEVEL = {}));
;
class Logger {
    constructor(logLevel) {
        this._log_level = LOGGER_LEVEL.INFO;
        if (logLevel)
            this._log_level = logLevel;
    }
    get logLevel() {
        return this._log_level;
    }
    set logLevel(val) {
        this._log_level = val;
    }
    log(level, ...msgs) {
        if (level < this._log_level)
            return;
        let time = new Date().toLocaleString();
        console.log(`${time} [${LOGGER_LEVEL[level]}] `, ...msgs);
    }
    debug(...msgs) {
        this.log(LOGGER_LEVEL.DEBUG, ...msgs);
    }
    info(...msgs) {
        sketch_1.sketch.UI.message(msgs.join(' '));
        this.log(LOGGER_LEVEL.INFO, ...msgs);
    }
    warn(...msgs) {
        sketch_1.sketch.UI.message(msgs.join(' '));
        this.log(LOGGER_LEVEL.WARN, ...msgs);
    }
    error(...msgs) {
        sketch_1.sketch.UI.alert('Sketch MeaXure', msgs.join(' '));
        this.log(LOGGER_LEVEL.ERROR, ...msgs);
    }
}
exports.Logger = Logger;
exports.logger = new Logger(LOGGER_LEVEL.WARN);
//# sourceMappingURL=logger.js.map