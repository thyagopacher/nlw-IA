import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { openai } from "../lib/openai";

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (request, reply) => {
    // O usuário envia junto do vídeo algumas palavras chave pelo front-end
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { videoId, template, temperature } = bodySchema.parse(request.body)


    // Procurando o vídeo com o ID informado
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    // Caso o vídeo seja encontrado no db e ele não tenha nada na coluna transcription
    if (!video.transcription) {
      return reply.status(400).send({ error: 'Video transcription was not generated yet.' })
    }

    // Fazendo a troca de {transcription} por toda a transcrição do vídeo
    const promptMessagem = template.replace('{transcription}', video.transcription)


    // chamada para a openAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature: temperature,
      messages: [
        { role: 'user', content: promptMessagem },
      ]
    })

    return response
  })
}