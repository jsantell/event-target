const PRIVATE = Symbol('EventTarget');

export default class EventTarget {
  constructor() {
    this[PRIVATE] = {
      listeners: new Map(),
    };
  }

  /**
   * @param {string} type
   * @param {Function} listener
   */
  addEventListener(type, listener) {
    if (typeof type !== 'string') { throw new Error('`type` must be a string'); }
    if (typeof listener !== 'function') { throw new Error('`listener` must be a function'); }

    const typedListeners = this[PRIVATE].listeners.get(type) || [];
    typedListeners.push(listener);
    this[PRIVATE].listeners.set(type, typedListeners);
  }

  /**
   * @param {string} type
   * @param {Function} listener
   */
  removeEventListener(type, listener) {
    if (typeof type !== 'string') { throw new Error('`type` must be a string'); }
    if (typeof listener !== 'function') { throw new Error('`listener` must be a function'); }

    const typedListeners = this[PRIVATE].listeners.get(type) || [];

    for (let i = typedListeners.length; i >= 0; i--) {
      if (typedListeners[i] === listener) {
        typedListeners.pop();
      }
    }
  }

  /**
   * @param {string} type
   * @param {object} event
   */
  dispatchEvent(type, event) {
    const typedListeners = this[PRIVATE].listeners.get(type) || [];

    if (('target' in event) || ('detail' in event)) {
      event.target = this;
    }

    // Copy over all the listeners because a callback could remove
    // an event listener, preventing all listeners from firing when
    // the event was first dispatched.
    const queue = [];
    for (let i = 0; i < typedListeners.length; i++) {
      queue[i] = typedListeners[i];
    }

    for (let listener of queue) {
      listener(event);
    }

    // Also fire if this EventTarget has an `on${EVENT_TYPE}` property
    // that's a function
    if (typeof this[`on${type}`] === 'function') {
      this[`on${type}`](event);
    }
  }
}
