# smartonoff
Can turn relays on / off based on current electricity prices, temperature or many other options. Works with Raspberry Pi!

## TODO

[x] Check performance on Raspberry Pi (Maybe use static css file for semantic ui)
[ ] Add TSLint

## Installation & running

* Setup `config.ts` on project root.

### NPM

* `npm i -g parcel-bundler`
* `npm install`
* `npm run develop`

### Yarn

* `yarn global add parcel-bundler`
* `yarn install`
* `yarn develop`

## Notes

To add more conditions, you currently need to delete previous `src/api/settings.json` file and update `src/api/defaultSettings.json` file properly. This should be made dynamic. (TODO)