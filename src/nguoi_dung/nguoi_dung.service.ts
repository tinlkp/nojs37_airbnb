import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { PrismaClient, nguoi_dung } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import hashSync from "../config/bcryptPassword"
import { compressImage } from 'src/config/compressImage';
import { nguoi_dung_id } from './entities/nguoi_dung.entity';

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

  async uploadAvatar(token: string, file: Express.Multer.File): Promise<nguoi_dung_id> {
    const decodeToken = await this.JwtService.decode(token)
    const userImage = await compressImage(file, "/public/imgAvatar/")
    const upAvatar = await this.prisma.nguoi_dung.update({
      where: {
        id: decodeToken.data.id
      }, data: {
        avatar: userImage.filename
      }
    })
    return upAvatar
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
      where: {
        name: {
          contains: keyword
        }
      },
      take: pageSize,
      skip: pageIndex - 1
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