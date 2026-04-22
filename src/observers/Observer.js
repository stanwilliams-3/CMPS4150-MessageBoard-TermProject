export function isObserver(value) {
  return Boolean(value) && typeof value.update === "function";
}

export function createObserver(fn) {
  return {
    update(payload) {
      fn(payload);
    },
  };
}
