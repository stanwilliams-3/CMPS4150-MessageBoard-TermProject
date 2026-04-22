import { Subject } from "./Subject.js";
import { createObserver, isObserver } from "./Observer.js";

export const AppEvents = Object.freeze({
  MESSAGE_CREATED: "message:created",
  TOPIC_SUBSCRIBED: "topic:subscribed",
  USER_SIGNED_IN: "user:signedIn",
});

const channels = new Map();

function subjectFor(eventName) {
  let subject = channels.get(eventName);
  if (!subject) {
    subject = new Subject();
    channels.set(eventName, subject);
  }
  return subject;
}

export const appEventBus = {
  subscribe(eventName, listener) {
    const observer = isObserver(listener) ? listener : createObserver(listener);
    return subjectFor(eventName).subscribe(observer);
  },

  publish(eventName, payload) {
    subjectFor(eventName).notify(payload);
  },

  clearChannel(eventName) {
    const subject = channels.get(eventName);
    if (subject) {
      subject.clear();
    }
  },

  clear() {
    channels.clear();
  },
};
