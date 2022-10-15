import {RootStore} from "../stores/root.store";
import {APP_INITIALIZER, Provider} from "@angular/core";

const initStoresFactory = (store: RootStore) => {
  return () => store.init();
}

const STORES_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initStoresFactory,
  deps: [RootStore],
  multi: true
}

const APP_PROVIDERS: Provider[] =
  [
    STORES_PROVIDER
  ];

export default APP_PROVIDERS;
