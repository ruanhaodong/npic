// const OSS = require('ali-oss')
// const path = require("path")
import OSS from 'ali-oss';

interface OSSImage {
    name: string,
    url: string
}

console.log(process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID);
console.log(process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET);
const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: "oss-cn-shanghai",
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: "LTAI5tDitqgjqGSVekqmWN6T",
    accessKeySecret: "TrsWgJ1tqMSrCImEQgnRNjQxikbGp9",
    // 填写Bucket名称。
    bucket: "xinvtech",
    secure: true,
});

const headers = {
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'private',
    // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.jpg。
    // 'Content-Disposition': 'attachment; filename="example.jpg"'
    // 设置Object的标签，可同时设置多个标签。
    'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'true',
};

async function put(file: any): Promise<OSSImage> {
    return new Promise(async(resolve, reject) => {
        const timestamp = new Date().getTime()
        const filename = `npcepic/map/${timestamp}.png`

        try {
            // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
            // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
            const result = await client.put(filename, file);
            // console.log(result);
            resolve(result)
        } catch (e) {
            // console.log(e);
            reject(e)
        }
    })
}

export {
    put
}