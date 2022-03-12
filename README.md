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

### 功能

相较于原 Highlightjs Integration 扩展：

* 支持使用在公共 CDN 托管的 HLJS 脚本和样式表。
* 支持加载附加语言支持。
* 支持为代码块启用复制按钮。
* 支持为代码块添加标题。
* 支持为代码块启用行号显示。
* 支持代码块行号显示的起始行号。

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

### 更多

配置、高级使用和示例参见 AHWiki 中的帮助页面（<https://wiki.auioc.com/view/Help:HLJS_Integration>）。

## 维护者

* [@WakelessSloth56](https://github.com/WakelessSloth56)

## 感谢

* Highlightjs Integration ([GitHub](https://github.com/Nicolas01/Highlightjs_Integration/) / [MediaWiki](https://www.mediawiki.org/wiki/Extension:Highlightjs_Integration))
  * 这是此扩展最初开发的思路来源。
  * 在此基础上，我们添加了更多的功能。
* [AHWiki](https://wiki.auioc.com) (AUIOC)
  * 此扩展已在 AHWiki 中安装并使用。

## 许可证

HLJS Integration 采用 **GNU Affero General Public License v3.0** 授权。
完整许可文件参见 [LICENSE](/LICENSE)。
