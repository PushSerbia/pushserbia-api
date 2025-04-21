import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  error(message: string, stack?: string, context?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [ERROR] ${context ? `[${context}] ` : ''}${message}`;

    super.error(formattedMessage, stack);
  }

  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [WARN] ${context ? `[${context}] ` : ''}${message}`;

    super.warn(formattedMessage);
  }

  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [INFO] ${context ? `[${context}] ` : ''}${message}`;

    super.log(formattedMessage);
  }

  debug(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [DEBUG] ${context ? `[${context}] ` : ''}${message}`;

    super.debug(formattedMessage);
  }
}
