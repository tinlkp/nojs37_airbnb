export class NguoiDung {
}

export type nguoi_dung = {
    id: number,
    name: string,
    email: string,
    pass_word: string,
    phone: string,
    birth_day: string,
    gender: string,
    role: string,
    avatar: null,
}
export type nguoi_dung_id = {
    id: number,
    name: string,
    email: string,
    pass_word: string,
    phone: string,
    birth_day: string,
    gender: string,
    role: string,
    avatar: string,
}

export type Avatar = {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}