import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ASYNC_STORAGE } from './logger.constants';
import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';

const pinoInstance = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

@Injectable()
export class PinoLoggerService implements LoggerService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}
  private getMessage(message: any, context?: string) {
    return context ? `[ ${context} ] ${message}` : message;
  }
  log(message: any, context?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    pinoInstance.info({ traceId }, this.getMessage(message, context));
  }

  error(message: string, trace?: string, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    pinoInstance.error({ traceId }, this.getMessage(message, context));
    if (trace) {
      pinoInstance.error(trace);
    }
  }

  warn(message: string, context?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    pinoInstance.warn({ traceId }, this.getMessage(message, context));
  }

  debug(message: string, context?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    pinoInstance.debug({ traceId }, this.getMessage(message, context));
  }
}
