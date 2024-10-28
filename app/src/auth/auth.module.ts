import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZanzibarService } from './zanzibar.service';

@Module({
  exports: [ZanzibarService],
  providers: [AuthService, ZanzibarService],
})
export class AuthModule {}
