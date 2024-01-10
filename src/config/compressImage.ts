import * as compressImages from 'compress-images';
import * as fs from "fs";

export const compressImage = async (file: Express.Multer.File, adress: string) => {

    await compressImages(
        process.cwd() + "/public/img/" + file.filename,
        process.cwd() + adress,
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        {
            gif: {
                engine: "gifsicle",
                command: ["--colors", "64", "--use-col=web"],
            },
        },
        function (error, completed: any, statistic) {
            // nếu thành công thì xóa ảnh chưa được tối ưu đi
            if (completed) {
                const imgUnOptimized = process.cwd() + "/public/img/" + file.filename;
                fs.unlink(imgUnOptimized, (err) => {
                    console.log(err);
                });
            }
        }
    );
    return file
}



