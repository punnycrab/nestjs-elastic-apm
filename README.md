```text
   ___                             ___          _     
  / _ \_   _ _ __  _ __  _   _    / __\ __ __ _| |__  
 / /_)/ | | | '_ \| '_ \| | | |  / / | '__/ _` | '_ \ 
/ ___/| |_| | | | | | | | |_| | / /__| | | (_| | |_) |
\/     \__,_|_| |_|_| |_|\__, | \____/_|  \__,_|_.__/ 
                         |___/                        
```

# Elastic APM for NestJS

A **NestJS** module for seamless integration with **Elastic APM**, providing automatic performance monitoring and error tracking for your NestJS applications.

## Features

- **Automatic performance monitoring** of HTTP requests, database queries, and external API calls.
- **Error tracking** for unhandled exceptions.
- Support for **custom transactions, spans, and metrics**.
- Easy integration with **Elastic APM** using configuration options.

## Installation

Install the package via npm:

```bash
npm install elastic-apm-nestjs
```

## Quick Start

### 1. Import `ElasticAPMModule` in Your `AppModule`

To get started, import the `ElasticAPMModule` in your `AppModule` and configure it with your Elastic APM server details.

```typescript
import { Module } from '@nestjs/common';
import { ElasticAPMModule } from 'elastic-apm-nestjs';

@Module({
  imports: [
    ElasticAPMModule.forRoot({
      serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'your-service-name',
      secretToken: process.env.ELASTIC_APM_SECRET_TOKEN || '',
      serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200',
      environment: process.env.NODE_ENV || 'production',
      captureBody: 'all',
    }),
  ],
})
export class AppModule {}
```

### 2. Set Environment Variables

You can also configure the APM module using environment variables. Add the following to your `.env` file or deployment environment:

```
ELASTIC_APM_SERVICE_NAME=your-service-name
ELASTIC_APM_SECRET_TOKEN=your-secret-token
ELASTIC_APM_SERVER_URL=http://localhost:8200
NODE_ENV=production
```

### 3. Automatic Instrumentation

Once the module is set up, the APM agent will automatically:

- Track all incoming **HTTP requests**.
- Capture any **unhandled exceptions**.
- Monitor database queries and external requests (for supported libraries).

You don’t need to manually inject or use the APM service for basic functionality.

## Advanced Usage

If you want more control and customization (such as creating custom transactions, spans, or capturing custom errors), you can still inject the `ElasticAPMService` into your controllers or services.

### Custom Transactions and Spans

You can create custom transactions to track specific operations or processes.

```typescript
import { Injectable } from '@nestjs/common';
import { ElasticAPMService } from 'elastic-apm-nestjs';

@Injectable()
export class SomeService {
  constructor(private readonly elasticApmService: ElasticAPMService) {}

  async performTask() {
    // Start a custom transaction
    const transaction = this.elasticApmService.startTransaction('performTask', 'task');

    try {
      // Start a span for a specific action
      const span = this.elasticApmService.startSpan('dbQuery', 'db');

      // Simulate a database query or operation
      await this.simulateDatabaseQuery();

      // End the span after work is done
      this.elasticApmService.endSpan(span);

    } catch (error) {
      // Capture the error
      this.elasticApmService.captureError(error);
    } finally {
      // End the transaction
      this.elasticApmService.endTransaction(transaction, 'success');
    }
  }

  private async simulateDatabaseQuery() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
```

### Custom Error Tracking

You can also manually capture errors for custom error handling:

```typescript
try {
  // Some code that may throw an error
} catch (error) {
  this.elasticApmService.captureError(error);
}
```

### Custom Metrics

You can add custom metrics and contextual information to be captured by the APM agent:

```typescript
this.elasticApmService.addCustomMetric('custom_metric_name', 100);
this.elasticApmService.setCustomContext({ customData: 'value' });
```

## API Reference

### `ElasticAPMModule.forRoot(options: ElasticAPMOptions): DynamicModule`

Initializes the APM agent globally.

**Options:**

- `serviceName`: The name of your service (required).
- `secretToken`: The secret token for your APM server (optional).
- `serverUrl`: The URL of your APM server (required).
- `environment`: The environment (e.g., development, production). Defaults to `development`.
- `captureBody`: Capture request bodies (`all`, `errors`, `off`). Defaults to `all`.

### `ElasticAPMService`

You can inject `ElasticAPMService` for advanced APM functionality:

- **`startTransaction(name: string, type: string = 'request')`**: Start a custom transaction.
- **`endTransaction(transaction: any, result?: string)`**: End a custom transaction.
- **`startSpan(name: string, type: string = 'custom')`**: Start a custom span.
- **`endSpan(span: any)`**: End a custom span.
- **`captureError(error: any)`**: Capture a custom error.
- **`addCustomMetric(name: string, value: number)`**: Add a custom metric.
- **`setCustomContext(context: Record<string, any>)`**: Set a custom context.
- **`setUserContext(user: { id: string, username?: string, email?: string })`**: Set the user context.
- **`addLabel(key: string, value: string | number | boolean)`**: Add a custom label.
- **`addLabels(labels: Record<string, string | number | boolean>)`**: Add multiple labels.

## Supported Libraries

Elastic APM automatically supports and monitors requests and queries from the following libraries:

- HTTP (`http`, `https`)
- Express (used internally by NestJS)
- MongoDB, MySQL, PostgreSQL
- Redis
- Axios
- And many more…

For a full list of supported technologies, visit the [Elastic APM Node.js agent documentation](https://www.elastic.co/guide/en/apm/agent/nodejs/current/supported-technologies.html).

## Contributing

If you’d like to contribute to the project or report an issue, please feel free to submit a pull request or open an issue on the [GitHub repository](https://github.com/punnycrab/nestjs-elastic-apm.git).

## License

This library is licensed under the **MIT License**.

---
