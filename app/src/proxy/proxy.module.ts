import { ProxyMiddleware } from './proxy.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class ProxyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ProxyMiddleware)
            .forRoutes('/users'); // Apply to paths starting with /users
    }
}
