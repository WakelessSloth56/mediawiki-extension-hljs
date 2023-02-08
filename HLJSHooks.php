<?php

class HLJSHooks
{
    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {
        if (in_array('ext.HLJS', $out->getModules())) {
            global $wgHljsScript, $wgHljsStyle;
            $out->addScriptFile($wgHljsScript);
            $out->addStyle($wgHljsStyle);
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
            global $wgHljsEnableForScribunto;
            $parser->getOutput()->addJsConfigVars('wgHljsEnableForScribunto', $wgHljsEnableForScribunto);
            $parser->getOutput()->addModules('ext.HLJS');
        }
    }

    public static function render($input, array $args, Parser $parser, PPFrame $frame)
    {
        $parser->getOutput()->addModules('ext.HLJS');

        $code = htmlspecialchars($parser->getStripState()->unstripNoWiki($input));

        $lang = isset($args['lang']) ? ' language-'.$args['lang'] : '';

        $attr = [];

        $attr['class'] = 'hljs'.$lang;

        if (isset($args['inline'])) {
            $attr['class'] .= ' hljsw-code inline';
            if (isset($args['style'])) {
                $attr['style'] = $args['style'];
            }
            $output = Html::rawElement('code', $attr, $code);
        } else {
            $attr['class'] .= ' hljsw-pre';
            if (isset($args['copyable'])) {
                $attr['class'] .= ' copyable';
            }
            if (isset($args['title'])) {
                $attr['data-title'] = $args['title'];
            }
            if (isset($args['lines'])) {
                $attr['class'] .= ' lines';
            }
            if (isset($args['linestart'])) {
                $attr['data-linestart'] = $args['linestart'];
            }
            if (isset($args['markline'])) {
                $attr['data-markline'] = $args['markline'];
            }
            if (isset($args['style'])) {
                $attr['data-style'] = $args['style'];
            }
            if (isset($args['wrapper-style'])) {
                $attr['data-wrapper-style'] = $args['wrapper-style'];
            }

            $attr['style'] = 'color:#0000;';
            $attr['class'] .= ' loading';

            $marker = $parser::MARKER_PREFIX . '-hljsinner-'. sprintf('%08X', $parser->mMarkerIndex++) . $parser::MARKER_SUFFIX;
            $parser->getStripState()->addNoWiki($marker, $code);

            $output = Html::rawElement('pre', $attr, $marker);
        }

        return $output;
    }

    public static function addAdditionalLanguage(Parser $parser, $lang = '')
    {
        $output = $parser->getOutput();

        $output->addModules('ext.HLJS');

        global $wgHljsAdditionalLanguageScript;
        $output->addJsConfigVars('hljsAdditionalLanguageScript', $wgHljsAdditionalLanguageScript);

        $reflection_output = new ReflectionObject($output);
        $reflection_mJsConfigVars = $reflection_output->getProperty('mJsConfigVars');
        $reflection_mJsConfigVars->setAccessible(true);
        $mJsConfigVars = $reflection_mJsConfigVars->getValue($output);
        if (!isset($mJsConfigVars['hljsAdditionalLanguages'])) {
            $mJsConfigVars['hljsAdditionalLanguages'] = [];
        }
        array_push($mJsConfigVars['hljsAdditionalLanguages'], $lang);
        $reflection_mJsConfigVars->setValue($output, $mJsConfigVars);

        return '';
    }

    private static function enableForScribunto($title)
    {
        global $wgHljsEnableForScribunto;

        return $wgHljsEnableForScribunto && $title !== null && class_exists('MediaWiki\Extension\Scribunto\Scribunto', false) && $title->getNamespace() === NS_MODULE;
    }
}
