import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { create_nguoi_dung } from './dto/create-nguoi_dung.dto';
import { PrismaClient, nguoi_dung } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import hashSync from "../config/bcryptPassword"
import * as fs from 'fs'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from '../config/firebase.config'
import { update_nguoi_dung } from './dto/update-nguoi_dung.dto';

@Injectable()
export class NguoiDungService {
  constructor(private JwtService: JwtService) { }
  prisma = new PrismaClient()

  async findAll(): Promise<create_nguoi_dung[]> {
    let data = await this.prisma.nguoi_dung.findMany();
    return data;
  }

  async findName(name: string) {
    let data = await this.prisma.nguoi_dung.findMany({
      where: {
        name: {
          contains: name
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

  // up hình lên folder imgAvatar trong máy
  // async uploadAvatar(token: string, file: Express.Multer.File) {

  //   const decodeToken = await this.JwtService.decode(token)
  //   const upAvatar = await this.prisma.nguoi_dung.update({
  //     where: {
  //       id: decodeToken.data.id
  //     }, data: {
  //       avatar: file.filename
  //     }
  //   })
  //   return upAvatar
  // }

  // up hình lên firebase
  async uploadAvatar(token: string, file: Express.Multer.File) {
    const decodeToken = await this.JwtService.decode(token)
    const buffer = fs.readFileSync(file.path)
    const app = initializeApp(config.firebaseConfig);
    const storage = getStorage(app, app.options.storageBucket);
    const storageRef = ref(storage, `imgUser/${file.filename}`)
    const metadata = {
      contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, buffer.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    if (!downloadURL) {
      throw new HttpException('Lỗi ... ', HttpStatus.BAD_REQUEST)
    }
    const imgUnOptimized = process.cwd() + "/public/imgAvatar/" + file.filename;
    fs.unlink(imgUnOptimized, (error) => {
      console.log(error)
    })
    const upAvatar = await this.prisma.nguoi_dung.update({
      where: {
        id: decodeToken.data.id
      }, data: {
        avatar: downloadURL
      }
    })
    return upAvatar
  }


  async createUser(createUser: create_nguoi_dung) {
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


  async updateUser(id: number, dataUser: update_nguoi_dung) {
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