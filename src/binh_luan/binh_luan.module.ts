import { Module } from '@nestjs/common';
import { BinhLuanService } from './binh_luan.service';
import { BinhLuanController } from './binh_luan.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BinhLuanController],
  providers: [BinhLuanService, JwtService],
})
export class BinhLuanModule { }
