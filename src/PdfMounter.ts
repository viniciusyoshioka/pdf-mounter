import fs from "node:fs"

import { Image, ImageProvider } from "./ImageProvider"
import { ImageResizer } from "./ImageResizer"
import { PageLayout, PageType, PostScript } from "./PostScript"


export type PdfMounterArguments = {
    pdf: PDFKit.PDFDocument
    imageProvider: ImageProvider
    imagesPath: string
    outputPath: string
    amountOfImagesPerPage?: number
}


export class PdfMounter {


    private pdf: PDFKit.PDFDocument
    private imageProvider: ImageProvider
    private imagesPath: string
    private outputStream: fs.WriteStream
    private amountOfImagesPerPage = 1


    constructor(args: PdfMounterArguments) {
        this.pdf = args.pdf
        this.imageProvider = args.imageProvider
        this.imagesPath = args.imagesPath
        this.outputStream = fs.createWriteStream(args.outputPath)
        if (args.amountOfImagesPerPage) {
            this.amountOfImagesPerPage = args.amountOfImagesPerPage
        }
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
            this.pdf.addPage({ ...this.pdf.options, layout: "portrait" })

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
            this.pdf.addPage({ ...this.pdf.options, layout: "landscape" })

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
