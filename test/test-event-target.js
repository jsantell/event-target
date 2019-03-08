const mocha = require('mocha');
const assert = require('chai').assert;
const EventTarget = require('../');

class MyTarget extends EventTarget {}

class CustomEvent {
  constructor(event, { bubbles, cancelable, detail } = {}) {
    this.bubbles = !!bubbles;
    this.cancelable = !!cancelable;
    this.detail = detail || null;
  }
}

describe('EventTarget', () => {
  it('binds events via addEventListener', () => {
    const c = new MyTarget();
    const events = [];
    c.addEventListener('click', ({ value }) => events.push(`${value}-1`));
    c.addEventListener('click', ({ value }) => events.push(`${value}-2`));
    c.addEventListener('scroll', ({ value }) => events.push(value));

    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2']);

    c.dispatchEvent('scroll', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'hello']);
  });

  it('removes events via removeEventListener', () => {
    const c = new MyTarget();
    const events = [];
    const c1 = ({ value }) => events.push(`${value}-1`);
    const c2 = ({ value }) => events.push(`${value}-2`);
    c.addEventListener('click', c1);
    c.addEventListener('click', c2);

    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2']);

    c.removeEventListener('click', c2);
    c.dispatchEvent('click', { value: 'world' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'world-1']);

    c.removeEventListener('click', c1);
    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'world-1']);
  });

  it('fires handlers stored as `on${type}` attributes', () => {
    const c = new MyTarget();
    const events = [];
    const c1 = ({ value }) => events.push(`${value}-1`);
    const c2 = ({ value }) => events.push(`${value}-2`);
    c.addEventListener('click', c1);
    c.onclick = c2;

    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2']);
  });

  it('sets target if using CustomEvent', () => {
    const c = new MyTarget();
    c.addEventListener('foo', e => {
      assert(e.target === c);
    });

    c.addEventListener('bar', e => {
      assert(e.target === undefined);
    });

    c.dispatchEvent('foo', new CustomEvent('foo'));
    c.dispatchEvent('bar', { data: 'bar' });
  });
});
