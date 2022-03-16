'use strict';
async function loadAdditionalHljsScript() {
    const list = mw.config.get('hljsAdditionalLanguages');
    if (list && list.length) {
        const loadScript = async (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.onload = () => resolve();
                script.src = url;
                document.body.appendChild(script);
            });
        };
        const url = mw.config.get('hljsAdditionalLanguageScript');
        await Promise.all(
            [...new Set(list)].map((lang) => loadScript(url.replace('*', lang)))
        );
    }
}

async function highlightPre() {
    if (
        mw.config.get('wgHljsEnableForScribunto') &&
        mw.config.get('wgPageContentModel') === 'Scribunto'
    ) {
        $('.mw-parser-output>pre.mw-code.mw-script:last').addClass([
            'hljs',
            'line',
            'language-lua',
        ]);
    }

    $('pre.hljsw-pre').each(function (i, v) {
        const pre = $(v);
        pre.html(pre.html().replace(/^\n+/, '').trimEnd());

        const wrapper = $('<div>').addClass('hljsw-wrapper');
        const header = $('<div>').addClass('hljsw-header').hide();
        const content = $('<div>').addClass('hljsw-content');
        pre.before(wrapper);
        wrapper.append(header);
        wrapper.append(content);
        pre.appendTo(content);

        if (pre.data('style')) {
            pre.attr('style', pre.attr('style') + pre.data('style'));
            pre.removeAttr('data-style');
        }

        if (pre.data('wrapper-style')) {
            wrapper.attr('style', pre.data('wrapper-style'));
            pre.removeAttr('data-wrapper-style');
        }

        if (pre.hasClass('copyable')) {
            header.show();
            const copySourceId = Math.random().toString(36).slice(-6);
            pre.after(
                $('<pre>')
                    .attr('id', 'hljsw-copysource-' + copySourceId)
                    .html(pre.html())
                    .hide()
            );
            header.append(
                $('<div>')
                    .attr('data-copysource', copySourceId)
                    .addClass('hljsw-copybutton')
                    .append(
                        '<i class="far fa-copy fa-fw"></i> ' +
                            '<i class="fas fa-check fa-fw copied-icon"></i> ' +
                            mw.message('hljs-copy').text()
                    )
                    .on('click', function () {
                        const e = $(this);
                        if (e.hasClass('clicked')) return;
                        e.addClass('clicked');
                        navigator.clipboard.writeText(
                            $(
                                '#hljsw-copysource-' + e.attr('data-copysource')
                            ).text()
                        );
                        e.children('i:nth-child(1)').toggle();
                        e.children('i:nth-child(2)').toggle();
                        setTimeout(() => {
                            e.children('i:nth-child(1)').fadeToggle();
                            e.children('i:nth-child(2)').toggle();
                            e.removeClass('clicked');
                        }, 2000);
                    })
            );
        }

        if (pre.data('title')) {
            header.show();
            header.prepend(
                $('<div>').addClass('hljsw-title').html(pre.data('title'))
            );
            pre.removeAttr('data-title');
        }

        pre.css('color', '');
        pre.removeClass('loading');
        hljs.highlightElement(pre.get(0));

        if (pre.hasClass('lines')) {
            const rawLineStart = parseInt(pre.data('linestart'));
            const lineStart =
                !isNaN(rawLineStart) && rawLineStart > 0 ? rawLineStart : 1;
            pre.removeAttr('data-linestart');

            const linenos = $('<pre>').addClass('hljsw-linenumber');
            content.prepend(linenos);
            for (
                let i = lineStart,
                    lineCount = pre.text().split('\n').length + lineStart;
                i < lineCount;
                i++
            ) {
                linenos.append($('<div>').addClass(`lineno l-${i}`).text(i));
            }

            pre.html(
                pre
                    .html()
                    .split('\n')
                    .map((line, i) =>
                        $('<div>')
                            .addClass(`line l-${lineStart + i}`)
                            .html(line)
                    )
            );

            if (pre.data('markline')) {
                /** @type string */ const mark = pre.data('markline');
                if (Number(mark)) {
                    content.find(`.l-${mark}`).addClass('marked');
                } else if (/^(\d+,)+\d+$/.test(mark)) {
                    mark.split(',').forEach((n) => {
                        content.find(`.l-${n}`).addClass('marked');
                    });
                } else if (/^\d+-\d+$/.test(mark)) {
                    const _p = mark.split('-').map((l) => parseInt(l));
                    for (let n = _p[0], end = _p[1] + 1; n < end; n++) {
                        content.find(`.l-${n}`).addClass('marked');
                    }
                }
                pre.removeAttr('data-markline');
            }
        }
    });
}

async function highlightCode() {
    $('code.hljsw-code').each((i, e) => hljs.highlightElement(e));
}

(async () => {
    const defer = (callback) => {
        if (typeof hljs == 'undefined') setTimeout(() => defer(callback), 250);
        else callback();
    };

    defer(async () => {
        await loadAdditionalHljsScript();
        Promise.all([highlightPre(), highlightCode()]);
    });
})();
