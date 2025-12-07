import { describe, test } from '@jest/globals'
import path from 'node:path'

import { ImageProvider } from '../src/ImageProvider.ts'
import { PdfMounter } from '../src/PdfMounter.ts'
import { ArrangementMode, CLI } from '../src/cli.ts'


describe('PdfMounter', () => {


  // eslint-disable-next-line @typescript-eslint/init-declarations
  let imageProvider: ImageProvider
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pdfMounter: PdfMounter

  const imagesPath = './assets/images'
  const outputPath = './assets/pdf/PdfMounter_test_output.pdf'
  const amountOfImagesPerPage = 4
  const rows = 1
  const columns = 1
  const mode = ArrangementMode.LINEAR


  test('Prepare to instantiate PdfMounter', () => {
    imageProvider = new ImageProvider()
  })

  test('Instantiate PdfMounter', () => {
    const argv = [...process.argv]
    argv.push('-i', imagesPath)
    argv.push('-o', outputPath)
    argv.push('-q', amountOfImagesPerPage.toString())
    argv.push('-r', rows.toString())
    argv.push('-c', columns.toString())
    argv.push('-m', mode)

    const args = new CLI(argv).getArgs()

    pdfMounter = new PdfMounter({
      imageProvider,
      imagesPath: args['--images'],
      outputPath: path.join(args['--output-path'], args['--output-name']),
      amountOfImagesPerPage: args['--amount-of-images-per-page'],
      rows: args['--rows'],
      columns: args['--columns'],
      mode: args['--mode'],
    })
  })

  test('Mount PDF file', async () => {
    await pdfMounter.start()
  })
})
