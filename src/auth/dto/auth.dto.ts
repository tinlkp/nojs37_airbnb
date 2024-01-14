import { ApiProperty } from "@nestjs/swagger"

export class signup {
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

export class signin {
    @ApiProperty()
    email: string
    @ApiProperty()
    pass_word: string
}