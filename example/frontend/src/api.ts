import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  MediaFile,
} from '../../backend/src/entities/MediaFile';
import {
  ResResult,
  ResSuccess,
} from '../../common/types';

const baseUrl = '/api/v1';
const baseConfig = () => ({
  baseURL: baseUrl,
  timeout: 10000,
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response.data.message);
  });

const parseResult = <T>(url: string, axiosResponse: AxiosResponse) => {
  const response: ResResult<T> = axiosResponse.data;

  // if (response.error === undefined) {
  //   console.log('no error in response');
  //   throw new Error(`Response for '${url}' does not correspond to standard`);
  // }

  if (response.error) {
    throw new Error(response.message);
  }

  return (response as ResSuccess<T>).data;
};

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => (
  parseResult<T>(url, await axios.get(url, { ...baseConfig(), ...config }))
);

const put = async <T, U>(url: string, data: T, config?: AxiosRequestConfig): Promise<U> => (
  parseResult<U>(url, await axios.put(url, data, { ...baseConfig(), ...config }))
);

const post = async <T, U>(url: string, data: T, config?: AxiosRequestConfig): Promise<U> => {
  return parseResult<U>(url, await axios.post(url, data, { ...baseConfig(), ...config }));
};

const doDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return parseResult<T>(url, await axios.delete(url, { ...baseConfig(), ...config }));
};

export const uploadMediaFiles = (files: FileList, location?: string): Promise<MediaFile> => {
  const data = new FormData();
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    data.append('files', file);
  }
  if (typeof location !== 'undefined') {
    data.append('location', location);
  }
  return post('/media', data, {
    headers: { 'content-type': 'multipart/form-data' },
    timeout: 10000,
  });
};

export const getList = async (bucketName: string) => {
  await axios.get(`/api/v1/media/list${bucketName}`)
    .then(response => response.data)
    .catch((error: string) => { console.log(error); });
};

export const getMediaThumbnailUrl = (mf: MediaFile) => `${baseUrl}/media/thumbnail/png/100/${mf.id}/${mf.path}`;
export const getMediaDownloadUrl = (mf: MediaFile) => `${baseUrl}/media/download/${mf.id}/${mf.path}`;
export const deleteMediaFile = (id: number): Promise<MediaFile[]> => doDelete(`/media/${id}`);
