<?php

if (function_exists('wfLoadExtension')) {
    wfLoadExtension('HLJS');

    return true;
}
die('This version of the MCView extension requires MediaWiki 1.25+');
