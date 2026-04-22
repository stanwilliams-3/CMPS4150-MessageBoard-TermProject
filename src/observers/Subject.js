import { isObserver } from "./Observer.js";

export class Subject {
  constructor() {
    this._observers = new Set();
  }

  subscribe(observer) {
    if (!isObserver(observer)) {
      throw new TypeError("Subject.subscribe expects an object with an update() method.");
    }
    this._observers.add(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer) {
    this._observers.delete(observer);
  }

  notify(payload) {
    for (const observer of this._observers) {
      observer.update(payload);
    }
  }

  clear() {
    this._observers.clear();
  }
}
