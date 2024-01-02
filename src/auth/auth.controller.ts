import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signin, signup } from './dto/auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('/signup')
  signUp(@Req() req: Request) {
    try {
      let { email, pass_word, name, phone, birth_day, gender } = req.body;
      return this.authService.signup(email, pass_word, name, phone, birth_day, gender)
    } catch (exception) {
      if (exception.status != 500) {
        throw new HttpException(exception.response, exception.status)
      }
      throw new HttpException("Lỗi...", HttpStatus.INTERNAL_SERVER_ERROR)
    }


  }

  @HttpCode(200)
  @Post('/signin')
  signin(@Req() req: Request) {
    try {
      let { email, pass_word } = req.body;
      return this.authService.signin(email, pass_word)
    } catch (exception) {
      if (exception.status != 500) {
        throw new HttpException(exception.response, exception.status)
      }
      throw new HttpException("Lỗi...", HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

}
