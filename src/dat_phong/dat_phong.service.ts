import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatPhongService {
    constructor(private JwtService: JwtService) { }
    prisma = new PrismaClient()

    async findAllBookRoom() {
        let data = await this.prisma.dat_phong.findMany()
        return data
    }

    async postBookRoom() {

    }

    async bookRoomDetail() {

    }

    async updateBookRoom() {

    }

    async deleteBookRoom() {

    }

    async findBookRoomByIdUser() {

    }
}

