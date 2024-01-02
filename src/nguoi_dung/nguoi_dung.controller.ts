import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NguoiDungService } from './nguoi_dung.service';
import { CreateNguoiDungDto, create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi_dung.dto';
import { nguoi_dung } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }

  @Get()
  findAll(): Promise<create_nguoi_dung[]> {
    return this.nguoiDungService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<nguoi_dung[]> {
    return this.nguoiDungService.findOne(+id);
  }


  @Get('/search/:name')
  findName(@Param('name') name: string): Promise<nguoi_dung[]> {
    return this.nguoiDungService.findName(name);
  }

  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  @Post('/upload-avatar')
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.nguoiDungService.uploadAvatar(file)
  }

  @Post()
  create(@Body() createNguoiDungDto: CreateNguoiDungDto) {
    return this.nguoiDungService.create(createNguoiDungDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNguoiDungDto: UpdateNguoiDungDto) {
    return this.nguoiDungService.update(+id, updateNguoiDungDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nguoiDungService.remove(+id);
  }
}
