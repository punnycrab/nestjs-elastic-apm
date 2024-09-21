import { Injectable } from '@nestjs/common';
import * as apm from 'elastic-apm-node';

export interface ElasticAPMOptions {
  serviceName: string;
  secretToken?: string;
  serverUrl: string;
  environment?: string;
  captureBody?: apm.CaptureBody;
}

@Injectable()
@Injectable()
export class ElasticAPMService {
  private apmInstance;

  initialize(options: ElasticAPMOptions) {
    this.apmInstance = apm.start({
      serviceName: options.serviceName,
      secretToken: options.secretToken,
      serverUrl: options.serverUrl,
      environment: options.environment || 'development',
      captureBody: options.captureBody || 'all',
    });
  }

  // Capture errors
  captureError(error: any) {
    if (this.apmInstance) {
      this.apmInstance.captureError(error);
    }
  }

  // Start a transaction
  startTransaction(name: string, type: string = 'request') {
    if (this.apmInstance) {
      return this.apmInstance.startTransaction(name, type);
    }
    return null;
  }

  // End a transaction
  endTransaction(transaction: any, result?: string) {
    if (transaction) {
      transaction.result = result || 'success';
      transaction.end();
    }
  }

  // Start a custom span (used to measure individual units of work within transactions)
  startSpan(name: string, type: string = 'custom') {
    if (this.apmInstance) {
      return this.apmInstance.startSpan(name, type);
    }
    return null;
  }

  // End a custom span
  endSpan(span: any) {
    if (span) {
      span.end();
    }
  }

  // Capture custom metrics
  addCustomMetric(name: string, value: number) {
    if (this.apmInstance) {
      this.apmInstance.setCustomContext({
        [name]: value,
      });
    }
  }

  // Set contextual information for tracing and error tracking
  setCustomContext(context: Record<string, any>) {
    if (this.apmInstance) {
      this.apmInstance.setCustomContext(context);
    }
  }

  // Set user context (used to track authenticated users)
  setUserContext(user: { id: string, username?: string, email?: string }) {
    if (this.apmInstance) {
      this.apmInstance.setUserContext(user);
    }
  }

  // Set label (used to add custom tags/labels to transactions)
  addLabel(key: string, value: string | number | boolean) {
    if (this.apmInstance) {
      this.apmInstance.addLabels({ [key]: value });
    }
  }

  // Set labels in batch
  addLabels(labels: Record<string, string | number | boolean>) {
    if (this.apmInstance) {
      this.apmInstance.addLabels(labels);
    }
  }
}