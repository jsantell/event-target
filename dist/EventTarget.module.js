// EventTarget polyfill
// https://github.com/jsantell/event-target
// npm install @jsantell/event-target

// The MIT License
// 
// Copyright © 2018 Jordan Santell
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const PRIVATE = Symbol('EventTarget');

class EventTarget {
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
        typedListeners.splice(i, 1);
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

export default EventTarget;
