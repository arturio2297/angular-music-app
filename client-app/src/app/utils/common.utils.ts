import {Action, noOp} from "../models/common/common.models";

const debounce =(fn: Action, timeout: number): Action => {
  let id: any;
  console.log(id);
  return () => {
    id && clearTimeout(id);
    id = setTimeout(fn, timeout);
  }
}

const CommonUtils = {
  debounce
}

export default CommonUtils;
