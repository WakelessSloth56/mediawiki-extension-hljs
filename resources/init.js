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

        const HLJS_SCRIPT = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.3.1/highlight.min.js';
        const HLJS_STYLE = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/styles/vs2015.min.css';

        loadScript(HLJS_SCRIPT, () => {
            $('head').append(`<link rel="stylesheet" href="${HLJS_STYLE}">`);
            $('pre.hljs,code.hljs,pre.mw-code').each(function (index, element) {
                hljs.highlightBlock(element);
            });
        });
    })();
});
