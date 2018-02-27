let fs = require('fs');
let pug = require('pug');
let PugPluginCSSModules = require('../lib').default;
let compile = pug.renderFile('demo.pug', {
    pretty: true,
    plugins: [PugPluginCSSModules({
        generateScopedName: '[path][local]-[hash:base64:10]',
        getJSON: (json) => {
            "use strict";

            console.log(`>> json: ${JSON.stringify(json, null, 4)}`);
        }
    })]
});
fs.writeFileSync('demo.html', compile);