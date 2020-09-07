Duplicate `/config/.env` to `/config/.env.development.local` and fill out the variables

```shell
$ # Only for ARM-based systems, ie. a Raspberry Pi.
$ # This is needed for the npm canvas package
$ sudo apt-get update
$ sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```
Change directory to bot\
`cd kitcat`

Install dependencies\
`npm i`

Run bot with API (Allow NodeJs server-side javascript though Windows Firewall)\
`npm run start`