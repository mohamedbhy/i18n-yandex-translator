# Description
A NodeJS program to translate language files from English to a target language. Any language supported by [Yandex translation api](https://tech.yandex.com/translate/) works

# Purpose
Main purpose is to translate i18n language files in bulk for those who don't have translators

# Setup
- Copy `config.sample.json` to `config.json`
    - Set the yandex translation api key
    - Set the target language in config.json
    - Set the source language file in config.json.
    - Set the destination language file in config.json
- Run `npm start` to start translation
- Check the destination path to get the translated file

Repeat the above for all the desired languages

# Versions
See the [versions](./VERSIONS.md) page for a list of versions and the corresponding changes

# Notes
- Accuracy is completely dependent on the yandex translation API
- [Supported languages list](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages)
- The source language file format should be flat. See [es-ES.json](./es-ES.json) for example
