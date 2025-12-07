import { describe, expect, test } from '@jest/globals'
import PDFDocument from 'pdfkit'

import { ImageProvider } from '../src/ImageProvider.ts'
import type { Size } from '../src/ImageResizer.ts'
import { ImageResizer } from '../src/ImageResizer.ts'
import type { PageLayout, PageType } from '../src/PostScript.ts'
import { PostScript } from '../src/PostScript.ts'
import { ArrangementMode, CLI } from '../src/cli.ts'


describe('ImageResizer', () => {
  const imagesSize: Size[] = []
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pageSize: Size
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let imageResizer: ImageResizer
  const columns = 1
  const rows = 1
  const mode = ArrangementMode.LINEAR
  const imageResizers: ImageResizer[] = []

  test('Instantiating image resizer', async () => {
    const pdf = new PDFDocument({ size: 'A4' })
    const imageProvider = new ImageProvider()
    await imageProvider.read('./assets/images')

    while (imageProvider.hasNext()) {
      const image = imageProvider.next()
      const { width, height } = image.metadata
      imagesSize.push({ width, height })
    }

    const pageType = pdf.page.size as PageType
    const pageLayout = pdf.page.layout as PageLayout
    pageSize = PostScript.getPageSizeBasedOnLayout(pageType, pageLayout)
    imageResizer = new ImageResizer({ imagesSize, pageSize, columns, rows, mode })
  })

  test('Redimension landscape images', () => {
    const resizedImages = imageResizer.redimensionLandscapeImages()
    expect(resizedImages).toBeDefined()
  })

  test('Redimension portrait images', () => {
    const resizedImages = imageResizer.redimensionPortraitImages()
    expect(resizedImages).toBeDefined()
  })

  test('Instantiating new image resizers with specified cli', () => {
    const newImagesSize: Size[][] = []
    let counter = 0
    let index = 0
    for (let i = 0; i < imagesSize.length; i++) {
      if (counter === 0) {
        newImagesSize.push([])
      }
      if (counter < 4) {
        newImagesSize[index].push(imagesSize[i])
        counter++
      }
      if (counter === 4) {
        counter = 0
        index += 1
      }
    }

    const argv: string[] = [
      '-i',
      '../assets/images',
      '-p',
      '../assets/pdf',
      '--amount-of-images-per-page',
      '5',
      '--mode',
      'matrix',
      '--rows',
      '3',
      '--columns',
      '3',
    ]

    newImagesSize.forEach(imagesSizeItem => {
      const args = new CLI(argv).getArgs()

      const newImageResizer = new ImageResizer({
        imagesSize: imagesSizeItem,
        pageSize,
        columns: args['--columns'],
        rows: args['--rows'],
        mode: args['--mode'],
      })

      imageResizers.push(newImageResizer)
    })

    expect(imageResizers.length).toBeGreaterThan(0)
  })

  test('Redimension landscape images on matrix --mode', () => {
    imageResizers.forEach(imageResizerItem => {
      const resizedImages = imageResizerItem.redimensionLandscapeImages()
      expect(resizedImages).toBeDefined()
    })
  })

  test('Redimension portrait images on matrix --mode', () => {
    imageResizers.forEach(imageResizerItem => {
      const resizedImages = imageResizerItem.redimensionPortraitImages()
      expect(resizedImages).toBeDefined()
    })
  })
})
