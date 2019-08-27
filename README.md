unchartd-landing
=====================

Unchartd landing

### Installing
```
npm i
npm i node-sass
cp src/data/config.private.default.js src/data/config.private.js
cp src/data/config.public.default.js src/data/config.public.js
edit (if needed) config.public.js config.private.js
brew install GraphicsMagick
npm run cli init
```

### Creating admin user
```
npm run cli createAdminUser
```

### Building
```
npm run build
bundle files will appear in ./public/assets/
```

### Running webpack dev server
```
npm run dev-server
open http://localhost:3019
```

### Running dev SSR server
```
npm run nodemon
open http://localhost:3020
```

### Running prod SSR server
* `npm run server-start`  Start server
* `npm run server-restart` Restart server
* `npm run server-stop` Stop server
* `npm run server-delete` Delete server from pm2
