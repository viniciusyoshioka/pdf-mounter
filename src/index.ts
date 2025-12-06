import path from 'node:path'

import { ImageProvider } from './ImageProvider.ts'
import { PdfMounter } from './PdfMounter.ts'
import { CLI } from './cli.ts'


async function main() {
  const start = performance.now()

  const args = new CLI().getArgs()

  const imageProvider = new ImageProvider()
  const imagesPath = args['--images']
  const outputPath = path.join(args['--output-path'], args['--output-name'])
  const amountOfImagesPerPage = args['--amount-of-images-per-page']
  const rows = args['--rows']
  const columns = args['--columns']
  const mode = args['--mode']

  const pdfMounter = new PdfMounter({
    imageProvider,
    imagesPath,
    outputPath,
    amountOfImagesPerPage,
    rows,
    columns,
    mode,
  })

  try {
    await pdfMounter.start()
    console.log(`PDF generated successfully at "${outputPath}"`)
  } catch (error) {
    console.log('Error while generating PDF:', error)
  }

  const end = performance.now()
  const timeInMs = (end - start)
  const timeInSeconds = timeInMs / 1000
  const timeToPrint = timeInSeconds.toFixed(3)
  console.log(`Time elapsed: ${timeToPrint}s`)
}


main()
