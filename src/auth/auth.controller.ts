import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signin, signup } from './dto/auth.dto';
import { nguoi_dung } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('/signup')
  signUp(@Body() registerUser: signup): Promise<nguoi_dung> {
    try {
      return this.authService.signup(registerUser)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @HttpCode(200)
  @Post('/signin')
  signin(@Body() LoginUser: signin): Promise<any> {
    try {
      return this.authService.signin(LoginUser)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
