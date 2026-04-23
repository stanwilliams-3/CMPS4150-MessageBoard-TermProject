import { appEventBus, AppEvents } from "./AppEventBus.js";

export function registerAppObservers() {
  appEventBus.subscribe(AppEvents.USER_SIGNED_IN, (payload) => {
    console.log("[Observer] USER_SIGNED_IN", payload);
  });

  appEventBus.subscribe(AppEvents.TOPIC_SUBSCRIBED, (payload) => {
    console.log("[Observer] TOPIC_SUBSCRIBED", payload);
  });

  appEventBus.subscribe(AppEvents.MESSAGE_CREATED, (payload) => {
    console.log("[Observer] MESSAGE_CREATED", payload);
  });
}
