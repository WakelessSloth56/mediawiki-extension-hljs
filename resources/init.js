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

        const highlightPre = async () => {
            $('pre.hljs').each(function (i, v) {
                const e = $(v);
                const w = $('<div>').addClass('hljsw-wrapper');
                const h = $('<div>').addClass('hljsw-header').hide();
                w.append(h);
                e.before(w);
                e.appendTo(w);
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
        };
        const highlightCode = async () => {
            $('code.hljs').each((i, e) => hljs.highlightElement(e));
        };

        $('head').append(`<link rel="stylesheet" href="${HLJS_STYLE}">`);
        loadScript(HLJS_SCRIPT, () => {
            Promise.all([highlightPre(), highlightCode()]);
        });
    })();
});
