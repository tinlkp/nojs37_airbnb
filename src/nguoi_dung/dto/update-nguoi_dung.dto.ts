import { PartialType } from '@nestjs/mapped-types';
import { CreateNguoiDungDto } from './create-nguoi_dung.dto';

export class UpdateNguoiDungDto extends PartialType(CreateNguoiDungDto) {}
