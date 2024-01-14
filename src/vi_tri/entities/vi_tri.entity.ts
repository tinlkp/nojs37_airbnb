import { ApiProperty } from "@nestjs/swagger"



export class vi_tri_create {
    @ApiProperty()
    ten_vi_tri: string
    @ApiProperty()
    tinh_thanh: string
    @ApiProperty()
    quoc_gia: string
}
