import compress_images from "compress-images";
import fs from "fs";

export const compressImageAvatar = (file: Express.Multer.File) => {
    compress_images(
        process.cwd() + "/public/img/" + file.filename,
        process.cwd() + "/public/img/imgAvatar/",
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "10"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        {
            gif: {
                engine: "gifsicle",
                command: ["--colors", "64", "--use-col=web"],
            },
        },
        function (error, completed, statistic) {
            // nếu thành công thì xóa ảnh chưa được tối ưu đi
            console.log(error);
            if (completed) {
                const imgUnOptimized =
                    process.cwd() + "/public/img/" + file.filename;
                fs.unlink(imgUnOptimized, (err) => {
                    console.log(err);
                });
            }
        }
    );
}
