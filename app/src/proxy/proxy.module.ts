import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as proxy from 'express-http-proxy';

@Module({})
export class ProxyModule implements NestModule {
    private readonly targetUrl = 'http://memory-permissions.system-production';
    configure(consumer: MiddlewareConsumer) {
    // Proxy all requests starting with /api to the target API
    consumer
      .apply(
        proxy(this.targetUrl, {
          proxyReqPathResolver: (req: any) => {
            // Forward the request path and query parameters
            return `/users${req.url}`;
          },
        }),
      )
      .forRoutes('/users'); // This will route all /users/* requests to the proxy
  }
}
