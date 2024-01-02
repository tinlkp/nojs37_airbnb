import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { signin, signup } from './dto/auth.dto';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(private JwtService: JwtService) { }

    prisma = new PrismaClient()

    async signup(email: string, pass_word: string, name: string, phone: string, birth_day: string, gender: string) {

        let checkEmail = await this.prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        })
        if (checkEmail) {
            throw new HttpException("Email đã tồn tại", 400)
        } else {
            const data = await this.prisma.nguoi_dung.create({
                data: {
                    email,
                    pass_word,
                    name,
                    phone,
                    birth_day,
                    gender,
                    role: "USER"
                }
            })
            return data
        }



    }

    async signin(email: string, pass_word: string) {

        let checkEmailUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                email,
                pass_word
            }
        })
        if (!checkEmailUser) {
            throw new HttpException("Email hoặc mật khẩu không đúng !!!", 400)
        } else {
            let token = this.JwtService.signAsync({
                data: { id: checkEmailUser.id }
            }, {
                expiresIn: "1d", secret: "BI_MAT"
            })
            return token
        }
    }
}
