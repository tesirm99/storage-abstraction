"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageType = exports.Storage = void 0;
var Storage_1 = require("../Storage");
Object.defineProperty(exports, "Storage", { enumerable: true, get: function () { return Storage_1.Storage; } });
__exportStar(require("../adapters"), exports);
var general_1 = require("../types/general");
Object.defineProperty(exports, "StorageType", { enumerable: true, get: function () { return general_1.StorageType; } });
//# sourceMappingURL=Storage.js.map