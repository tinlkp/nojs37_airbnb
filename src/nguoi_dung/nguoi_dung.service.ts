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
    let data = await this.prisma.nguoi_dung.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        pass_word: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: false
      }
    });
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

  // tìm người dùng theo id
  async detailUser(id: number): Promise<nguoi_dung> {
    let user = await this.prisma.nguoi_dung.findFirst({
      where: {
        id,
      }
    })
    // nếu id người dùng không tồn tại thì trả lỗi
    if (!user) {
      throw new HttpException('Người dùng không tồn tại...', HttpStatus.UNAUTHORIZED)
    }
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
    // đọc file
    const buffer = fs.readFileSync(file.path)
    // setup basefire
    const app = initializeApp(config.firebaseConfig);
    const storage = getStorage(app, app.options.storageBucket);
    const storageRef = ref(storage, `imgUser/${file.filename}`)
    const metadata = {
      contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, buffer.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    // nếu có lỗi gì thì báo lỗi
    if (!downloadURL) {
      throw new HttpException('Lỗi ... ', HttpStatus.BAD_REQUEST)
    }
    // xóa đi hình đã lưu trong máy
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

  // tạo người dùng
  async createUser(createUser: create_nguoi_dung) {
    // kiểm trả email
    let checkEmail = await this.prisma.nguoi_dung.findFirst({
      where: {
        email: createUser.email
      }
    })
    // nếu email đã tồn tại
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

  // cập nhật người dùng
  async updateUser(id: number, dataUser: update_nguoi_dung) {
    let checkUser = await this.prisma.nguoi_dung.findMany({
      where: {
        id
      }
    })
    // nếu id người không có
    if (!checkUser) {
      throw new HttpException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED)
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
    // nếu keyword tồn tại
    if (keyword) {
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
    } else {
      // nếu keyword không tồn tại
      const result = await this.prisma.nguoi_dung.findMany({
        take: pageSize,
        skip: pageIndex - 1
      })
      return result
    }
  }

  async deleteUser(id: number) {
    const checkUser = await this.prisma.nguoi_dung.findFirst({
      where: {
        id
      }
    })
    // kiểm tra người dùng
    if (!checkUser) {
      throw new HttpException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED)
    }
    // kiểm tra xem người dùng có bình luận chưa 
    const userComment = await this.prisma.binh_luan.findMany({
      where: {
        ma_nguoi_binh_luan: id
      }
    })
    // nếu người dùng đã bình luận thì xóa bình luận
    if (userComment) {
      await this.prisma.binh_luan.deleteMany({
        where: {
          ma_nguoi_binh_luan: id
        }
      })
    }
    const deleteUser = await this.prisma.nguoi_dung.delete({
      where: {
        id
      }
    })
    return deleteUser
  }
}