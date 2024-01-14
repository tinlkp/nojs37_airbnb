import { ApiProperty } from "@nestjs/swagger"


export class create_book_room {
    @ApiProperty()
    ma_phong: number
    @ApiProperty()
    ngay_den: Date
    @ApiProperty()
    ngay_di: Date
    @ApiProperty()
    so_luong_khach: number
    @ApiProperty()
    ma_nguoi_dat: number
}