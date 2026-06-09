/**
 * Browser-side file text extraction utility
 */

/** Read a file as ArrayBuffer */
function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}

/** Extract text from a PDF file using pdf.js */
async function extractPDF(file: File): Promise<string> {
  const arrayBuffer = await readAsArrayBuffer(file)
  const pdfjsLib = await import("pdfjs-dist")
  
  // Set worker path for browser
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js"
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ""
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(" ")
    text += pageText + "\n\n"
  }
  
  return text.trim()
}

/** Extract text from a DOCX file using mammoth */
async function extractDOCX(file: File): Promise<string> {
  const arrayBuffer = await readAsArrayBuffer(file)
  const mammoth = await import("mammoth")
  
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

/** Extract text from a TXT file */
async function extractTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read text file"))
    reader.readAsText(file)
  })
}

/** Main extractor: detect file type and extract text */
export async function extractFileText(file: File): Promise<{
  text: string
  type: string
  fileName: string
}> {
  const name = file.name.toLowerCase()
  let text: string
  
  if (name.endsWith(".pdf")) {
    text = await extractPDF(file)
    return { text, type: "pdf", fileName: file.name }
  } else if (name.endsWith(".docx")) {
    text = await extractDOCX(file)
    return { text, type: "docx", fileName: file.name }
  } else if (name.endsWith(".txt") || name.endsWith(".md")) {
    text = await extractTXT(file)
    return { text, type: "txt", fileName: file.name }
  } else {
    throw new Error("不支持的文件格式，请使用 PDF、Word (.docx) 或 TXT 文件")
  }
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

/** Check if file type is supported */
export function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".txt") || name.endsWith(".md")
}
