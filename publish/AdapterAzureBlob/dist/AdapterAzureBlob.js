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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterAzureBlob = void 0;
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
const storage_blob_1 = require("@azure/storage-blob");
const identity_1 = require("@azure/identity");
const AbstractAdapter_1 = require("./AbstractAdapter");
const general_1 = require("./types/general");
const util_1 = require("./util");
class AdapterAzureBlob extends AbstractAdapter_1.AbstractAdapter {
    constructor(config) {
        super(config);
        this._type = general_1.StorageType.AZURE;
        this._configError = null;
        if (typeof config !== "string") {
            this._config = Object.assign({}, config);
        }
        else {
            const { value, error } = (0, util_1.parseUrl)(config);
            if (error !== null) {
                this._configError = `[configError] ${error}`;
            }
            else {
                const { protocol: type, username: accountName, password: accountKey, host: bucketName, searchParams, } = value;
                if (searchParams !== null) {
                    this._config = Object.assign({ type }, searchParams);
                }
                else {
                    this._config = { type };
                }
                if (accountName !== null) {
                    this._config.accountName = accountName;
                }
                if (accountKey !== null) {
                    this._config.accountKey = accountKey;
                }
                if (bucketName !== null) {
                    this._config.bucketName = bucketName;
                }
            }
            // console.log(this._config);
        }
        if (!this.config.accountName && !this.config.connectionString) {
            this._configError =
                '[configError] Please provide at least a value for "accountName" or for "connectionString';
            return;
        }
        if (typeof this.config.accountKey !== "undefined") {
            // option 1: accountKey
            try {
                this.sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(this.config.accountName, this.config.accountKey);
            }
            catch (e) {
                this._configError = `[configError] ${JSON.parse(e.message).code}`;
            }
            try {
                this._client = new storage_blob_1.BlobServiceClient(`https://${this.config.accountName}.blob.core.windows.net`, this.sharedKeyCredential, this.config.options);
            }
            catch (e) {
                this._configError = `[configError] ${e.message}`;
            }
        }
        else if (typeof this.config.sasToken !== "undefined") {
            // option 2: sasToken
            try {
                this._client = new storage_blob_1.BlobServiceClient(`https://${this.config.accountName}.blob.core.windows.net?${this.config.sasToken}`, new storage_blob_1.AnonymousCredential(), this.config.options);
            }
            catch (e) {
                this._configError = `[configError] ${e.message}`;
            }
        }
        else if (typeof this.config.connectionString !== "undefined") {
            // option 3: connection string
            try {
                this._client = storage_blob_1.BlobServiceClient.fromConnectionString(this.config.connectionString);
            }
            catch (e) {
                this._configError = `[configError] ${e.message}`;
            }
        }
        else {
            // option 4: password less
            try {
                this._client = new storage_blob_1.BlobServiceClient(`https://${this.config.accountName}.blob.core.windows.net`, new identity_1.DefaultAzureCredential(), this.config.options);
            }
            catch (e) {
                this._configError = `[configError] ${e.message}`;
            }
        }
        if (typeof this.config.bucketName !== "undefined") {
            this._bucketName = this.config.bucketName;
        }
    }
    // protected, called by methods of public API via AbstractAdapter
    _getFileAsStream(bucketName, fileName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = this._client.getContainerClient(bucketName).getBlobClient(fileName);
                const exists = yield file.exists();
                if (!exists) {
                    return {
                        value: null,
                        error: `File ${fileName} could not be found in bucket ${bucketName}`,
                    };
                }
                const { start, end } = options;
                let offset;
                let count;
                if (typeof start !== "undefined") {
                    offset = start;
                }
                else {
                    offset = 0;
                }
                if (typeof end !== "undefined") {
                    count = end - offset + 1;
                }
                delete options.start;
                delete options.end;
                // console.log(offset, count, options);
                try {
                    const stream = yield file.download(offset, count, options);
                    return { value: stream.readableStreamBody, error: null };
                }
                catch (e) {
                    return { value: null, error: e.message };
                }
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _getFileAsURL(bucketName, fileName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = this._client.getContainerClient(bucketName).getBlobClient(fileName);
                const exists = yield file.exists();
                if (!exists) {
                    return {
                        value: null,
                        error: `File ${fileName} could not be found in bucket ${bucketName}`,
                    };
                }
                try {
                    const sasOptions = {
                        permissions: options.permissions || storage_blob_1.BlobSASPermissions.parse("r"),
                        expiresOn: options.expiresOn || new Date(new Date().valueOf() + 86400).toISOString(),
                    };
                    let url;
                    if (options.isPublicFile && !options.forceSignedUrl) {
                        url = file.url;
                    }
                    else {
                        url = yield file.generateSasUrl(sasOptions);
                    }
                    return { value: url, error: null };
                }
                catch (e) {
                    return { value: null, error: e.message };
                }
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _clearBucket(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                // const containerClient = this._client.getContainerClient(name);
                // const blobs = containerClient.listBlobsFlat();
                // for await (const blob of blobs) {
                //   console.log(blob.name);
                //   await containerClient.deleteBlob(blob.name);
                // }
                const containerClient = this._client.getContainerClient(name);
                const blobs = containerClient.listBlobsByHierarchy("/");
                try {
                    for (var _d = true, blobs_1 = __asyncValues(blobs), blobs_1_1; blobs_1_1 = yield blobs_1.next(), _a = blobs_1_1.done, !_a; _d = true) {
                        _c = blobs_1_1.value;
                        _d = false;
                        const blob = _c;
                        if (blob.kind === "prefix") {
                            // console.log("prefix", blob);
                        }
                        else {
                            yield containerClient.deleteBlob(blob.name);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = blobs_1.return)) yield _b.call(blobs_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _deleteBucket(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.clearBucket(name);
                const del = yield this._client.deleteContainer(name);
                //console.log('deleting container: ', del);
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _listFiles(bucketName, numFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            try {
                const files = [];
                const data = this._client.getContainerClient(bucketName).listBlobsFlat();
                try {
                    for (var _d = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _a = data_1_1.done, !_a; _d = true) {
                        _c = data_1_1.value;
                        _d = false;
                        const blob = _c;
                        if (blob.properties["ResourceType"] !== "directory") {
                            files.push([blob.name, blob.properties.contentLength]);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = data_1.return)) yield _b.call(data_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return { value: files, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _addFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let readStream;
                if (typeof params.origPath === "string") {
                    const f = params.origPath;
                    if (!fs_1.default.existsSync(f)) {
                        return { value: null, error: `File with given path: ${f}, was not found` };
                    }
                    readStream = fs_1.default.createReadStream(f);
                }
                else if (typeof params.buffer !== "undefined") {
                    readStream = new stream_1.Readable();
                    readStream._read = () => { }; // _read is required but you can noop it
                    readStream.push(params.buffer);
                    readStream.push(null);
                }
                else if (typeof params.stream !== "undefined") {
                    readStream = params.stream;
                }
                const file = this._client
                    .getContainerClient(params.bucketName)
                    .getBlobClient(params.targetPath)
                    .getBlockBlobClient();
                const writeStream = yield file.uploadStream(readStream, 64000, 20, params.options);
                if (writeStream.errorCode) {
                    return { value: null, error: writeStream.errorCode };
                }
                else {
                    return this._getFileAsURL(params.bucketName, params.targetPath, params.options);
                }
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _removeFile(bucketName, fileName, allVersions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = this._client.getContainerClient(bucketName);
                const file = yield container.getBlobClient(fileName).deleteIfExists();
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _sizeOf(bucketName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blob = this._client.getContainerClient(bucketName).getBlobClient(fileName);
                const length = (yield blob.getProperties()).contentLength;
                return { value: length, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _bucketExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cont = this._client.getContainerClient(name);
                const exists = yield cont.exists();
                return { value: exists, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _fileExists(bucketName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this._client
                    .getContainerClient(bucketName)
                    .getBlobClient(fileName)
                    .exists();
                return { value: exists, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    // public
    get config() {
        return this._config;
    }
    getConfig() {
        return this._config;
    }
    get serviceClient() {
        return this._client;
    }
    getServiceClient() {
        return this._client;
    }
    listBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            // let i = 0;
            try {
                const bucketNames = [];
                try {
                    // let i = 0;
                    for (var _d = true, _e = __asyncValues(this._client.listContainers()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const container = _c;
                        // console.log(`${i++} ${container.name}`);
                        bucketNames.push(container.name);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return { value: bucketNames, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    createBucket(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            const error = (0, util_1.validateName)(name);
            if (error !== null) {
                return { value: null, error };
            }
            try {
                const res = yield this._client.createContainer(name, options);
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
}
exports.AdapterAzureBlob = AdapterAzureBlob;
//# sourceMappingURL=AdapterAzureBlob.js.map