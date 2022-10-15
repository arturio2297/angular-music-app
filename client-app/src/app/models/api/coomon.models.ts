export interface IPageFilterParameters {
  page?: number;
  size?: number;
}

export type SortOrder = 'asc' | 'desc';

export interface IItemsFilterParameters {
  search: string;
}

export interface IPageResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface FileRequest {
  base64: Base64;
  filename: string;
}

export interface ILikeResponse {
  liked: boolean;
  likesCount: number;
}

export type OnFetched<T> = (response: T) => void;
export type OnPageFetched<T> = OnFetched<IPageResponse<T>>;
export type OnLiked = OnFetched<ILikeResponse>;
export type OnSaved = OnFetched<boolean>;
