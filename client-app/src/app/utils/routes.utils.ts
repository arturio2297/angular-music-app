import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

const subscribeToParams = <T extends {}>(route: ActivatedRoute, onSubscribe: (params: T) => void, isQuery = false): Subscription => {
  const map = isQuery ? route.queryParamMap : route.paramMap;
  return map.subscribe(x => {
    const keys = x.keys;
    const params = {} as Record<string, string>;
    for (const i in keys) {
      const key = keys[i];
      const value = x.get(keys[i]);
      value && (params[key] = value);
    }
    onSubscribe(params as T);
  });
}

const RoutesUtils = {
  subscribeToParams
}

export default RoutesUtils;
