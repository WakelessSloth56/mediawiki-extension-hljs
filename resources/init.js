mw.hook('wikipage.categories').add(() => {
    (async () => {
        'use strict';

        const loadScript = (url, callback) => {
            var script = document.createElement('script');
            script.onload = function () {
                callback();
            };
            script.src = url;
            document.head.appendChild(script);
        };

        const HLJS_SCRIPT = mw.config.get('wgHljsScriptURL');
        const HLJS_STYLE = mw.config.get('wgHljsStyleURL');

        loadScript(HLJS_SCRIPT, () => {
            $('head').append(`<link rel="stylesheet" href="${HLJS_STYLE}">`);
            $('pre.hljs,code.hljs,pre.mw-code').each(function (index, element) {
                hljs.highlightBlock(element);
            });
        });
    })();
});
