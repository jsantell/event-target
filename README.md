# event-target

[![Build Status](http://img.shields.io/npm/v/@jsantell/event-target.svg?style=flat-square)](https://www.npmjs.org/package/@jsantell/event-target)

Simple implementation of [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget). Hosted on [npm](https://npmjs.org) as [@jsantell/event-target](https://www.npmjs.org/package/@jsantell/event-target). ES6-ified for inclusion via module bundler.

## Installation

`$ npm install --save @jsantell/event-target`

## Usage

```js
import EventTarget from '@jsantell/event-target';

class ChunkReader extends EventTarget {
  constructor(data) {
    this.data = data;

    requestAnimationFrame(() => this.read(data));
  }

  read() {
    for (let i = 0; i < this.data.length; i += 4) {
      this.dispatchEvent('chunk', this.data.substr(i, 4));
    }
    this.dispatchEvent('end');
  }
}

const reader = new ChunkReader('hello world!');
reader.addEventListener('chunk', c => console.log('chunk!'));
reader.addEventListener('end', () => console.log('end!'));
```

## Build

`$ npm run build`

## Publish

`$ npm run version`

## License

MIT License, Copyright © 2018 Jordan Santell
