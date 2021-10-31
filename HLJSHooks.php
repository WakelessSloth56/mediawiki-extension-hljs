<?php

class HLJSHooks
{
    public static function onParserFirstCallInit(Parser $parser)
    {
        $parser->setHook('hljs', __CLASS__.'::render');
    }

    public static function render($input, array $args, Parser $parser, PPFrame $frame)
    {
        $parser->getOutput()->addModules('ext.HLJS');

        $code = htmlspecialchars(trim($input));

        $lang = isset($args['lang']) ? ' language-'.$args['lang'] : '';
        $inline = isset($args['inline']);
        $class = isset($args['class']) ? ' '.$args['class'] : '';

        $htmlAttribs = [];

        $htmlAttribs['class'] = 'hljs'.$lang.$class;

        if (isset($args['style'])) {
            $htmlAttribs['style'] = $args['style'];
        }

        if ($inline) {
            $htmlAttribs['style'] .= 'display: inline;';
            $output = Html::rawElement('code', $htmlAttribs, $code);
        } else {
            $output = Html::rawElement('pre', $htmlAttribs, $code);
        }

        return $output;
    }
}
