import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, phong } from '@prisma/client';
import { phong_dto } from './dto/phong.dto';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from '../config/firebase.config'
import * as fs from "fs";


@Injectable()
export class PhongService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()

    // tìm danh sách phòng
    async findAllRoom(): Promise<phong[]> {
        let data = await this.prisma.phong.findMany()
        return data
    }

    // tạo phòng
    async createRoom(token: string, data: phong_dto) {
        const decodeToken = await this.JwtService.decode(token)
        // kiểm tra quyền người dùng
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        // nếu người dùng là user 
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }

        let newData = this.prisma.phong.create({ data: data })
        return newData
    }

    // tìm phòng theo id vị trí
    async findRoomByLocation(idViTri: number) {
        let data = await this.prisma.phong.findMany({
            where: {
                ma_vi_tri: idViTri
            }
        })
        if (!data) {
            throw new HttpException("vị trí này không có phòng nào", HttpStatus.UNAUTHORIZED)
        }
        return data
    }

    // tìm phòng theo trang
    async findRoomPage(pageIndex: number, pageSize: number, keyword: string) {
        // nếu keyword tồn tại
        if (keyword) {
            const result = await this.prisma.phong.findMany({
                where: {
                    ten_phong: {
                        contains: keyword
                    }
                },
                take: pageSize,
                skip: pageIndex - 1
            })
            return result
        } else {
            // nếu keyword không tồn tại
            const result = await this.prisma.phong.findMany({
                take: pageSize,
                skip: pageIndex - 1
            })
            return result
        }
    }

    // tìm phòng theo id phòng
    async roomDetail(id: number) {
        let roomDetail = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        if (!roomDetail) {
            throw new HttpException("Mã phòng không tồn tại", HttpStatus.UNAUTHORIZED)
        }
        return roomDetail
    }

    // cập nhật phòng
    async updateRoom(token: string, id: number, dataRoom: phong_dto) {
        const decodeToken = await this.JwtService.decode(token)
        // kiểm tra quyền người dùng
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        // nếu người dùng là user
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        // kiểm tra phòng
        let checkRoom = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        if (!checkRoom) {
            throw new HttpException("Phòng không tồn tại !!!", HttpStatus.UNAUTHORIZED)
        }
        let newData = await this.prisma.phong.update({
            where: {
                id
            }, data: dataRoom
        })
        return newData
    }

    // xóa phòng
    async deleteRoom(token: string, id: number) {
        const decodeToken = await this.JwtService.decode(token)
        // kiểm tra quyền người dùng
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        // nếu người dùng là user
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        // kiểm tra phòng
        let checkRoom = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        if (!checkRoom) {
            throw new HttpException("Phòng không tồn tại !!!", HttpStatus.UNAUTHORIZED)
        }
        let deleteR = await this.prisma.phong.delete({
            where: {
                id
            }
        })
        return deleteR
    }

    // up ảnh lên folder imgRoom trong máy
    // async uploadImgRoom(token: string, id: number, file: Express.Multer.File) {
    //     const decodeToken = await this.JwtService.decode(token)
    //     const checkUser = await this.prisma.nguoi_dung.findFirst({
    //         where: {
    //             id: decodeToken.data.id
    //         }
    //     })
    //     if (checkUser.role === "USER") {
    //         throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
    //     }
    //     const checkRoom = await this.prisma.phong.findFirst({
    //         where: {
    //             id
    //         }
    //     })
    //     if (!checkRoom) {
    //         throw new HttpException("Phòng không tồn tại !!!", HttpStatus.UNAUTHORIZED)
    //     }
    //     let uploadImg = await this.prisma.phong.update({
    //         where: {
    //             id
    //         }, data: {
    //             hinh_anh: imgRoom.filename
    //         }
    //     })
    //     return uploadImg
    // }


    // up ảnh lên firebase
    async uploadImgRoom(token: string, id: number, file: Express.Multer.File) {
        const decodeToken = await this.JwtService.decode(token)
        // check quyền người dùng
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        // setup firebase
        const app = initializeApp(config.firebaseConfig);
        const storage = getStorage(app, app.options.storageBucket);
        // đọc file
        const buffer = fs.readFileSync(file.path)
        const storageRef = ref(storage, `imgRoom/${file.filename}`)
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
        const imgUnOptimized = process.cwd() + "/public/imgRoom/" + file.filename;
        fs.unlink(imgUnOptimized, (error) => {
            console.log(error)
        })
        // kiểm tra phòng
        const checkRoom = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        if (!checkRoom) {
            throw new HttpException("Phòng không tồn tại !!!", HttpStatus.UNAUTHORIZED)
        }
        let uploadImg = await this.prisma.phong.update({
            where: {
                id
            }, data: {
                hinh_anh: downloadURL
            }
        })
        return uploadImg
    }

}
