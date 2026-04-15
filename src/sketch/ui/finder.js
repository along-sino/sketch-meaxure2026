"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showFiles = void 0;
function showFiles(files) {
    let fileURLs = files.map(f => NSURL.fileURLWithPath(f));
    NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs(fileURLs);
}
exports.showFiles = showFiles;
//# sourceMappingURL=finder.js.map