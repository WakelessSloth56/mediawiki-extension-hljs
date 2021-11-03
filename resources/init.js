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
                const pre = $(v);
                const wrapper = $('<div>').addClass('hljsw-wrapper');
                const header = $('<div>').addClass('hljsw-header').hide();
                const content = $('<div>').addClass('hljsw-content');
                pre.before(wrapper);
                wrapper.append(header);
                wrapper.append(content);
                pre.appendTo(content);
                if (pre.hasClass('copy')) {
                    header.show();
                    const id = Math.random().toString(36).slice(-6);
                    pre.after(
                        $('<pre>')
                            .attr('id', 'hljsw-copysource-' + id)
                            .html(pre.html())
                            .hide()
                    );
                    header.append(
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
                if (pre.attr('data-title')) {
                    header.show();
                    header.prepend(
                        $('<div>')
                            .addClass('hljsw-title')
                            .html(pre.attr('data-title'))
                    );
                    pre.removeAttr('data-title');
                }
                hljs.highlightElement(pre.get(0));
                if (pre.hasClass('line')) {
                    const line = $('<pre>').addClass('hljsw-linenumber');
                    for (
                        let i = 0, l = pre.text().split('\n').length;
                        i < l;
                        i++
                    ) {
                        line.append($('<div>').text(i + 1));
                    }
                    content.prepend(line);
                }
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
