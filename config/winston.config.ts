import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  }
);

export const winstonConfig = winston.createLogger({
  level: 'silly',
  format: winston.format.combine(
    winston.format.label({ label: 'BOUNDARY CONDITION' }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'error-%DATE%.log',
      dirname: path.join(process.cwd(), 'logs/error'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '3d',
    }),
    new winston.transports.DailyRotateFile({
      level: 'info',
      filename: 'info-%DATE%.log',
      dirname: path.join(process.cwd(), 'logs/info'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '3d',
    }),
    new winston.transports.DailyRotateFile({
      level: 'http',
      filename: 'http-%DATE%.log',
      dirname: path.join(process.cwd(), 'logs/http'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '3d',
    }),
    new winston.transports.DailyRotateFile({
      level: 'debug',
      filename: 'debug-%DATE%.log',
      dirname: path.join(process.cwd(), 'logs/debug'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '3d',
    }),
  ],
});
