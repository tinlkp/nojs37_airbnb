import { diskStorage } from 'multer';

const upload = {
    storage: diskStorage({
        destination: process.cwd() + "/public/img",
        filename: (req, file, callback) => {
            callback(null, Date.now() + "_" + file.originalname)
            return req
        }
    })
}

export default upload