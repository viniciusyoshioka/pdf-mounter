import fs from "node:fs"
import path from "node:path"

import { Image, ImageProvider } from "./ImageProvider"
import { ImageResizer } from "./ImageResizer"
import { PageLayout, PageType, PostScript } from "./PostScript"
import { ArrangementMode, CLI, args } from "./cli"


export type PdfMounterArguments = {
  pdf: PDFKit.PDFDocument
  imageProvider: ImageProvider
  cli?: CLI
}


export class PdfMounter {


  private pdf: PDFKit.PDFDocument
  private imageProvider: ImageProvider
  private parsedArgs = args

  private imagesPath: string
  private outputPath: string
  private outputStream: fs.WriteStream
  private amountOfImagesPerPage: number
  private mode: ArrangementMode


  constructor(options: PdfMounterArguments) {
    this.pdf = options.pdf
    this.imageProvider = options.imageProvider

    const cliArgs = options.cli?.getArgs()
    if (cliArgs) {
      this.parsedArgs = cliArgs
    }

    this.imagesPath = this.parsedArgs["--images"]
    const outputDir = this.parsedArgs["--output-path"]
    const outputFile = this.parsedArgs["--output-name"]
    this.outputPath = path.join(outputDir, outputFile)
    this.outputStream = fs.createWriteStream(this.outputPath)
    this.amountOfImagesPerPage = this.parsedArgs["--amount-of-images-per-page"]
    this.mode = this.parsedArgs["--mode"]
  }


  async start() {
    if (this.imageProvider.isEmpty()) {
      await this.imageProvider.read(this.imagesPath)
    }

    this.addLandscapeImages()
    this.addPortraitImages()

    this.pdf.pipe(this.outputStream)
    this.pdf.end()
  }


  private addLandscapeImages() {
    while (this.imageProvider.hasNextLandscape()) {
      if (this.mode === "linear") {
        this.pdf.addPage({ ...this.pdf.options, layout: "portrait" })
      } else {
        this.pdf.addPage({ ...this.pdf.options, layout: "landscape" })
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
          width: image.metadata.width as number,
          height: image.metadata.height as number,
        })),
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
      if (this.mode === "linear") {
        this.pdf.addPage({ ...this.pdf.options, layout: "landscape" })
      } else {
        this.pdf.addPage({ ...this.pdf.options, layout: "portrait" })
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
          width: image.metadata.width as number,
          height: image.metadata.height as number,
        })),
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
