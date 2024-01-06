import { Module } from '@nestjs/common';
import { ViTriService } from './vi_tri.service';
import { ViTriController } from './vi_tri.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ViTriController],
  providers: [ViTriService, JwtService],
})
export class ViTriModule { }
