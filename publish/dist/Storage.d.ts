import { IAdapter, AdapterConfig, Options, StreamOptions, StorageAdapterConfig } from "./types/general";
import { FileBufferParams, FilePathParams, FileStreamParams } from "./types/add_file_params";
import { ResultObject, ResultObjectBoolean, ResultObjectBuckets, ResultObjectFiles, ResultObjectNumber, ResultObjectStream } from "./types/result";
export declare class Storage implements IAdapter {
    private _adapter;
    constructor(config: string | StorageAdapterConfig);
    switchAdapter(config: string | StorageAdapterConfig): void;
    setSelectedBucket(bucketName: string | null): void;
    getSelectedBucket(): string | null;
    set(bucketName: string | null): void;
    get bucketName(): string | null;
    get adapter(): IAdapter;
    getAdapter(): IAdapter;
    get type(): string;
    getType(): string;
    get config(): AdapterConfig;
    getConfig(): AdapterConfig;
    get configError(): string;
    getConfigError(): string;
    get serviceClient(): any;
    getServiceClient(): any;
    addFile(paramObject: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    addFileFromPath(params: FilePathParams): Promise<ResultObject>;
    addFileFromBuffer(params: FileBufferParams): Promise<ResultObject>;
    addFileFromStream(params: FileStreamParams): Promise<ResultObject>;
    createBucket(bucketName: string, options?: object): Promise<ResultObject>;
    clearBucket(bucketName?: string): Promise<ResultObject>;
    deleteBucket(bucketName?: string): Promise<ResultObject>;
    listBuckets(): Promise<ResultObjectBuckets>;
    getFileAsStream(bucketName: string, fileName: string, options?: StreamOptions): Promise<ResultObjectStream>;
    getFileAsStream(fileName: string, options?: StreamOptions): Promise<ResultObjectStream>;
    getFileAsURL(bucketName: string, fileName: string, options?: Options): Promise<ResultObject>;
    getFileAsURL(fileName: string, options?: Options): Promise<ResultObject>;
    removeFile(bucketName: string, fileName: string, allVersions?: boolean): Promise<ResultObject>;
    removeFile(fileName: string, allVersions?: boolean): Promise<ResultObject>;
    listFiles(bucketName: string, numFiles?: number): Promise<ResultObjectFiles>;
    listFiles(numFiles?: number): Promise<ResultObjectFiles>;
    sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    sizeOf(fileName: string): Promise<ResultObjectNumber>;
    bucketExists(bucketName?: string): Promise<ResultObjectBoolean>;
    fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    fileExists(fileName: string): Promise<ResultObjectBoolean>;
}