
const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({

    endpoint,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }

})


const uploadArquivo = async (req, res) => {
    const { file } = req

    try {
        const time = Date.now().toString();
        const arquivo = await s3.upload({

            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `imagens/${time}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,

        }).promise()

        return res.json({
            url: arquivo.Location,

        })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro do servidor !' })

    }

}

const listarArquivos = async (req, res) => {

    try {
        const imagens = await s3.listObjects({
            Bucket: process.env.BACKBLAZE_BUCKET
        }).promise()

        const files = imagens.Contents.map((file) => {
            return {
                url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`,
                path: file.Key
            }
        })
        return res.json(files)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro do servidor !' })

    }
}


module.exports = {

    uploadArquivo,
    listarArquivos
}