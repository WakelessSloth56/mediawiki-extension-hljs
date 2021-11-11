<?php

class HLJSHooks
{
    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {
        if (in_array('ext.HLJS', $out->getModules())) {
            global $wgHljsScriptURL,$wgHljsStyleURL;
            $out->addScriptFile($wgHljsScriptURL);
            $out->addStyle($wgHljsStyleURL);
        }

        return true;
    }

    public static function onParserFirstCallInit(Parser $parser)
    {
        global $wgHljsSyntaxhighlightTag;
        if ($wgHljsSyntaxhighlightTag) {
            $parser->setHook('syntaxhighlight', __CLASS__.'::render');
            $parser->setHook('source', __CLASS__.'::render');
        }
        $parser->setHook('hljs', __CLASS__.'::render');
    }

    public static function onParserBeforeInternalParse(Parser $parser, &$text, $strip_state)
    {
        if (HLJSHooks::enableForScribunto($parser->getTitle()) && !in_array('ext.HLJS', $parser->getOutput()->getModules())) {
            global $wgOut,$wgHljsEnableForScribunto;
            $wgOut->addJsConfigVars('wgHljsEnableForScribunto', $wgHljsEnableForScribunto);
            $parser->getOutput()->addModules('ext.HLJS');
        }
    }

    public static function render($input, array $args, Parser $parser, PPFrame $frame)
    {
        $parser->getOutput()->addModules('ext.HLJS');

        $code = htmlspecialchars($parser->getStripState()->unstripNoWiki($input));

        $lang = isset($args['lang']) ? ' language-'.$args['lang'] : '';

        $htmlAttribs = [];

        $htmlAttribs['class'] = 'hljs'.$lang;

        if (isset($args['style'])) {
            $htmlAttribs['style'] = $args['style'];
        }

        if (isset($args['inline'])) {
            $htmlAttribs['class'] .= ' inline';
            $output = Html::rawElement('code', $htmlAttribs, $code);
        } else {
            if (isset($args['copy'])) {
                $htmlAttribs['class'] .= ' copy';
            }
            if (isset($args['title'])) {
                $htmlAttribs['data-title'] = $args['title'];
            }
            if (isset($args['line'])) {
                $htmlAttribs['class'] .= ' line';
            }
            if (isset($args['linestart'])) {
                $htmlAttribs['data-linestart'] = $args['linestart'];
            }
            if (isset($args['wrapper-style'])) {
                $htmlAttribs['data-wrapper-style'] = $args['wrapper-style'];
            }
            $marker = $parser::MARKER_PREFIX . '-hljsinner-'. sprintf('%08X', $parser->mMarkerIndex++) . $parser::MARKER_SUFFIX;
            $parser->getStripState()->addNoWiki($marker, $code);
            $output = Html::rawElement('pre', $htmlAttribs, $marker);
        }

        return $output;
    }

    private static function enableForScribunto($title)
    {
        global $wgHljsEnableForScribunto;

        return $wgHljsEnableForScribunto && $title !== null && class_exists(Scribunto::class) && $title->getNamespace() === NS_MODULE;
    }
}
