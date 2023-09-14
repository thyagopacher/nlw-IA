import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { createReadStream } from 'node:fs'
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async (request) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid()
    })

    // capturando o id do vídeo depois da validação
    const { videoId } = paramsSchema.parse(request.params)


    // O usuário envia junto do vídeo algumas palavras chave pelo front-end
    const bodySchema = z.object({
      prompt: z.string()
    })

    const { prompt } = bodySchema.parse(request.body)

    // "capturando" o arquivo de aúdio para fazer a transcrição
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })

    // pegando o caminho de onde o vídeo foi salvo
    const videoPath = video.path


    // Realizando a transcrição - OpenAi e streams
    const audioReadStream = createReadStream(videoPath)

    const openaiResponse = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    })

    const transcription = openaiResponse.text

    // Salvando o texto no db
    // Atualizando os dados onde o id do vídeo seja o videoID passado por parâmetro e enviando a transcription realizada pela OPENAI
    await prisma.video.update({
      where: {
        id: videoId
      },
      data: {
        transcription: transcription
      }
    })


    return { transcription }
  })
}