import { ApiProperty } from "@nestjs/swagger"

export class CreateNguoiDungDto { }


export class create_nguoi_dung {
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