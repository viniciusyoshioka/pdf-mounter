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
        pdfMounter = new PdfMounter({
            pdf,
            imageProvider,
            imagesPath,
            outputPath,
            amountOfImagesPerPage,
        })
    })

    test("Mount PDF file", async () => {
        await pdfMounter.start()
    })
})
