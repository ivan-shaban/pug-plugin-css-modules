# pug-plugin-css-modules
A [Pug] plugin to use [CSS Modules].

[Pug]:          https://github.com/pugjs
[CSS Modules]:  https://github.com/css-modules/css-modules

## Usage
#### Templates
```jade
style
    include:scss ./styles-pug.scss

span
    span.base
        span.background
```
Code above will be processed into:
```html
    <span>
        <span class="base_1591y_1">
            <span class="background_1591y_1"></span>
```

Firstly it will search css-classes into in local template, then into global map, if nothing matches css-class will be handled as global one.

#### Configuration
You can pass all the same options that available for [CSS Modules] into plugin, example:

```js
let PugPluginCSSModules = require('pug-plugin-css-modules').default;
let compile = pug.renderFile(`path-to-pug-template`, {
    pretty: true,
    plugins: [PugPluginCSSModules({
        generateScopedName: '[path][local]-[hash:base64:10]',
        getJSON: (json) => {
            "use strict";

            console.log(`>> json: ${JSON.stringify(json, null, 4)}`);
        }
    })]
});
fs.writeFileSync(`path-to-output-file`, compile);
```

#### Notes
Plugin applies after filters so you feel free to use any css-preprocessors (like scss, less).
