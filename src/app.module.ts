import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NguoiDungModule } from './nguoi_dung/nguoi_dung.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NguoiDungModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
