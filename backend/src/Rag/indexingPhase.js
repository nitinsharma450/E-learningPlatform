import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantClient } from "@qdrant/js-client-rest";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Qdrant client
const client = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

// Embeddings model
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2"
});

// Text splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Process one PDF file
async function processSinglePDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdf(dataBuffer);
  const text = pdfData.text;

  const docs = await splitter.createDocuments([text]);

  for (let i = 0; i < docs.length; i++) {
    const vector = await embeddings.embedQuery(
      docs[i].pageContent || docs[i].text || ""
    );

    await client.upsert({
      collection_name: process.env.QDRANT_COLLECTION || "learning_rag",
      points: [
        {
          id: `${pdfPath}-${i}`,
          payload: {
            text: docs[i].pageContent || docs[i].text,
            fileName: path.basename(pdfPath),
            chunk: i,
          },
          vector,
        },
      ],
    });
  }

  console.log(`Indexed: ${path.basename(pdfPath)} (${docs.length} chunks)`);
}

// Process all PDFs in your folder
async function indexAllPDFs() {
  const pdfFolder = path.join(__dirname, "..", "..", "public", "course", "pdfs");

  const files = fs.readdirSync(pdfFolder).filter(f => f.endsWith(".pdf"));
  if (files.length === 0) {
    console.log("❌ No PDFs found in folder:", pdfFolder);
    return;
  }

  for (const file of files) {
    await processSinglePDF(path.join(pdfFolder, file));
  }

  console.log("✅ All PDFs indexed successfully!");
}

indexAllPDFs();
