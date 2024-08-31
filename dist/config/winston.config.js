"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
const path = __importStar(require("path"));
const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
exports.winstonConfig = winston.createLogger({
    level: 'silly',
    format: winston.format.combine(winston.format.label({ label: 'BOUNDARY CONDITION' }), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: 'error-%DATE%.log',
            dirname: path.join(process.cwd(), 'logs/error'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '3d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'warn',
            filename: 'warn-%DATE%.log',
            dirname: path.join(process.cwd(), 'logs/warn'),
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
            level: 'verbose',
            filename: 'verbose-%DATE%.log',
            dirname: path.join(process.cwd(), 'logs/verbose'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '3d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'debug',
            filename: 'debug-%DATE%.log',
            dirname: path.join(process.cwd(), 'logs/debug'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '3d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'silly',
            filename: 'silly-%DATE%.log',
            dirname: path.join(process.cwd(), 'logs/silly'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '3d',
        }),
    ],
});
//# sourceMappingURL=winston.config.js.map