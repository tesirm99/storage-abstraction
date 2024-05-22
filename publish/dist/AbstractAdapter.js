"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAdapter = void 0;
class AbstractAdapter {
    constructor(config) {
        this._type = "abstract-adapter";
        this._configError = null;
        this._bucketName = null;
        this._client = null; // eslint-disable-line
    }
    get type() {
        return this._type;
    }
    getType() {
        return this.type;
    }
    get config() {
        return this._config;
    }
    getConfig() {
        return this.config;
    }
    get configError() {
        return this._configError;
    }
    getConfigError() {
        return this.configError;
    }
    // eslint-disable-next-line
    get serviceClient() {
        return this._client;
    }
    // eslint-disable-next-line
    getServiceClient() {
        return this._client;
    }
    setSelectedBucket(bucketName) {
        this._bucketName = bucketName;
    }
    getSelectedBucket() {
        return this._bucketName;
    }
    set(bucketName) {
        this._bucketName = bucketName;
    }
    get bucketName() {
        return this._bucketName;
    }
    addFileFromPath(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addFile(params);
        });
    }
    addFileFromBuffer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addFile(params);
        });
    }
    addFileFromStream(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addFile(params);
        });
    }
    _getFileAndBucket(arg1, arg2) {
        let bucketName = null;
        let fileName = null;
        if (typeof arg2 === "string") {
            bucketName = arg1;
            fileName = arg2;
        }
        else if (typeof arg2 === "undefined") {
            fileName = arg1;
            if (this._bucketName === null) {
                return {
                    bucketName,
                    fileName,
                    error: "no bucket selected",
                };
            }
            bucketName = this._bucketName;
        }
        return {
            bucketName,
            fileName,
            error: null,
        };
    }
    // public
    clearBucket(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            if (typeof name === "undefined") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                name = this._bucketName;
            }
            return this._clearBucket(name);
        });
    }
    deleteBucket(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            if (typeof name === "undefined") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                name = this._bucketName;
            }
            return this._deleteBucket(name);
        });
    }
    bucketExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            if (typeof name === "undefined") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                name = this._bucketName;
            }
            return this._bucketExists(name);
        });
    }
    listFiles(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            let bucketName;
            let numFiles = 10000;
            if (typeof arg1 === "number") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                bucketName = this._bucketName;
                numFiles = arg1;
            }
            else if (typeof arg1 === "string") {
                bucketName = arg1;
                if (typeof arg2 === "number") {
                    numFiles = arg2;
                }
            }
            else {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                bucketName = this._bucketName;
            }
            return this._listFiles(bucketName, numFiles);
        });
    }
    addFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            if (typeof params.bucketName === "undefined") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                params.bucketName = this._bucketName;
            }
            if (typeof params.options !== "object") {
                params.options = {};
            }
            return this._addFile(params);
        });
    }
    getFileAsStream(arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configError !== null) {
                return { error: this.configError, value: null };
            }
            let bucketName;
            let fileName;
            let options = {};
            if (typeof arg1 === "string" && typeof arg2 === "string") {
                bucketName = arg1;
                fileName = arg2;
                if (typeof arg3 !== "undefined") {
                    options = arg3;
                }
            }
            else if (typeof arg1 === "string" && typeof arg2 !== "string") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                bucketName = this._bucketName;
                fileName = arg1;
                if (typeof arg2 !== "undefined") {
                    options = arg2;
                }
            }
            return this._getFileAsStream(bucketName, fileName, options);
        });
    }
    getFileAsURL(arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._configError !== null) {
                return { value: null, error: this.configError };
            }
            let bucketName;
            let fileName;
            let options = {};
            if (typeof arg1 === "string" && typeof arg2 === "string") {
                bucketName = arg1;
                fileName = arg2;
                if (typeof arg3 !== "undefined") {
                    options = arg3;
                }
            }
            else if (typeof arg1 === "string" && typeof arg2 !== "string") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "no bucket selected",
                    };
                }
                bucketName = this._bucketName;
                fileName = arg1;
                if (typeof arg2 !== "undefined") {
                    options = arg2;
                }
            }
            return this._getFileAsURL(bucketName, fileName, options);
        });
    }
    sizeOf(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            const { bucketName, fileName, error } = this._getFileAndBucket(arg1, arg2);
            if (error !== null) {
                return { value: null, error };
            }
            return this._sizeOf(bucketName, fileName);
        });
    }
    fileExists(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            const { bucketName, fileName, error } = this._getFileAndBucket(arg1, arg2);
            if (error !== null) {
                return { value: null, error };
            }
            return this._fileExists(bucketName, fileName);
        });
    }
    removeFile(arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            let bucketName;
            let fileName;
            let allVersions = false;
            if (typeof arg1 === "string" && typeof arg2 === "string") {
                bucketName = arg1;
                fileName = arg2;
                if (typeof arg3 === "boolean") {
                    allVersions = arg3;
                }
            }
            else if (typeof arg1 === "string" && typeof arg2 !== "string") {
                if (this._bucketName === null) {
                    return {
                        value: null,
                        error: "No bucket selected",
                    };
                }
                bucketName = this._bucketName;
                fileName = arg1;
                if (typeof arg2 === "boolean") {
                    allVersions = arg2;
                }
            }
            return this._removeFile(bucketName, fileName, allVersions);
        });
    }
}
exports.AbstractAdapter = AbstractAdapter;
//# sourceMappingURL=AbstractAdapter.js.map