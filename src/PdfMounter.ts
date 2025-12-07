import fs from 'node:fs'
import PDFDocument from 'pdfkit'

import type { Image, ImageProvider } from './ImageProvider.ts'
import { ImageResizer } from './ImageResizer.ts'
import type { PageLayout, PageType } from './PostScript.ts'
import { PostScript } from './PostScript.ts'
import { ArrangementMode } from './cli.ts'


export type PdfMounterArguments = {
  imageProvider: ImageProvider

  imagesPath: string
  outputPath: string
  amountOfImagesPerPage: number
  rows: number
  columns: number
  mode: ArrangementMode
}


export class PdfMounter {


  private readonly pdf = new PDFDocument({ size: 'A4', autoFirstPage: false })
  private readonly imageProvider: ImageProvider

  private readonly imagesPath: string
  private readonly outputPath: string
  private readonly amountOfImagesPerPage: number
  private readonly rows: number
  private readonly columns: number
  private readonly mode: ArrangementMode


  constructor(options: PdfMounterArguments) {
    this.imageProvider = options.imageProvider

    this.imagesPath = options.imagesPath
    this.outputPath = options.outputPath
    this.amountOfImagesPerPage = options.amountOfImagesPerPage
    this.rows = options.rows
    this.columns = options.columns
    this.mode = options.mode
  }


  async start() {
    if (this.imageProvider.isEmpty()) {
      await this.imageProvider.read(this.imagesPath)
    }
    if (this.imageProvider.isEmpty()) {
      return
    }

    this.addLandscapeImages()
    this.addPortraitImages()

    const outputStream = fs.createWriteStream(this.outputPath)
    this.pdf.pipe(outputStream)

    this.pdf.end()
    await new Promise<void>((resolve, reject) => {
      this.pdf.on('end', () => resolve())
      this.pdf.on('error', (error: unknown) => reject(error as Error))
    })

    outputStream.end()
  }


  private addLandscapeImages() {
    while (this.imageProvider.hasNextLandscape()) {
      if (this.mode === ArrangementMode.LINEAR) {
        this.pdf.addPage({ ...this.pdf.options, layout: 'portrait' })
      } else {
        this.pdf.addPage({ ...this.pdf.options, layout: 'landscape' })
      }

      const imagesToAddToPage: Image[] = []
      for (let i = 0; i < this.amountOfImagesPerPage; i++) {
        if (this.imageProvider.hasNextLandscape()) {
          imagesToAddToPage.push(this.imageProvider.nextLandscape())
        } else {
          break
        }
      }

      const pageType = this.pdf.page.size as PageType
      const pageLayout = this.pdf.page.layout as PageLayout
      const pageSize = PostScript.getPageSizeBasedOnLayout(pageType, pageLayout)
      const imageResizer = new ImageResizer({
        pageSize,
        imagesSize: imagesToAddToPage.map(image => ({
          width: image.metadata.width,
          height: image.metadata.height,
        })),
        rows: this.rows,
        columns: this.columns,
        mode: this.mode,
      })
      const resizedImages = imageResizer.redimensionLandscapeImages()

      for (let i = 0; i < imagesToAddToPage.length; i++) {
        const image = imagesToAddToPage[i]
        const resizedImage = resizedImages[i]

        this.pdf.image(image.path, resizedImage.x, resizedImage.y, {
          width: resizedImage.width,
          height: resizedImage.height,
        })
      }
    }
  }

  private addPortraitImages() {
    while (this.imageProvider.hasNextPortrait()) {
      if (this.mode === ArrangementMode.LINEAR) {
        this.pdf.addPage({ ...this.pdf.options, layout: 'landscape' })
      } else {
        this.pdf.addPage({ ...this.pdf.options, layout: 'portrait' })
      }

      const imagesToAddToPage: Image[] = []
      for (let i = 0; i < this.amountOfImagesPerPage; i++) {
        if (this.imageProvider.hasNextPortrait()) {
          imagesToAddToPage.push(this.imageProvider.nextPortrait())
        } else {
          break
        }
      }

      const pageType = this.pdf.page.size as PageType
      const pageLayout = this.pdf.page.layout as PageLayout
      const pageSize = PostScript.getPageSizeBasedOnLayout(pageType, pageLayout)
      const imageResizer = new ImageResizer({
        pageSize,
        imagesSize: imagesToAddToPage.map(image => ({
          width: image.metadata.width,
          height: image.metadata.height,
        })),
        rows: this.rows,
        columns: this.columns,
        mode: this.mode,
      })
      const resizedImages = imageResizer.redimensionPortraitImages()

      for (let i = 0; i < imagesToAddToPage.length; i++) {
        const image = imagesToAddToPage[i]
        const resizedImage = resizedImages[i]

        this.pdf.image(image.path, resizedImage.x, resizedImage.y, {
          width: resizedImage.width,
          height: resizedImage.height,
        })
      }
    }
  }
}
