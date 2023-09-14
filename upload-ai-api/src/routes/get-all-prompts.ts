import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

// O fastify exige que seja async
export async function getAllPromptsRoute(app: FastifyInstance) {
  app.get('/prompts', async () => {
    const promps = await prisma.prompt.findMany()

    return promps
  })
}