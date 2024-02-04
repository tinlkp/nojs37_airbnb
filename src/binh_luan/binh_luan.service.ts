import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, binh_luan } from '@prisma/client';
import { binh_luan_entity } from './entities/binh_luan.entity';

@Injectable()
export class BinhLuanService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()

    // danh sách bình luận
    async findAllComment(): Promise<binh_luan[]> {
        let data = await this.prisma.binh_luan.findMany()
        return data
    }

    // tạo bình luận
    async postComment(token: string, data: binh_luan_entity) {
        const decodeToken = await this.JwtService.decode(token)
        let { ma_phong, noi_dung, sao_binh_luan } = data
        const comment = await this.prisma.binh_luan.create({
            data: {
                ma_phong,
                ma_nguoi_binh_luan: decodeToken.data.id,
                ngay_binh_luan: new Date(),
                noi_dung,
                sao_binh_luan
            }
        })
        return comment
    }
    // cập nhật bình luận
    async updateComment(token: string, id: number, data: binh_luan_entity) {
        const decodeToken = await this.JwtService.decode(token)
        let checkComment = await this.prisma.binh_luan.findFirst({
            where: {
                id
            }
        })
        if (!checkComment) {
            throw new HttpException("Bình luận không tồn tại", HttpStatus.UNAUTHORIZED)
        }
        let checkUser = await this.prisma.binh_luan.findFirst({
            where: {
                ma_nguoi_binh_luan: decodeToken.data.id,
            }
        })
        if (!checkUser) {
            throw new HttpException("Không được chỉnh sửa bình luận của người dùng khác", HttpStatus.BAD_REQUEST)
        }
        let { ma_phong, noi_dung, sao_binh_luan, ngay_binh_luan } = data
        const newComment = await this.prisma.binh_luan.update({
            where: {
                id
            }, data: {
                ma_nguoi_binh_luan: decodeToken.data.id,
                ma_phong,
                noi_dung,
                ngay_binh_luan,
                sao_binh_luan
            }
        })
        return newComment
    }
    // xóa bình luận
    async deleteComment(token: string, id: number) {
        const decodeToken = await this.JwtService.decode(token)

        const checkComment = await this.prisma.binh_luan.findFirst({
            where: {
                id
            }
        })
        if (!checkComment) {
            throw new HttpException("Bình luận không tồn tại", HttpStatus.UNAUTHORIZED)
        }
        const checkUser = await this.prisma.binh_luan.findFirst({
            where: {
                ma_nguoi_binh_luan: decodeToken.data.id,
            }
        })
        if (!checkUser) {
            throw new HttpException("Người dùng không đuọc phép xóa", HttpStatus.BAD_REQUEST)
        }

        const delComment = await this.prisma.binh_luan.delete({
            where: {
                id
            }
        })
        return delComment
    }
    // tìm bình luận theo mã phòng
    async searchCommentByRoomId(roomId: number): Promise<binh_luan[]> {
        let data = await this.prisma.binh_luan.findMany({
            where: {
                ma_phong: roomId
            },
            include: {
                nguoi_dung: true
            }
        })
        return data
    }
}
