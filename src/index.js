import walk from "pug-walk";
import extend from "extend-shallow";
import CSSModulesSync from "postcss-modules-sync";
import postcss from "postcss";

export default function (cssModulesOptions) {
    cssModulesOptions = cssModulesOptions || {};
    const getJSONCallback = cssModulesOptions.getJSON;
    return {
        postFilters(ast, options) {
            const styles = {};

            walk(ast, function (node) {
                if (node.type == "Tag") {
                    if (node.name == "style") {
                        node.block.nodes
                            .filter(styleNode => styleNode.filename != undefined)
                            .map((styleNode) => {
                                const localOptions = extend(cssModulesOptions, {
                                    getJSON: (json) => {
                                        styles[styleNode.filename] = extend(styles[styleNode.filename] || {}, json);
                                        getJSONCallback && getJSONCallback(json);
                                    }
                                });

                                const css = postcss([CSSModulesSync(localOptions)])
                                    .process(styleNode.val, {
                                        from: styleNode.filename,
                                    }).css;

                                styleNode.val = css;
                            });
                    } else {
                        node.attrs
                            .filter(attrNode => attrNode.name == "class")
                            .map((attrNode) => {
                                let cls = attrNode.val.replace(/"|'/g, "");
                                if (styles[node.filename] && styles[node.filename][cls]) {
                                    attrNode.val = `'${styles[node.filename][cls]}'`;
                                }
                            });
                    }
                }

            }, {includeDependencies: true});
            return ast;
        }
    };
};