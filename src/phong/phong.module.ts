import { Module } from '@nestjs/common';
import { PhongService } from './phong.service';
import { PhongController } from './phong.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  controllers: [PhongController],
  providers: [PhongService, JwtService],
})
export class PhongModule { }
