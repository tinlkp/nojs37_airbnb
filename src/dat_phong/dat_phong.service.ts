import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, dat_phong } from '@prisma/client';

@Injectable()
export class DatPhongService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()

    async findAllBookRoom() {
        let data = await this.prisma.dat_phong.findMany()
        return data
    }

    async postBookRoom(data: dat_phong) {
        let newData = await this.prisma.dat_phong.create({ data })
        return newData
    }

    async bookRoomDetail(id: number) {
        let roomDetail = await this.prisma.dat_phong.findFirst({
            where: {
                id
            }
        })
        return roomDetail
    }

    async updateBookRoom(id: number, data: dat_phong) {
        let checkBookRoom = await this.prisma.dat_phong.findFirst({
            where: {
                id
            }
        })
        if (!checkBookRoom) {
            throw new HttpException('Số phòng không đúng !!!', HttpStatus.UNAUTHORIZED)
        }
        let { ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = data
        let newData = await this.prisma.dat_phong.update({
            where: {
                id
            }, data: {
                ma_phong,
                ngay_den,
                ngay_di,
                so_luong_khach,
                ma_nguoi_dat,
            }
        })
        return newData
    }

    async deleteBookRoom(id: number) {
        let checkBookRoom = await this.prisma.dat_phong.findFirst({
            where: {
                id
            }
        })
        if (!checkBookRoom) {
            throw new HttpException('Số phòng không đúng !!!', HttpStatus.UNAUTHORIZED)
        }
        let delBookRoom = await this.prisma.dat_phong.delete({
            where: {
                id
            }
        })
        return delBookRoom
    }

    async findBookRoomByIdUser(idUser: number) {
        let checkBookRoom = await this.prisma.dat_phong.findFirst({
            where: {
                ma_nguoi_dat: idUser
            }
        })
        if (!checkBookRoom) {
            throw new HttpException('Số phòng không đúng !!!', HttpStatus.UNAUTHORIZED)
        }
        let data = await this.prisma.dat_phong.findFirst({
            where: {
                ma_nguoi_dat: idUser
            }
        })
        return data
    }
}

