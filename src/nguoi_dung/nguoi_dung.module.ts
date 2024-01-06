import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi_dung.service';
import { NguoiDungController } from './nguoi_dung.controller';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [NguoiDungController],
  providers: [NguoiDungService, JwtService],
})
export class NguoiDungModule { }
