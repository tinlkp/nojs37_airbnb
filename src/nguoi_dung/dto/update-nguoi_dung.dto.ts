import { PartialType } from '@nestjs/mapped-types';
import { CreateNguoiDungDto } from './create-nguoi_dung.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNguoiDungDto extends PartialType(CreateNguoiDungDto) { }

export class update_nguoi_dung {
    @ApiProperty()
    id: number
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    pass_word: string
    @ApiProperty()
    phone: string
    @ApiProperty()
    birth_day: string
    @ApiProperty()
    gender: string
    @ApiProperty()
    role: string
}