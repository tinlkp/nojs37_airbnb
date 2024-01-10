import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ViTriService } from './vi_tri.service';
import { vi_tri } from '@prisma/client';
import { vi_tri_dto } from './dto/vi_tri.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import upload from 'src/config/UploadImg';
import { compressImage } from 'src/config/compressImage';

@Controller('vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) { }

  @HttpCode(200)
  @Get()
  findAll(): Promise<vi_tri[]> {
    return this.viTriService.findAll()
  }

  @HttpCode(200)
  @Get('/location-detail/:id')
  locationDetail(@Param('id') id: number): Promise<vi_tri> {
    return this.viTriService.locationDetail(+id)
  }

  @HttpCode(200)
  @Post('/create-location')
  createLocation(@Body() data: vi_tri_dto, @Req() req: Request) {
    try {
      let token = req.headers.token
      return this.viTriService.createLocation(data, token)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Put('update-location/:id')
  updateLocation(@Param('id') id: number, @Headers('token') token: string, @Body() data: vi_tri_dto) {
    try {
      return this.viTriService.updateLocation(+id, token, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Delete('delete-location/:id')
  deleteLocation(@Param('id') id: number, @Headers('token') token: string) {
    try {
      return this.viTriService.deleteLocation(+id, token)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  // pageIndex là số trang, 
  // pageSize là số vị trí trong 1 trang, 
  // keyword là tên vị trí
  @HttpCode(200)
  @Get('get-location-page')
  findLocationPage(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
    return this.viTriService.findLocationPage(+pageIndex, +pageSize, keyword)
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file", upload))
  @Post('upload-img-location/:idViTri')
  async uploadHinhViTri(@Param('idViTri') id: number, @UploadedFile() file: Express.Multer.File, @Headers('token') token: string) {
    try {
      const image = await compressImage(file, "/public/imgLocation/")
      return this.viTriService.uploadHinhViTri(+id, image, token)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
