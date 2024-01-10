import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, phong } from '@prisma/client';
import { phong_dto } from './dto/phong.dto';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from '../config/firebase.config'
import * as fs from "fs";


@Injectable()
export class PhongService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()

    async findAllRoom(): Promise<phong[]> {
        let data = await this.prisma.phong.findMany()
        return data
    }

    async createRoom(token: string, data: phong_dto) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        // let { ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui } = data

        let newData = this.prisma.phong.create({ data: data })
        return newData
    }

    async findRoomByLocation(idViTri: number) {
        let data = await this.prisma.phong.findFirst({
            where: {
                ma_vi_tri: idViTri
            }
        })
        if (!data) {
            throw new HttpException("vị trí này không có phòng nào", HttpStatus.UNAUTHORIZED)
        }
        return data
    }

    async findRoomPage(pageIndex: number, pageSize: number, keyword: string) {
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
    }

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

    async updateRoom(token: string, id: number, dataRoom: phong_dto) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
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

    async deleteRoom(token: string, id: number) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
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
        const buffer = fs.readFileSync(file.path)
        const app = initializeApp(config.firebaseConfig);
        const storage = getStorage(app, app.options.storageBucket);
        const storageRef = ref(storage, `imgRoom/${file.filename}`)
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, buffer.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (!downloadURL) {
            throw new HttpException('Lỗi ... ', HttpStatus.BAD_REQUEST)
        }
        const imgUnOptimized = process.cwd() + "/public/imgRoom/" + file.filename;
        fs.unlink(imgUnOptimized, (error) => {
            console.log(error)
        })
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
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
