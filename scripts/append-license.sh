#!/bin/sh

# Appends license/repo info to the built files.

mv dist/EventTarget.js dist/_EventTarget.js
mv dist/EventTarget.module.js dist/_EventTarget.module.js

echo "// EventTarget polyfill" > dist/EventTarget.js
echo "// https://github.com/jsantell/event-target" >> dist/EventTarget.js
echo "// npm install @jsantell/event-target" >> dist/EventTarget.js
echo "" >> dist/EventTarget.js
sed -e 's/^/\/\/ /' LICENSE >> dist/EventTarget.js
echo "" >> dist/EventTarget.js

cp dist/EventTarget.js dist/EventTarget.module.js
cat dist/_EventTarget.js >> dist/EventTarget.js
cat dist/_EventTarget.module.js >> dist/EventTarget.module.js

rm dist/_EventTarget.js
rm dist/_EventTarget.module.js
