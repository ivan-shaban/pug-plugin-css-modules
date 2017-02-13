"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cssModulesOptions) {
    cssModulesOptions = cssModulesOptions || {};
    var getJSONCallback = cssModulesOptions.getJSON;
    return {
        postFilters: function postFilters(ast, options) {
            var styles = {};

            (0, _pugWalk2.default)(ast, function (node) {
                if (node.type == "Tag") {
                    if (node.name == "style") {
                        node.block.nodes.filter(function (styleNode) {
                            return styleNode.filename != undefined;
                        }).map(function (styleNode) {
                            var localOptions = (0, _extendShallow2.default)(cssModulesOptions, {
                                getJSON: function getJSON(json) {
                                    styles[styleNode.filename] = (0, _extendShallow2.default)(styles[styleNode.filename] || {}, json);
                                    getJSONCallback && getJSONCallback(json);
                                }
                            });

                            var css = (0, _postcss2.default)([(0, _postcssModulesSync2.default)(localOptions)]).process(styleNode.val, {
                                from: styleNode.filename
                            }).css;

                            styleNode.val = css;
                        });
                    } else {
                        node.attrs.filter(function (attrNode) {
                            return attrNode.name == "class";
                        }).map(function (attrNode) {
                            var cls = attrNode.val.replace(/"|'/g, "");
                            if (styles[node.filename] && styles[node.filename][cls]) {
                                attrNode.val = "'" + styles[node.filename][cls] + "'";
                            }
                        });
                    }
                }
            }, { includeDependencies: true });
            return ast;
        }
    };
};

var _pugWalk = require("pug-walk");

var _pugWalk2 = _interopRequireDefault(_pugWalk);

var _extendShallow = require("extend-shallow");

var _extendShallow2 = _interopRequireDefault(_extendShallow);

var _postcssModulesSync = require("postcss-modules-sync");

var _postcssModulesSync2 = _interopRequireDefault(_postcssModulesSync);

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;