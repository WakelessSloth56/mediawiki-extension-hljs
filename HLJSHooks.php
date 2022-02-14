<?php

class HLJSHooks
{
    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {
        if (in_array('ext.HLJS', $out->getModules())) {
            global $wgHljsScript, $wgHljsStyle;
            $out->addScriptFile($wgHljsScript);
            $out->addStyle($wgHljsStyle);

            $jsConfigVars = $out->getJsConfigVars();
            if (isset($jsConfigVars['hljsAdditionalLanguages'])) {
                global $wgHljsAdditionalLanguageScript;
                $languages = $jsConfigVars['hljsAdditionalLanguages'];
                foreach ($languages as $name) {
                    $out->addScriptFile(str_replace('*', $name, $wgHljsAdditionalLanguageScript));
                }
            }
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
        $parser->setFunctionHook('hljs-additional-language', __CLASS__.'::addAdditionalLanguage');
    }

    public static function onParserBeforeInternalParse(Parser $parser, &$text, $strip_state)
    {
        if (HLJSHooks::enableForScribunto($parser->getTitle()) && !in_array('ext.HLJS', $parser->getOutput()->getModules())) {
            global $wgOut, $wgHljsEnableForScribunto;
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

    public static function addAdditionalLanguage(Parser $parser, $lang = '')
    {
        $output = $parser->getOutput();

        $output->addModules('ext.HLJS');

        if (!isset($output->mJsConfigVars['hljsAdditionalLanguages'])) {
            $output->mJsConfigVars['hljsAdditionalLanguages'] = [];
        }
        if (!in_array($lang, $output->mJsConfigVars['hljsAdditionalLanguages'])) {
            array_push($output->mJsConfigVars['hljsAdditionalLanguages'], $lang);
        }

        return '';
    }

    private static function enableForScribunto($title)
    {
        global $wgHljsEnableForScribunto;

        return $wgHljsEnableForScribunto && $title !== null && class_exists(Scribunto::class) && $title->getNamespace() === NS_MODULE;
    }
}
