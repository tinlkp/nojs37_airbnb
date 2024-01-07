import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, nguoi_dung } from '@prisma/client';
import { signin, signup } from './dto/auth.dto';
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import hashSync from 'src/config/bcryptPassword';

@Injectable()
export class AuthService {
    constructor(private JwtService: JwtService) { }

    prisma = new PrismaClient()

    async signup(registerUser: signup): Promise<nguoi_dung> {

        let checkEmail = await this.prisma.nguoi_dung.findFirst({
            where: {
                email: registerUser.email
            }
        })
        if (checkEmail) {
            throw new HttpException("Email đã tồn tại !!!", HttpStatus.BAD_REQUEST)
        }
        let { email, pass_word, name, phone, birth_day, gender } = registerUser;
        const hashPassword = await hashSync(pass_word)
        const user = await this.prisma.nguoi_dung.create({
            data: {
                email,
                pass_word: hashPassword,
                name,
                phone,
                birth_day,
                gender,
                role: "USER",
            }
        })
        return user
    }


    async signin(LoginUser: signin): Promise<any> {
        const checkEmailUser = await this.prisma.nguoi_dung.findFirst({
            where: {
                email: LoginUser.email
            }
        })
        if (!checkEmailUser) {
            throw new HttpException("Email không đúng", HttpStatus.UNAUTHORIZED)
        }
        const checkPasswordUser = bcrypt.compareSync(LoginUser.pass_word, checkEmailUser.pass_word)
        if (!checkPasswordUser) {
            throw new HttpException("Password không đúng", HttpStatus.UNAUTHORIZED)
        }
        let token = this.JwtService.signAsync({
            data: {
                id: checkEmailUser.id
            }
        }, {
            expiresIn: "1d",
            secret: "BI_MAT",
        })


        return token
    }
}
