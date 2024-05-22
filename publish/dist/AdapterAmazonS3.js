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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterAmazonS3 = void 0;
const fs_1 = __importDefault(require("fs"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const AbstractAdapter_1 = require("./AbstractAdapter");
const general_1 = require("./types/general");
const util_1 = require("./util");
class AdapterAmazonS3 extends AbstractAdapter_1.AbstractAdapter {
    constructor(config) {
        super(config);
        this._type = general_1.StorageType.S3;
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
                const { protocol: type, username: accessKeyId, password: secretAccessKey, host: bucketName, searchParams, } = value;
                if (searchParams !== null) {
                    this._config = Object.assign({ type }, searchParams);
                }
                else {
                    this._config = { type };
                }
                if (accessKeyId !== null) {
                    this._config.accessKeyId = accessKeyId;
                }
                if (secretAccessKey !== null) {
                    this._config.secretAccessKey = secretAccessKey;
                }
                if (bucketName !== null) {
                    this._config.bucketName = bucketName;
                }
            }
            // console.log(this._config);
        }
        try {
            if (this.config.accessKeyId && this.config.secretAccessKey) {
                const o = Object.assign({}, this.config); // eslint-disable-line
                delete o.credentials;
                delete o.accessKeyId;
                delete o.secretAccessKey;
                this._client = new client_s3_1.S3Client(Object.assign({ credentials: {
                        accessKeyId: this.config.accessKeyId,
                        secretAccessKey: this.config.secretAccessKey,
                    } }, o));
            }
            else {
                const o = Object.assign({}, this.config); // eslint-disable-line
                delete o.accessKeyId;
                delete o.secretAccessKey;
                this._client = new client_s3_1.S3Client(o);
            }
        }
        catch (e) {
            this._configError = `[configError] ${e.message}`;
        }
        if (typeof this.config.bucketName !== "undefined") {
            this._bucketName = this.config.bucketName;
        }
    }
    getFiles(bucketName_1) {
        return __awaiter(this, arguments, void 0, function* (bucketName, maxFiles = 10000) {
            try {
                const input = {
                    Bucket: bucketName,
                    MaxKeys: maxFiles,
                };
                const command = new client_s3_1.ListObjectsCommand(input);
                const { Contents } = yield this._client.send(command);
                // console.log("Contents", Contents);
                return { value: Contents, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    getFileVersions(bucketName_1) {
        return __awaiter(this, arguments, void 0, function* (bucketName, maxFiles = 10000) {
            try {
                const input = {
                    Bucket: bucketName,
                    MaxKeys: maxFiles,
                };
                const command = new client_s3_1.ListObjectVersionsCommand(input);
                const { Versions } = yield this._client.send(command);
                // console.log("Versions", Versions);
                return { value: Versions, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    // protected, called by methods of public API via AbstractAdapter
    _getFileAsStream(bucketName, fileName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = options;
            let range = `bytes=${start}-${end}`;
            if (typeof start === "undefined" && typeof end === "undefined") {
                range = undefined;
            }
            else if (typeof start === "undefined") {
                range = `bytes=0-${end}`;
            }
            else if (typeof end === "undefined") {
                range = `bytes=${start}-`;
            }
            try {
                const params = {
                    Bucket: bucketName,
                    Key: fileName,
                    Range: range,
                };
                const command = new client_s3_1.GetObjectCommand(params);
                const response = yield this._client.send(command);
                return { value: response.Body, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _removeFile(bucketName, fileName, allVersions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    Bucket: bucketName,
                    Key: fileName,
                };
                const command = new client_s3_1.DeleteObjectCommand(input);
                const response = yield this._client.send(command);
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _clearBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            let objects;
            // first try to remove the versioned files
            const { value, error } = yield this.getFileVersions(bucketName);
            if (error === "no versions" || error === "ListObjectVersions not implemented") {
                // if that fails remove non-versioned files
                const { value, error } = yield this.getFiles(bucketName);
                if (error === "no contents") {
                    return { value: null, error: "Could not remove files" };
                }
                else if (error !== null) {
                    return { value: null, error };
                }
                else if (typeof value !== "undefined") {
                    objects = value.map((value) => ({ Key: value.Key }));
                }
            }
            else if (error !== null) {
                return { value: null, error };
            }
            else if (typeof value !== "undefined") {
                objects = value.map((value) => ({
                    Key: value.Key,
                    VersionId: value.VersionId,
                }));
            }
            if (typeof objects !== "undefined") {
                try {
                    const input = {
                        Bucket: bucketName,
                        Delete: {
                            Objects: objects,
                            Quiet: false,
                        },
                    };
                    const command = new client_s3_1.DeleteObjectsCommand(input);
                    yield this._client.send(command);
                    return { value: "ok", error: null };
                }
                catch (e) {
                    return { value: null, error: e.message };
                }
            }
            return { value: "ok", error: null };
        });
    }
    _deleteBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.clearBucket(bucketName);
                const input = {
                    Bucket: bucketName,
                };
                const command = new client_s3_1.DeleteBucketCommand(input);
                const response = yield this._client.send(command);
                // console.log(response);
                return { value: "ok", error: null };
            }
            catch (e) {
                // error message Cubbit
                if (e.message === "NoSuchBucket") {
                    return { value: null, error: `The specified bucket does not exist: ${bucketName}` };
                }
                return { value: null, error: e.message };
            }
        });
    }
    _addFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileData;
                if (typeof params.origPath !== "undefined") {
                    const f = params.origPath;
                    if (!fs_1.default.existsSync(f)) {
                        return {
                            value: null,
                            error: `File with given path: ${f}, was not found`,
                        };
                    }
                    fileData = fs_1.default.createReadStream(f);
                }
                else if (typeof params.buffer !== "undefined") {
                    fileData = params.buffer;
                }
                else if (typeof params.stream !== "undefined") {
                    fileData = params.stream;
                }
                const input = Object.assign({ Bucket: params.bucketName, Key: params.targetPath, Body: fileData }, params.options);
                const command = new client_s3_1.PutObjectCommand(input);
                const response = yield this._client.send(command);
                return this._getFileAsURL(params.bucketName, params.targetPath, params.options);
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _getFileAsURL(bucketName, fileName, options // e.g. { expiresIn: 3600 }
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield (0, s3_request_presigner_1.getSignedUrl)(this._client, new client_s3_1.GetObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                }), options);
                return { value: url, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _listFiles(bucketName, numFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, error } = yield this.getFiles(bucketName, numFiles);
                if (error !== null) {
                    return { value: null, error };
                }
                if (typeof value === "undefined") {
                    return { value: [], error: null };
                }
                return { value: value.map((o) => [o.Key, o.Size]), error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _sizeOf(bucketName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    Bucket: bucketName,
                    Key: fileName,
                };
                const command = new client_s3_1.HeadObjectCommand(input);
                const response = yield this._client.send(command);
                return { value: response.ContentLength, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    _bucketExists(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    Bucket: bucketName,
                };
                const command = new client_s3_1.HeadBucketCommand(input);
                yield this._client.send(command);
                return { value: true, error: null };
            }
            catch (e) {
                return { value: false, error: null };
            }
        });
    }
    _fileExists(bucketName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    Bucket: bucketName,
                    Key: fileName,
                };
                const command = new client_s3_1.HeadObjectCommand(input);
                yield this._client.send(command);
                return { value: true, error: null };
            }
            catch (e) {
                return { value: false, error: null };
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
            var _a;
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            try {
                const input = {};
                const command = new client_s3_1.ListBucketsCommand(input);
                const response = yield this._client.send(command);
                const bucketNames = (_a = response.Buckets) === null || _a === void 0 ? void 0 : _a.map((b) => b === null || b === void 0 ? void 0 : b.Name);
                return { value: bucketNames, error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
    createBucket(bucketName_1) {
        return __awaiter(this, arguments, void 0, function* (bucketName, options = {}) {
            if (this.configError !== null) {
                return { value: null, error: this.configError };
            }
            const error = (0, util_1.validateName)(bucketName);
            if (error !== null) {
                return { value: null, error };
            }
            try {
                const input = Object.assign({ Bucket: bucketName }, options);
                const command = new client_s3_1.CreateBucketCommand(input);
                const response = yield this._client.send(command);
                // console.log(response.Location, response.Location.indexOf(bucketName));
                /*
                console.log(response);
                // not sure if this is necessary
                if (response.$metadata.httpStatusCode === 200) {
                  return { value: "ok", error: null };
                } else {
                  return {
                    value: null,
                    error: `Error http status code ${response.$metadata.httpStatusCode}`,
                  };
                }
                */
                return { value: "ok", error: null };
            }
            catch (e) {
                return { value: null, error: e.message };
            }
        });
    }
}
exports.AdapterAmazonS3 = AdapterAmazonS3;
//# sourceMappingURL=AdapterAmazonS3.js.map