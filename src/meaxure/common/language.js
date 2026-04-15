"use strict";
// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.localize = exports.getAllLanguage = exports.getLanguage = void 0;
const helper_1 = require("../helpers/helper");
let aliases = {
    "zh-Hans": "zh-cn",
    "zh-Hant": "zh-tw"
};
let caches = {};
function getLanguage() {
    return loadLanguage(getLangCode());
}
exports.getLanguage = getLanguage;
function getAllLanguage() {
    let all = {};
    for (let v of Object.values(aliases)) {
        let lang = loadLanguage(v);
        if (lang)
            all[v] = lang;
    }
    return all;
}
exports.getAllLanguage = getAllLanguage;
function localize(str, ...data) {
    let langs = loadLanguage(getLangCode());
    if (langs && langs[str]) {
        str = langs[str];
    }
    let idx = -1;
    return str.replace(/\%\@/gi, function () {
        idx++;
        return data[idx];
    });
}
exports.localize = localize;
function loadLanguage(code) {
    if (!code)
        return null;
    if (caches[code] !== undefined) {
        return caches[code];
    }
    let langFile = helper_1.getResourcePath() + "/i18n/" + code + ".json";
    if (!NSFileManager.defaultManager().fileExistsAtPath(langFile)) {
        return null;
    }
    let language = NSString.stringWithContentsOfFile_encoding_error(langFile, 4, nil);
    return caches[code] = JSON.parse(language);
}
function getLangCode() {
    let sysLanguage = String(NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0)).toLowerCase();
    for (let key of Object.keys(aliases)) {
        let lkey = key.toLowerCase();
        if (sysLanguage.startsWith(lkey)) {
            return aliases[key];
        }
    }
    return "";
}
//# sourceMappingURL=language.js.map