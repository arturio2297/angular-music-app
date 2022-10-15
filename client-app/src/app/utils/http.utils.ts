import {HttpParams} from "@angular/common/http";

export type FormDataPart<T> = { name: string, data?: T };

const createFormData = (jsonPart?: FormDataPart<{}>, filePart?: FormDataPart<File>): FormData => {
  const formData = new FormData();
  if (jsonPart && jsonPart.data) {
    formData.append(jsonPart.name, new Blob([JSON.stringify(jsonPart.data)], {
      type: 'application/json'
    }));
  }
  if (filePart && filePart.data) {
    formData.append(filePart.name, filePart.data);
  }
  return formData;
}

const createParams = (x: Record<string, any>): HttpParams => {
  const params = {} as Record<string, any>;
  for (const key in x) {
    if (x[key] === '') continue;
    params[key] = x[key];
  }
  return new HttpParams({ fromObject: {...params} });
}

const HttpUtils = {
  createFormData,
  createParams
}

export default HttpUtils;
