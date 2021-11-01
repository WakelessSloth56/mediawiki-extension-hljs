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

        $('head').append(`<link rel="stylesheet" href="${HLJS_STYLE}">`);
        loadScript(HLJS_SCRIPT, () => {
            $('pre.hljs,code.hljs,pre.mw-code').each(function (i, v) {
                const e = $(v);
                const h = $('<div>').addClass('hljsw-header').hide();
                e.before(h);
                if (e.hasClass('copyable')) {
                    h.show();
                    const id = Math.random().toString(36).slice(-6);
                    e.after(
                        $('<pre>')
                            .attr('id', 'hljsw-copysource-' + id)
                            .html(e.html())
                            .hide()
                    );
                    h.append(
                        $('<div>')
                            .attr('data-copysource', id)
                            .addClass('hljsw-copybutton')
                            .html(' 复制')
                            .prepend('<i class="far fa-copy"></i>')
                            .on('click', function () {
                                navigator.clipboard.writeText(
                                    $(
                                        '#hljsw-copysource-' +
                                            $(this).attr('data-copysource')
                                    ).text()
                                );
                            })
                    );
                }
                if (e.attr('data-title')) {
                    h.show();
                    h.prepend(
                        $('<div>')
                            .addClass('hljsw-title')
                            .html(e.attr('data-title'))
                    );
                    e.removeAttr('data-title');
                }
                hljs.highlightElement(e.get(0));
            });
        });
    })();
});
