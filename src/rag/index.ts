import { googleAI } from "@genkit-ai/google-genai";
import { initializeFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const embedModel = googleAI.embedder("text-embedding-004");
const { firestore } = initializeFirebase();

export async function embedAndStore(id: string, text: string) {
  const result = await embedModel.embed(text);
  const vector = result;

  await setDoc(doc(firestore, "rag_docs", id), {
    text,
    embedding: vector,
  });

  return "Stored successfully";
}
