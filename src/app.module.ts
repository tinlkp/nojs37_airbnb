import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NguoiDungModule } from './nguoi_dung/nguoi_dung.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ViTriModule } from './vi_tri/vi_tri.module';
import { PhongModule } from './phong/phong.module';
import { BinhLuanModule } from './binh_luan/binh_luan.module';
import { DatPhongModule } from './dat_phong/dat_phong.module';


@Module({
  imports: [NguoiDungModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ViTriModule, PhongModule, BinhLuanModule, DatPhongModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
