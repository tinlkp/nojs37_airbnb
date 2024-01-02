import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi_dung.service';
import { NguoiDungController } from './nguoi_dung.controller';

@Module({
  controllers: [NguoiDungController],
  providers: [NguoiDungService],
})
export class NguoiDungModule {}
