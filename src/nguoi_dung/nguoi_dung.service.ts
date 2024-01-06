import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNguoiDungDto, create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi_dung.dto';
import { PrismaClient, nguoi_dung } from '@prisma/client';
import compress_images from "compress-images";
import fs from "fs"
import { JwtService } from '@nestjs/jwt';
import hashSync from "../config/bcryptPassword"
import { compressImageAvatar } from 'src/config/compressImage';

@Injectable()
export class NguoiDungService {
  constructor(private JwtService: JwtService) { }
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
  async detailUser(id: number): Promise<nguoi_dung> {
    let user = await this.prisma.nguoi_dung.findFirst({
      where: {
        id,
      }
    })
    return user;

  };

  async uploadAvatar(token: any, file: Express.Multer.File) {
    const decodeToken = await this.JwtService.decode(token)
    // const imageAvatar = compressImageAvatar(file)
    // const getUser = await this.prisma.nguoi_dung.findFirst({
    //   where: {
    //     id: decodeToken.data.id
    //   }
    // })

    return file
  }



  async createUser(createUser: nguoi_dung) {
    let checkEmail = await this.prisma.nguoi_dung.findFirst({
      where: {
        email: createUser.email
      }
    })
    if (checkEmail) {
      throw new HttpException("Email đã tồn tại !!!", HttpStatus.UNAUTHORIZED)
    }
    let { email, pass_word, name, phone, birth_day, gender, role } = createUser;
    const hashPassword = await hashSync(pass_word)
    const newData = await this.prisma.nguoi_dung.create({
      data: {
        email,
        pass_word: hashPassword,
        name,
        phone,
        birth_day,
        gender,
        role,
      }
    })

    return newData
  }

  async updateUser(id: number, dataUser: nguoi_dung) {
    let checkUser = await this.prisma.nguoi_dung.findMany({
      where: {
        id
      }
    })
    if (!checkUser) {
      throw new HttpException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED)
    }
    if (id !== dataUser.id) {
      throw new HttpException("Không thay đổi thông tin của người khác !!!", HttpStatus.BAD_REQUEST)
    }

    const newData = await this.prisma.nguoi_dung.update({
      where: {
        id
      }, data: dataUser
    }
    )
    return newData;
  }

  async getUserPage(pageIndex: number, pageSize: number, keyword: string) {

    const result = await this.prisma.nguoi_dung.findMany({
      take: pageSize,
      where: {
        name: {
          contains: keyword
        }
      }
    })
    return result
  }


  async deleteUser(id: number) {
    const checkUser = await this.prisma.nguoi_dung.findFirst({
      where: {
        id
      }
    })
    if (!checkUser) {
      throw new HttpException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED)
    }
    const deleteUser = await this.prisma.nguoi_dung.delete({
      where: {
        id
      }
    })
    return deleteUser
  }
}