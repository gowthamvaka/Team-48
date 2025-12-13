import { textEmbedding004 } from "@genkit-ai/googleai";

export async function generateEmbedding(text: string) {
  const embedder = textEmbedding004();
  const result = await embedder.embed({ text });
  return result.embeddings[0];
}
