import { Injectable } from '@nestjs/common';
import { CreateNguoiDungDto, create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi_dung.dto';
import { PrismaClient, nguoi_dung } from '@prisma/client';
@Injectable()
export class NguoiDungService {

  prisma = new PrismaClient()

  async findAll(): Promise<create_nguoi_dung[]> {
    let data = await this.prisma.nguoi_dung.findMany();
    return data;
  }

  async findName(name: string): Promise<nguoi_dung[]> {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        name: {
          contains: name,
        }
      }
    })
    return data;
  }

  async findOne(id: number): Promise<nguoi_dung[]> {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        id: id
      }
    })
    return data;
  }

  async uploadAvatar(file: Express.Multer.File) {
    
  }

  create(createNguoiDungDto: CreateNguoiDungDto) {
    return 'This action adds a new nguoiDung';
  }

  update(id: number, updateNguoiDungDto: UpdateNguoiDungDto) {
    return `This action updates a #${id} nguoiDung`;
  }

  remove(id: number) {
    return `This action removes a #${id} nguoiDung`;
  }
}
