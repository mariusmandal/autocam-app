# autocam-app



### VUE-customization
See [Configuration Reference](https://cli.vuejs.org/config/).

## Installasjon i dev-miljø
Neeesten painless! 😅

- **Installert electron globalt:** <br />
`$ npm install electron -g`

- **Installert vue-cli globalt:**<br />
`$ npm install -g @vue/cli`

- **Oppdatert node-versjon:** <br />
`$ nvm install --lts`

- **Installer prosjektets dependencies:**<br />
`$ npm install`

## Installere service-fil for atem-helper
- **Kopier service-fil til rett mappe:**
`$ sudo cp conf/systemd/atem.service /etc/systemd/system/atem.service`

- **Enable service:**
`$ systemctl enable atem.service`

- **Restart service (just in case):**
`$ sudo service atem reload`

## Hvordan jeg kom hit
Etter langt og lenge, kom jeg endelig frem til at dette var veien til en fungerende boilerplate. Hvordan mac'en min nå er satt opp aner jeg ikke, da flere forsøk har involvert både `npm install -g` (sorry) og `brew install`. Easy-peasy ifølge mange, men, vel...

Aldri så liten takk til [Smashingmagazine](https://www.smashingmagazine.com/2020/07/desktop-apps-electron-vue-javascript/) som satte meg på riktig spor.

- **Installert electron globalt:** <br />
`$ npm install electron -g`

- **Installert vue-cli globalt:**<br />
`$ npm install -g @vue/cli`

- **Opprettet vue-prosjektet (faktisk enkelt, da):** <br />
`$ vue create autocam-app`

- **Lagt til electron:**<br />
`$ vue add electron-builder`
<br />Under installasjonen valgte jeg v.9x (latest)

- **Lagt til [vuetify](https://vuetifyjs.com/en/introduction/why-vuetify/):**<br />
`$ vue add vuetify`<br />
Valgte default-settings

- **Valgt og lagt til [vuetify-tema](https://vuetifyjs.com/en/features/presets/#material-studies) (preset):**<br />
`$ vue add vuetify-preset-rally`<br />
Valgte preset:[`rally`](https://vuetifyjs.com/en/features/presets/#material-studies)

- **Lagt til ikon-pakke**:<br />
`$ npm install vue-material-design-icons`

- **Ignorert ubrukte variabler:**<br />
package.json:
```json
"eslintConfig" {
    "rules": {
        "no-unused-vars": "off"
    }
}
```

- **Lagt til serialport**<br />
`$ npm install --save-dev electron-rebuild`<br />
package.json:
```json
"scripts" {
    "install": "electron-rebuild",
}
```
`$ npm install serialport`<br />
`$ npm install`

vue.config.js
```js
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            nodeIntegration: true
        }
    }
```
NodeIntegration, takk til [@genilsonmm](https://github.com/electron/electron/issues/9920#issuecomment-645557312)

- **Starta greia:**<br />
`$ npm run electron:serve`
