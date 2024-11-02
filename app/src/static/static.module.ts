import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: process.env.STATIC_FOLDER || join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
  ],
})
export class StaticModule {}
