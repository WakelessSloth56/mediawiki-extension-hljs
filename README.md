<h1 align="center">HLJS Integration</h1>

<div align="center">

MediaWiki 代码语法高亮扩展。

[![GitHub license](https://img.shields.io/github/license/WakelessSloth56/mediawiki-extension-hljs?style=flat-square)](/LICENSE)
&nbsp;
[![MediaWiki](https://img.shields.io/static/v1?label=MediaWiki&message=>=1.25&color=00aa00&style=flat-square)](https://www.mediawiki.org/)
[![HLJS](https://img.shields.io/static/v1?label=highlight.js&message=latest&color=600000&style=flat-square)](https://highlightjs.org/)

</div>

## 简介

HLJS Integration 扩展使用 [highlight.js](https://highlightjs.org/) 库来进行代码语法高亮。

## 安装

1. 下载文件并放置在 `extensions/` 目录下名为 `HLJS` 的文件夹中。
2. 在 `LocalSettings.php` 的底部添加以下代码：

    ```php
    wfLoadExtension ('HLJS');
    ```

3. 查看 `Special:Version` 页面验证是否安装成功。

## 使用方法

使用 `hljs` 标签，例如：

```wikitext
<hljs>
<?php echo 'Hello, world!'; ?>
</hljs>
```

注：为了防止与 MediaWiki 中默认的 [SyntaxHighlight](https://www.mediawiki.org/wiki/Extension:SyntaxHighlight) 发生冲突，自 [6f22929](https://github.com/WakelessSloth56/mediawiki-extension-hljs/commit/6f22929c16cff3ca76bbbc084e59e97b4055d224) 起改用 `hljs` 标签。

### 更多

高级使用和示例参见 AHWiki 中的帮助页面（<https://wiki.auioc.com/view/Help:HLJS_Integration>）。

## 配置

```php
// LocalSettings.php

// 指定 HLJS 脚本的样式表的 URL, 默认使用在 jsDelivr 中托管的最新版本。
$wgHljsScriptURL = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets/highlight.min.js';
$wgHljsStyleURL = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/vs.min.css';
```

## 维护者

* [@WakelessSloth56](https://github.com/WakelessSloth56)

## 感谢

* Highlightjs Integration ([GitHub](https://github.com/Nicolas01/Highlightjs_Integration/) / [MediaWiki](https://www.mediawiki.org/wiki/Extension:Highlightjs_Integration))
  * 这是此扩展最初开发的思路来源。
  * 在此基础上，我们加入了可以使用在公共 CDN 托管的 HLJS 脚本和样式表的功能，这可以在某些情况下减轻网站主站的带宽/流量消耗。
* [AHWiki](https://wiki.auioc.com) (AUIOC)
  * 此扩展已在 AHWiki 中安装并使用。

## 许可证

HLJS Integration 采用 **GNU Affero General Public License v3.0** 授权。
完整许可文件参见 [LICENSE](/LICENSE)。
