import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, vi_tri } from '@prisma/client';
import { vi_tri_dto } from './dto/vi_tri.dto';
import { compressImage } from 'src/config/compressImage';

@Injectable()
export class ViTriService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()



    async findAll(): Promise<vi_tri[]> {
        let data = await this.prisma.vi_tri.findMany()
        return data
    }

    async createLocation(data: vi_tri_dto, token: any) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        let { ten_vi_tri, tinh_thanh, quoc_gia } = data
        const newData = await this.prisma.vi_tri.create({
            data: {
                ten_vi_tri,
                tinh_thanh,
                quoc_gia,
            }
        })
        return newData
    }

    async findLocationPage(pageIndex: number, pageSize: number, keyword: string) {
        const result = await this.prisma.vi_tri.findMany({
            where: {
                ten_vi_tri: {
                    contains: keyword
                }
            },
            take: pageSize,
            skip: pageIndex - 1
        })
        return result
    }

    async locationDetail(id: number): Promise<vi_tri> {
        let detail = await this.prisma.vi_tri.findFirst({
            where: {
                id
            }
        })
        return detail
    }

    async updateLocation(id: number, token: string, data: vi_tri_dto) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        const checkLocal = await this.prisma.vi_tri.findFirst({
            where: {
                id
            }
        })
        if (!checkLocal) {
            throw new HttpException("Vị trí không tồn tại!!!", HttpStatus.UNAUTHORIZED)
        }
        const newData = await this.prisma.vi_tri.update({
            where: {
                id
            }, data
        })
        return newData

    }

    async deleteLocation(id: number, token: string) {
        const decodeToken = await this.JwtService.decode(token)
        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        const checkLocation = await this.prisma.vi_tri.findFirst({
            where: {
                id
            }
        })
        if (!checkLocation) {
            throw new HttpException("Vị trí không tồn tại!!!", HttpStatus.UNAUTHORIZED)
        }
        const deleteLocal = await this.prisma.vi_tri.delete({
            where: {
                id
            }
        })
        return deleteLocal
    }

    async uploadHinhViTri(id: number, file: Express.Multer.File, token: string) {
        const decodeToken = await this.JwtService.decode(token)
        const localImage = await compressImage(file, "/public/imgLocation/")

        const checkUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                id: decodeToken.data.id
            }
        })
        if (checkUser.role === "USER") {
            throw new HttpException("Quyền hạn không đủ !!!", HttpStatus.BAD_REQUEST)
        }
        const checkLocation = await this.prisma.vi_tri.findFirst({
            where: {
                id
            }
        })
        if (!checkLocation) {
            throw new HttpException("Vị trí không tồn tại!!!", HttpStatus.UNAUTHORIZED)
        }
        const uploadImg = await this.prisma.vi_tri.update({
            where: {
                id
            }, data: {
                hinh_anh: localImage.filename
            }
        })

        return uploadImg
    }
}
