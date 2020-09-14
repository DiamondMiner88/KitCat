import path from 'path';
import fs from 'fs';

// Logging
import log4js from 'log4js';
const LOGGER = log4js.getLogger('api');

// Server
import http from 'http';
import https from 'https';
import { default as express } from 'express';
import bodyParser from 'body-parser';
const //
  api = express(),
  keyPath = path.join(__dirname, '../../config/ssl/server.key'),
  certPath = path.join(__dirname, '../../config/ssl/server.cert');
api.use(bodyParser.json());

// APIs by version
import v1_0_0 from './api-1.0.0';
api.use('/api/v1.0.0', v1_0_0);

export function startAPI() {
  const onStart = () => LOGGER.debug('Listening at port 4000');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    https
      .createServer(
        {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        },
        api
      )
      .listen(4000, onStart);
  } else {
    LOGGER.debug('Private key or cert is missing so starting a http server instead of https');
    http.createServer(api).listen(4000, onStart);
  }
}
