import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhongService } from './phong.service';
import { phong } from '@prisma/client';
import { phong_dto } from './dto/phong.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import upload from 'src/config/UploadImg';
import { compressImage } from 'src/config/compressImage';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { phong_create } from './entities/phong.entity';
import { FileUploadDto } from 'src/config/Upload.dto';

@ApiTags('Phòng')
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
  @ApiBody({
    type: phong_create
  })
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
  @ApiBody({
    type: phong_create
  })
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

  // pageIndex là số trang, 
  // pageSize là số phòng trong 1 trang,
  // keyword là tên của phòng
  @HttpCode(200)
  @Get('get-room-page')
  findRoomPage(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
    return this.phongService.findRoomPage(+pageIndex, +pageSize, keyword)
  }


  // @HttpCode(200)
  // @UseInterceptors(FileInterceptor("file", upload))
  // @Post('upload-img-room/:id')
  // uploadImgRoom(@Headers('token') token: string, @Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
  //   try {
  //     return this.phongService.uploadImgRoom(token, +id, file)
  //   } catch (exception) {
  //     throw new HttpException(exception.response, exception.status)
  //   }
  // }

  @HttpCode(200)
  @ApiBody({
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor("file", upload))
  @ApiConsumes('multipart/form-data')
  @Post('upload-img-room/:id')
  async uploadImgRoom(@Headers('token') token: string, @Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    try {
      const image = await compressImage(file, "/public/imgRoom/")
      return this.phongService.uploadImgRoom(token, +id, image)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

}
