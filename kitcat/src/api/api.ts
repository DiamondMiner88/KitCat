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
const api = express();
const keyPath = path.join(__dirname, '../../config/ssl/server.key');
const certPath = path.join(__dirname, '../../config/ssl/server.cert');
// const useHTTPS = fs.existsSync(keyPath) && fs.existsSync(certPath);
const useHTTPS = false;
api.use(bodyParser.json());

// APIs by version
// import v1_0_0 from './api-1.0.0';
// api.use('/', v1_0_0);

// mc logging
import mclogging from './mclogging';
api.post('/mclog', mclogging);

export function startAPI() {
    if (!useHTTPS) LOGGER.debug('Private key/cert are missing so starting a http server instead of https');

    const server = useHTTPS
        ? https.createServer(
              {
                  key: fs.readFileSync(keyPath),
                  cert: fs.readFileSync(certPath),
              },
              api
          )
        : http.createServer(api);

    server.on('listening', () => LOGGER.debug('API listening at port 4000'));
    server.on('error', (error) => LOGGER.error(error.message));

    try {
        server.listen(4000);
    } catch (error) {
        JSON.parse(JSON.stringify(error));
    }
}
