import {Subscription} from "rxjs";

const subscribe = (subscriptionsState: Subscription[], ...subscriptions: Subscription[]): void => {
  for (let i = 0; i < subscriptions.length; i++) {
    const s = subscriptions[i];
    !subscriptionsState.includes(s) && subscriptionsState.push(s);
  }
}

const unsubscribe = (subscriptions: Subscription[]): void => {
  subscriptions.forEach(x => x && x.unsubscribe());
}

const SubscriptionsUtils = {
  subscribe,
  unsubscribe
}

export default SubscriptionsUtils;
