import { Module } from '@nestjs/common';
import { DatPhongService } from './dat_phong.service';
import { DatPhongController } from './dat_phong.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DatPhongController],
  providers: [DatPhongService, JwtService],
})
export class DatPhongModule { }
