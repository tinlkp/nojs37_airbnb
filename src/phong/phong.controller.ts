import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, Param, Post, Put } from '@nestjs/common';
import { PhongService } from './phong.service';
import { phong } from '@prisma/client';
import { phong_dto } from './dto/phong.dto';

@Controller('phong')
export class PhongController {
  constructor(private readonly phongService: PhongService) { }

  @HttpCode(200)
  @Get()
  findAllRoom(): Promise<phong[]> {
    return this.phongService.findAllRoom()
  }

  @HttpCode(200)
  @Get('room-detail/:id')
  roomDetail(@Param('id') id: number) {
    try {
      return this.phongService.roomDetail(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Post('create-room')
  createRoom(@Headers('token') token: string, @Body() data: phong_dto) {
    try {
      return this.phongService.createRoom(token, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Get('search-room-by-local/:idViTri')
  findRoomByLocation(@Param('idViTri') idViTri: number) {
    try {
      return this.phongService.findRoomByLocation(+idViTri)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Put('update-room/:id')
  updateRoom(@Headers('token') token: string, @Param("id") id: number, @Body() data: phong_dto) {
    try {
      return this.phongService.updateRoom(token, +id, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Delete('delete-room/:id')
  deleteRoom(@Headers('token') token: string, @Param('id') id: number) {
    try {
      return this.phongService.deleteRoom(token, +id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
