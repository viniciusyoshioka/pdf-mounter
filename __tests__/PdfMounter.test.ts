import { describe, test } from "@jest/globals"
import PDFDocument from "pdfkit"

import { ImageProvider } from "../src/ImageProvider"
import { PdfMounter } from "../src/PdfMounter"


describe("PdfMounter", () => {


  let pdf: PDFKit.PDFDocument
  let imageProvider: ImageProvider
  let pdfMounter: PdfMounter

  const imagesPath = "./assets/images"
  const outputPath = "./assets/pdf/PdfMounter_test_output.pdf"
  const amountOfImagesPerPage = 4


  test("Prepare to instantiate PdfMounter", () => {
    pdf = new PDFDocument({ size: "A4", autoFirstPage: false })
    imageProvider = new ImageProvider()
  })

  test("Instantiate PdfMounter", () => {
    const previousArgv = [...process.argv]
    process.argv.push("-i", imagesPath)
    process.argv.push("-o", outputPath)
    process.argv.push("-q", amountOfImagesPerPage.toString())

    pdfMounter = new PdfMounter({ pdf, imageProvider })

    process.argv = previousArgv
  })

  test("Mount PDF file", async () => {
    await pdfMounter.start()
  })
})
