import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, Param, Post, Put } from '@nestjs/common';
import { BinhLuanService } from './binh_luan.service';
import { binh_luan } from '@prisma/client';
import { binh_luan_entity } from './entities/binh_luan.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { binh_luan_dto } from './dto/binh_luan.dto';

@ApiTags('Bình luận')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) { }

  @HttpCode(200)
  @Get()
  findAllComment(): Promise<binh_luan[]> {
    return this.binhLuanService.findAllComment()
  }

  @HttpCode(200)
  @ApiBody({
    type: binh_luan_dto
  })
  @Post('post-comment')
  postComment(@Headers('token') token: string, @Body() data: binh_luan_entity) {
    try {
      return this.binhLuanService.postComment(token, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @ApiBody({
    type: binh_luan_dto
  })
  @Put('update-comment/:id')
  updateComment(@Headers('token') token: string, @Param('id') id: number, @Body() data: binh_luan_entity) {
    try {
      return this.binhLuanService.updateComment(token, +id, data)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Delete('delete-comment/:id')
  deleteComment(@Headers('token') token: string, @Param('id') id: number) {
    try {
      return this.binhLuanService.deleteComment(token, +id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Get('get-comment-by-room/:roomId')
  searchCommentByRoomId(@Param('roomId') roomId: number): Promise<binh_luan[]> {
    return this.binhLuanService.searchCommentByRoomId(+roomId)
  }
}
