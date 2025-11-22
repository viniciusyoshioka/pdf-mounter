import { describe, test } from '@jest/globals'
import PDFDocument from 'pdfkit'

import { ImageProvider } from '../src/ImageProvider.ts'
import { PdfMounter } from '../src/PdfMounter.ts'


describe('PdfMounter', () => {


  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pdf: PDFKit.PDFDocument
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let imageProvider: ImageProvider
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pdfMounter: PdfMounter

  const imagesPath = './assets/images'
  const outputPath = './assets/pdf/PdfMounter_test_output.pdf'
  const amountOfImagesPerPage = 4


  test('Prepare to instantiate PdfMounter', () => {
    pdf = new PDFDocument({ size: 'A4', autoFirstPage: false })
    imageProvider = new ImageProvider()
  })

  test('Instantiate PdfMounter', () => {
    const previousArgv = [...process.argv]
    process.argv.push('-i', imagesPath)
    process.argv.push('-o', outputPath)
    process.argv.push('-q', amountOfImagesPerPage.toString())

    pdfMounter = new PdfMounter({ pdf, imageProvider })

    process.argv = previousArgv
  })

  test('Mount PDF file', async () => {
    await pdfMounter.start()
  })
})
