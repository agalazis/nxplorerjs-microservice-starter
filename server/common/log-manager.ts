import { Request, Response } from 'express';
import * as logger from 'express-pino-logger';
import * as fs from 'fs';
import * as pinoms from 'pino-multi-stream';

const streams = [
  {
    level: process.env.LOG_LEVEL,
    stream: process.stdout
  },
  {
    stream: fs.createWriteStream(process.env.LOG_DIRECTORY + 'application.log')
  }
];



export class LogManager {
    private static instance: LogManager;
    private logger: any;
    private uuid: string;

    private constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
            // ... any one time initialization goes here ...
            LogManager.instance.initLogger({streams: streams});
        }
        return LogManager.instance;
    }

    private initLogger(config: any) {
        this.logger = pinoms(config);
    }

    public getLogger(): any {
        return this.logger;
    }

    public logAPITrace(req: Request, res: Response, statusCode: number, message?: any) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const responseTime = res.getHeader('x-response-time');
        const uuid = this.getUUID();
        if (message !== undefined) {
            this.logger.info({ uuid, fullUrl, statusCode, responseTime, message });
        } else {
            this.logger.info({ uuid, fullUrl, statusCode , responseTime });
        }
    }

    public setUUID(uuid: string) {
        this.uuid = uuid;
    }

    public getUUID() {
        return this.uuid;
    }
}