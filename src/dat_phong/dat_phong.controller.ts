import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Post, Put } from '@nestjs/common';
import { DatPhongService } from './dat_phong.service';
import { dat_phong } from '@prisma/client';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { create_book_room } from './dto/dat_phong.dto';

@ApiTags('Đặt phòng')
@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) { }


  @HttpCode(200)
  @Get()
  findAllBookRoom() {
    return this.datPhongService.findAllBookRoom()
  }

  @HttpCode(200)
  @ApiBody({
    type: create_book_room
  })
  @Post('post-book-room')
  postBookRoom(@Body() data: dat_phong) {
    try {
      return this.datPhongService.postBookRoom(data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Get('book-room-detail/:id')
  bookRoomDetail(@Param('id') id: number) {
    try {
      return this.datPhongService.bookRoomDetail(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @ApiBody({
    type: create_book_room
  })
  @Put('update-book-room/:id')
  updateBookRoom(@Param('id') id: number, @Body() data: dat_phong) {
    try {
      return this.datPhongService.updateBookRoom(+id, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Delete('delete-book-room/:id')
  deleteBookRoom(@Param('id') id: number) {
    try {
      return this.datPhongService.deleteBookRoom(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @ApiParam({
    name: "idUser"
  })
  @Get('book-room-by-id/:idUser')
  findBookRoomByIdUser(@Param('idUser') idUser: number) {
    try {
      return this.datPhongService.findBookRoomByIdUser(+idUser)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
