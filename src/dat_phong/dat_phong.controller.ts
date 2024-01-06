import { Controller, Get, HttpCode } from '@nestjs/common';
import { DatPhongService } from './dat_phong.service';

@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) { }


  @HttpCode(200)
  @Get()
  findAllBookRoom() {
    return this.datPhongService.findAllBookRoom()
  }
}
