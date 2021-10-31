<?php

class HLJSHooks
{
    public static function onParserFirstCallInit(Parser $parser)
    {
        $parser->setHook('syntaxhighlight', __CLASS__.'::render');
    }

    public static function render($input, array $args, Parser $parser, PPFrame $frame)
    {
        $parser->getOutput()->addModules('ext.HLJS');

        $code = htmlspecialchars(trim($input));

        $inline = isset($param['inline']);

        $htmlAttribs = [
            'class' => 'hljs'
        ];

        if ($inline) {
            $htmlAttribs['style'] = 'display: inline;';
            $output = Html::rawElement('code', $htmlAttribs, $code);
        } else {
            $output = Html::rawElement('pre', $htmlAttribs, $code);
        }

        return $output;
    }
}
