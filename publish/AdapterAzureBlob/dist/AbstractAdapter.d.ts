import { AdapterConfig, IAdapter, Options, StreamOptions } from "./types/general";
import { FileBufferParams, FilePathParams, FileStreamParams } from "./types/add_file_params";
import { ResultObject, ResultObjectBoolean, ResultObjectBuckets, ResultObjectFiles, ResultObjectNumber, ResultObjectStream } from "./types/result";
export declare abstract class AbstractAdapter implements IAdapter {
    protected _type: string;
    protected _config: AdapterConfig | null;
    protected _configError: string | null;
    protected _bucketName: string;
    protected _client: any;
    constructor(config: string | AdapterConfig);
    get type(): string;
    getType(): string;
    get config(): AdapterConfig;
    getConfig(): AdapterConfig;
    get configError(): string;
    getConfigError(): string;
    get serviceClient(): any;
    getServiceClient(): any;
    setSelectedBucket(bucketName: string | null): void;
    getSelectedBucket(): string | null;
    set(bucketName: string | null): void;
    get bucketName(): string | null;
    addFileFromPath(params: FilePathParams): Promise<ResultObject>;
    addFileFromBuffer(params: FileBufferParams): Promise<ResultObject>;
    addFileFromStream(params: FileStreamParams): Promise<ResultObject>;
    protected _getFileAndBucket(arg1: string, arg2?: string): {
        bucketName: string;
        fileName: string;
        error: string;
    };
    protected abstract _clearBucket(name: string): Promise<ResultObject>;
    protected abstract _deleteBucket(name: string): Promise<ResultObject>;
    protected abstract _bucketExists(name: string): Promise<ResultObjectBoolean>;
    protected abstract _listFiles(bucketName: string, numFiles: number): Promise<ResultObjectFiles>;
    protected abstract _sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    protected abstract _addFile(params: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    protected abstract _fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    protected abstract _getFileAsStream(bucketName: string, fileName: string, options: StreamOptions): Promise<ResultObjectStream>;
    protected abstract _getFileAsURL(bucketName: string, fileName: string, options: Options): Promise<ResultObject>;
    protected abstract _removeFile(bucketName: string, fileName: string, allVersions: boolean): Promise<ResultObject>;
    abstract listBuckets(): Promise<ResultObjectBuckets>;
    abstract createBucket(name: string, options?: Options): Promise<ResultObject>;
    clearBucket(name?: string): Promise<ResultObject>;
    deleteBucket(name?: string): Promise<ResultObject>;
    bucketExists(name?: string): Promise<ResultObjectBoolean>;
    listFiles(bucketName: string, numFiles?: number): Promise<ResultObjectFiles>;
    listFiles(numFiles?: number): Promise<ResultObjectFiles>;
    addFile(params: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    getFileAsStream(bucketName: string, fileName: string, options?: StreamOptions): Promise<ResultObjectStream>;
    getFileAsStream(fileName: string, options?: StreamOptions): Promise<ResultObjectStream>;
    getFileAsURL(bucketName: string, fileName: string, options?: Options): Promise<ResultObject>;
    getFileAsURL(fileName: string, options?: Options): Promise<ResultObject>;
    sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    sizeOf(fileName: string): Promise<ResultObjectNumber>;
    fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    fileExists(fileName: string): Promise<ResultObjectBoolean>;
    removeFile(bucketName: string, fileName: string, allVersions?: boolean): Promise<ResultObject>;
    removeFile(fileName: string, allVersions?: boolean): Promise<ResultObject>;
}
