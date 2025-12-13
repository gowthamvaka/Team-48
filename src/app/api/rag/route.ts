import { ragQuery } from "@/rag/query";

export async function POST(req: Request) {
  const { query } = await req.json();
  const result = await ragQuery(query);
  return Response.json(result);
}
