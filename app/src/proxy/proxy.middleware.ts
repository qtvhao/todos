// proxy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly targetUrl = 'http://memory-permissions.system-production';

  use(req: any, res: any, next: () => void) {
    const proxy = createProxyMiddleware({
      target: this.targetUrl,
      changeOrigin: false,
      // pathRewrite: {
      //   '^/users': '', // This removes '/proxy' from the request path before forwarding it
      // },
    });
    return proxy(req, res, next);
  }
}
