import { Options, StreamOptions, StorageType } from "./types/general";
import { FileBufferParams, FilePathParams, FileStreamParams } from "./types/add_file_params";
import { ResultObject, ResultObjectBoolean, ResultObjectBuckets, ResultObjectFiles, ResultObjectNumber, ResultObjectStream } from "./types/result";
import { AdapterConfigLocal } from "./types/adapter_local";
import { AbstractAdapter } from "./AbstractAdapter";
export declare class AdapterLocal extends AbstractAdapter {
    protected _type: StorageType;
    protected _config: AdapterConfigLocal;
    protected _configError: string | null;
    constructor(config: AdapterConfigLocal);
    /**
     * @param path
     * creates a directory if it doesn't exist
     */
    private createDirectory;
    private globFiles;
    protected _addFile(params: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    protected _clearBucket(name: string): Promise<ResultObject>;
    protected _deleteBucket(name: string): Promise<ResultObject>;
    protected _listFiles(bucketName: string): Promise<ResultObjectFiles>;
    protected _getFileAsStream(bucketName: string, fileName: string, options: StreamOptions): Promise<ResultObjectStream>;
    protected _getFileAsURL(bucketName: string, fileName: string, options: Options): Promise<ResultObject>;
    protected _removeFile(bucketName: string, fileName: string, allVersions: boolean): Promise<ResultObject>;
    protected _sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    protected _bucketExists(bucketName: string): Promise<ResultObjectBoolean>;
    protected _fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    get config(): AdapterConfigLocal;
    getConfig(): AdapterConfigLocal;
    listBuckets(): Promise<ResultObjectBuckets>;
    createBucket(name: string, options?: Options): Promise<ResultObject>;
}
