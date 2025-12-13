import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { gemini20Flash, textEmbedding004 } from "@genkit-ai/googleai";

const embedder = textEmbedding004();
const model = gemini20Flash();

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function ragQuery(query: string) {
  const qEmb = (await embedder.embed({ text: query })).embeddings[0];

  const snap = await getDocs(collection(db, "rag_docs"));
  const scored: any[] = [];

  snap.forEach((d) => {
    const data = d.data();
    scored.push({
      text: data.text,
      score: cosine(qEmb, data.embedding),
    });
  });

  scored.sort((a, b) => b.score - a.score);
  const context = scored.slice(0, 3).map((x) => x.text).join("\n");

  const prompt = `
Use ONLY the context below. If context is not enough, answer normally.

Context:
${context}

User: ${query}
  `;

  const response = await model.generate({ prompt });
  return {
    answer: response.text(),
    sources: scored.slice(0, 3),
  };
}
