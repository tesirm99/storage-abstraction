import * as Minio from "minio";
import { AbstractAdapter } from "./AbstractAdapter";
import { Options, StreamOptions, StorageType } from "./types/general";
import { FileBufferParams, FilePathParams, FileStreamParams } from "./types/add_file_params";
import { ResultObject, ResultObjectBoolean, ResultObjectBuckets, ResultObjectFiles, ResultObjectNumber, ResultObjectStream } from "./types/result";
import { AdapterConfigMinio } from "./types/adapter_minio";
export declare class AdapterMinio extends AbstractAdapter {
    protected _type: StorageType;
    protected _client: Minio.Client;
    protected _configError: string | null;
    protected _config: AdapterConfigMinio;
    constructor(config: string | AdapterConfigMinio);
    protected _getFileAsStream(bucketName: string, fileName: string, options: StreamOptions): Promise<ResultObjectStream>;
    protected _removeFile(bucketName: string, fileName: string, allVersions: boolean): Promise<ResultObject>;
    protected _clearBucket(name: string): Promise<ResultObject>;
    protected _deleteBucket(name: string): Promise<ResultObject>;
    protected _addFile(params: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    protected _getFileAsURL(bucketName: string, fileName: string, options: Options): Promise<ResultObject>;
    protected _listFiles(bucketName: string, numFiles: number): Promise<ResultObjectFiles>;
    protected _sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    protected _bucketExists(bucketName: string): Promise<ResultObjectBoolean>;
    protected _fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    get config(): AdapterConfigMinio;
    getConfig(): AdapterConfigMinio;
    get serviceClient(): Minio.Client;
    getServiceClient(): Minio.Client;
    listBuckets(): Promise<ResultObjectBuckets>;
    createBucket(name: string, options?: Options): Promise<ResultObject>;
}
