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
exports.Storage = void 0;
const path_1 = __importDefault(require("path"));
const adapters_1 = require("./adapters");
const availableAdapters = (0, adapters_1.getAvailableAdapters)();
class Storage {
    // public ready: Promise<void>;
    constructor(config) {
        // this.ready = this.switchAdapter(config);
        this.switchAdapter(config);
    }
    // public async switchAdapter(config: string | AdapterConfig): Promise<void> {
    switchAdapter(config) {
        // console.log(config);
        // at this point we are only interested in the type of the config
        let type;
        if (typeof config === "string") {
            if (config.indexOf("://") !== -1) {
                type = config.substring(0, config.indexOf("://"));
            }
            else {
                // you can also pass a string that only contains the type, e.g. "gcs"
                type = config;
            }
        }
        else {
            type = config.type;
        }
        // console.log("type", type);
        // console.log("adapterClasses", adapterClasses);
        // console.log("class", adapterClasses[type], "function", adapterFunctions[type]);
        if (!adapters_1.adapterClasses[type] && !adapters_1.adapterFunctions[type]) {
            throw new Error(`unsupported storage type, must be one of ${availableAdapters}`);
        }
        if (adapters_1.adapterClasses[type]) {
            const adapterName = adapters_1.adapterClasses[type][0];
            const adapterPath = adapters_1.adapterClasses[type][1];
            // const AdapterClass = require(path.join(__dirname, name));
            let AdapterClass; // eslint-disable-line
            try {
                AdapterClass = require(adapterPath)[adapterName];
                // console.log(`using remote adapter class ${adapterName}`);
            }
            catch (e) {
                // console.log(`using local adapter class ${adapterName}`);
                // console.log(e.message);
                try {
                    AdapterClass = require(path_1.default.join(__dirname, adapterName))[adapterName];
                }
                catch (e) {
                    throw new Error(e.message);
                }
            }
            this._adapter = new AdapterClass(config);
            // const AdapterClass = await import(`./${name}`);
            // this.adapter = new AdapterClass[name](args);
        }
        else if (adapters_1.adapterFunctions[type]) {
            const adapterName = adapters_1.adapterClasses[type][0];
            const adapterPath = adapters_1.adapterClasses[type][1];
            // const module = require(path.join(__dirname, name));
            let module; // eslint-disable-line
            try {
                module = require(adapterPath);
            }
            catch (e) {
                module = require(require(path_1.default.join(__dirname, adapterPath)));
            }
            this._adapter = module.createAdapter(config);
        }
    }
    // introspective adapter API
    setSelectedBucket(bucketName) {
        this.adapter.bucketName = bucketName;
    }
    getSelectedBucket() {
        return this.adapter.bucketName;
    }
    set(bucketName) {
        this.adapter.bucketName = bucketName;
    }
    get bucketName() {
        return this.adapter.bucketName;
    }
    get adapter() {
        return this._adapter;
    }
    getAdapter() {
        return this.adapter;
    }
    get type() {
        return this.adapter.type;
    }
    getType() {
        return this.adapter.type;
    }
    get config() {
        return this.adapter.config;
    }
    getConfig() {
        return this.adapter.config;
    }
    get configError() {
        return this.adapter.configError;
    }
    getConfigError() {
        return this.adapter.configError;
    }
    //eslint-disable-next-line
    get serviceClient() {
        return this.adapter.serviceClient;
    }
    //eslint-disable-next-line
    getServiceClient() {
        return this.adapter.serviceClient;
    }
    // public adapter API
    addFile(paramObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.addFile(paramObject);
        });
    }
    addFileFromPath(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.addFileFromPath(params);
        });
    }
    addFileFromBuffer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.addFileFromBuffer(params);
        });
    }
    addFileFromStream(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.addFileFromStream(params);
        });
    }
    createBucket(bucketName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.createBucket(bucketName, options);
        });
    }
    clearBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.clearBucket(bucketName);
        });
    }
    deleteBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.deleteBucket(bucketName);
        });
    }
    listBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.listBuckets();
        });
    }
    getFileAsStream(arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.getFileAsStream(arg1, arg2, arg3);
        });
    }
    getFileAsURL(arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.getFileAsURL(arg1, arg2, arg3);
        });
    }
    removeFile(arg1_1, arg2_1) {
        return __awaiter(this, arguments, void 0, function* (arg1, arg2, arg3 = false) {
            return this.adapter.removeFile(arg1, arg2, arg3);
        });
    }
    listFiles(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.listFiles(arg1, arg2);
        });
    }
    sizeOf(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.sizeOf(arg1, arg2);
        });
    }
    bucketExists(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.bucketExists(bucketName);
        });
    }
    fileExists(arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adapter.fileExists(arg1, arg2);
        });
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map