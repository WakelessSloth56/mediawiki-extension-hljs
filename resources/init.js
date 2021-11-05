mw.hook('wikipage.categories').add(() => {
    (async () => {
        'use strict';

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
                            .append('<i class="far fa-copy fa-fw"></i>')
                            .append('<i class="fas fa-check fa-fw hljsw-copied-icon" style="display:none"></i>')
                            .append(' 复制')
                            .on('click', function () {
                                const e = $(this);
                                if (e.hasClass('clicked')) return;
                                e.addClass('clicked');
                                navigator.clipboard.writeText(
                                    $('#hljsw-copysource-' + e.attr('data-copysource')).text()
                                );
                                e.children('i:nth-child(1)').toggle();
                                e.children('i:nth-child(2)').toggle();
                                setTimeout(() => {
                                    e.children('i:nth-child(1)').fadeToggle('slow');
                                    e.children('i:nth-child(2)').toggle();
                                    e.removeClass('clicked');
                                }, 2000);
                            })
                    );
                }
                if (pre.attr('data-title')) {
                    header.show();
                    header.prepend($('<div>').addClass('hljsw-title').html(pre.attr('data-title')));
                    pre.removeAttr('data-title');
                }
                hljs.highlightElement(pre.get(0));
                if (pre.hasClass('line')) {
                    const line = $('<pre>').addClass('hljsw-linenumber');
                    content.prepend(line);
                    const rawLineStart = parseInt(pre.attr('data-linestart'));
                    const lineStart = !isNaN(rawLineStart) && rawLineStart > 0 ? rawLineStart : 1;
                    for (let i = lineStart, l = pre.text().split('\n').length + lineStart; i < l; i++) {
                        line.append(
                            $('<div>')
                                .addClass('line-' + i)
                                .text(i)
                        );
                    }
                    pre.removeAttr('data-linestart');
                }
            });
        };

        const highlightCode = async () => {
            $('code.hljs').each((i, e) => hljs.highlightElement(e));
        };

        Promise.all([highlightPre(), highlightCode()]);
    })();
});
