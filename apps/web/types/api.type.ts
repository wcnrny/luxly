type BaseFetchOptions = {
  method: string;
  body?: BodyInit;
  headers?: HeadersInit;
};

type WithPath = BaseFetchOptions & {
  path: string;
  url?: never;
};

type WithUrl = BaseFetchOptions & {
  url: string;
  path?: never;
};

export type FetchOptions = WithPath | WithUrl;

export type PresignResponse = {
  uploadUrl: string;
  fileKey: string;
};
