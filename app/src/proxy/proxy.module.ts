import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as proxy from 'express-http-proxy';

@Module({})
export class ProxyModule implements NestModule {
    private readonly targetUrl = 'http://memory-permissions.system-production';
    configure(consumer: MiddlewareConsumer) {
        // Proxy all requests starting with /users and /access-keys to the target API
        consumer
            .apply(
                proxy(this.targetUrl, {
                    // /users/1 -> http://memory-permissions.system-production/users/1
                    // /access-keys/1 -> http://memory-permissions.system-production/access-keys/1
                    // /users/create -> http://memory-permissions.system-production/users/create

                }),
            )
            .forRoutes('/users', '/access-keys');
    }
}
