import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from "../lib/prisma";
import path from "node:path";
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  // registrando o módulo do fastifyMultipart na aplicação e passando um objeto de configurações
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 50 // 50 mb
    }
  })


  app.post('/videos', async (request, reply) => {
    // data vai armazenar o arquivo enviado
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input.' })
    }

    // fileExtension vai retornar a extensão do arquivo enviado pelo usuário
    const fileExtension = path.extname(data.filename)

    // Estamos chamando mp3 por que o front end já vai converter de mp4 para mp3
    if (fileExtension !== '.mp3') {
      return reply.status(400).send({ error: 'Invalid input type.' })
    }

    // Alterando o nome do arquivo para não gerar conflito
    // example.mp3
    // fileBaseName => example

    const fileBaseName = path.basename(data.filename, fileExtension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${fileExtension}`
    // como vai ficar: example-IDRANDOMmp3

    // Local onde vai ficar salvo os arquivos que tiveram seu upload validado
    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)


    // Aguardando o pipeline de upload do arquivo
    await pump(data.file, fs.createWriteStream(uploadDestination))


    // Criando o registro no db
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return { video }
  })
}