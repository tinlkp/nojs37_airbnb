import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req, Put, HttpCode, HttpException, Query } from '@nestjs/common';
import { NguoiDungService } from './nguoi_dung.service';
import { CreateNguoiDungDto, create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi_dung.dto';
import { nguoi_dung } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import upload from "../config/UploadImg"
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService, private jwtService: JwtService) { }

  // @UseGuards(AuthGuard("jwt"))
  @Get()
  // danh sách người dùng
  findAll(): Promise<create_nguoi_dung[]> {
    return this.nguoiDungService.findAll();
  }

  @Get('/search/:TenNguoiDung')
  findName(@Param('name') name: string): Promise<nguoi_dung[]> {
    return this.nguoiDungService.findName(name);
  }

  @HttpCode(200)
  @Get('/get-user-detail/:id')
  detailUser(@Param('id') id: number): Promise<nguoi_dung> {
    return this.nguoiDungService.detailUser(+id);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file", upload))
  @Post('/upload-avatar')
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    try {
      let token = req.headers.token
      return this.nguoiDungService.uploadAvatar(token, file)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }

  }

  @HttpCode(200)
  @Post('/create-user')
  createUser(@Body() createUser: nguoi_dung) {
    try {
      return this.nguoiDungService.createUser(createUser)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Put('/update-user/:id')
  updateUser(@Param('id') id: number, @Body() dataUser: nguoi_dung) {
    try {
      return this.nguoiDungService.updateUser(+id, dataUser)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Get('/get-page-user')
  getUserPage(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
    try {
      return this.nguoiDungService.getUserPage(+pageIndex, +pageSize, keyword)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @Delete('/delete-user/:id')
  deleteUser(@Param('id') id: number) {
    try {
      return this.nguoiDungService.deleteUser(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

}
