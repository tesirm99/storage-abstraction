import { Storage as GoogleCloudStorage } from "@google-cloud/storage";
import { AbstractAdapter } from "./AbstractAdapter";
import { Options, StreamOptions, StorageType } from "./types/general";
import { FileBufferParams, FilePathParams, FileStreamParams } from "./types/add_file_params";
import { ResultObject, ResultObjectBoolean, ResultObjectBuckets, ResultObjectFiles, ResultObjectNumber, ResultObjectStream } from "./types/result";
import { AdapterConfigGoogleCloud } from "./types/adapter_google_cloud";
export declare class AdapterGoogleCloud extends AbstractAdapter {
    protected _type: StorageType;
    protected _config: AdapterConfigGoogleCloud;
    protected _configError: string | null;
    protected _client: GoogleCloudStorage;
    constructor(config?: string | AdapterConfigGoogleCloud);
    protected _getFileAsURL(bucketName: string, fileName: string, options?: Options): Promise<ResultObject>;
    protected _getFileAsStream(bucketName: string, fileName: string, options: StreamOptions): Promise<ResultObjectStream>;
    protected _removeFile(bucketName: string, fileName: string, allVersions: boolean): Promise<ResultObject>;
    protected _addFile(params: FilePathParams | FileBufferParams | FileStreamParams): Promise<ResultObject>;
    protected _listFiles(bucketName: string, numFiles: number): Promise<ResultObjectFiles>;
    protected _sizeOf(bucketName: string, fileName: string): Promise<ResultObjectNumber>;
    protected _bucketExists(name: string): Promise<ResultObjectBoolean>;
    protected _fileExists(bucketName: string, fileName: string): Promise<ResultObjectBoolean>;
    protected _deleteBucket(name: string): Promise<ResultObject>;
    protected _clearBucket(name: string): Promise<ResultObject>;
    get config(): AdapterConfigGoogleCloud;
    getConfig(): AdapterConfigGoogleCloud;
    get serviceClient(): GoogleCloudStorage;
    getServiceClient(): GoogleCloudStorage;
    listBuckets(): Promise<ResultObjectBuckets>;
    createBucket(name: string, options?: Options): Promise<ResultObject>;
}
