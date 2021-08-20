# BS ダウンロードファイル名変更 / BS download filename changer

**2021/08/20 beatsaver.com が標準で「id (曲名 - mapper名).zip」という名前でDLできるようになったようなので、この拡張機能をインストールする必要はなくなりました。そのうち非公開に変更します。**

<br>
<br>

## 概要 / Overview
beatsaver ダウンロードアイコンクリック時、idと曲名を組み合わせたファイル名でダウンロードを行うように変更する Chrome 拡張機能です。  

This is a Chrome extension that changes the download file name to a combination of id and song title instead of a hash value in beatsaver.com.

## 注意事項 / ATTENTION
- 作者はこのツールを使用したことにより何が起きても責任は持ちません。自己責任でお願いします。  
  それに同意できない場合は使用しないでください。
- beatsaver.com の仕様変更により動かなくなる可能性があります。その場合は下記記載の手順でアンインストールしてください。  
  ※動作確認は 2021/08/06時点の beatsaver.com で実施
- 作りは少々適当です。誰かがもっと完璧なものを作ってくれる気がするので。
  
<br>

- I PROVIDES NO WARRANTY FOR THIS SOFTWARE. PLEASE USE IT AT YOUR OWN RISK.  
  If you do not agree with this, please do not use this software.
- It may be broken due to changes in beatsaver.com specifications. In that case, please uninstall it by following the instructions below.
- This software may not be perfect. I think someone else will make a more perfect another one.

## インストール手順 / Install
1. [Release ページ](https://github.com/ranmd9a/bslinkmod/releases)から最新の bslinkmod.zip をダウンロードして、任意のディレクトリに展開してください。
2. すでに beatsaver.com を開いている場合は閉じてください。
3. Chrome で chrome://extensions を開きます。
4. 右上にある [デベロッパーモード] を有効 (●が右にある状態) にします。
5. [パッケージ化されていない拡張機能を読み込む]ボタンを押して、1. で展開したディレクトリ(manifest.json のあるディレクトリ)を指定します。
6. 拡張機能の一覧に [BS ダウンロードファイル名変更] が追加されたら拡張機能の画面は閉じてください。

<br>

1. Download the latest bslinkmod.zip from the [Release page](https://github.com/ranmd9a/bslinkmod/releases) and unzip it to any directory.
2. If you already open beatsaver.com in Chrome, please close it.
3. Open chrome://extensions in Chrome.
4. Enable [Developer Mode] in the upper right corner.
5. Click the [Load unpackaged] button and specify the directory extracted in step 1 (the directory which contains manifest.json).
6. When [BS download filename changer] appears in the list of extensions, close the extension screen.

## アンインストール手順 / Uninstall
1. Chrome で chrome://extensions を開きます。
2. 拡張機能の一覧にある [BS ダウンロードファイル名変更] の [削除]ボタンを押してください。
3. インストール手順の 1. で展開したディレクトリをディレクトリごと削除してください。
4. アンインストール前に Chrome で beatsaver.com を開いていた場合は F5 キーなどでリロードしてください。

<br>

1. Open chrome://extensions in Chrome.
2. Click the [Remove] button of [BS download filename changer] in the list of extensions.
3. Delete the directory extracted in step 1 of the installation procedure.
4. If you have opened beatsaver.com in Chrome before uninstalling, reload it by pressing F5 key.
