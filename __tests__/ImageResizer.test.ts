import { describe, expect, test } from "@jest/globals"
import PDFDocument from "pdfkit"

import { ImageProvider } from "../src/ImageProvider"
import { ImageResizer, Size } from "../src/ImageResizer"
import { PageLayout, PageType, PostScript } from "../src/PostScript"
import { CLI } from "../src/cli"


describe("ImageResizer", () => {
    const imagesSize: Size[] = []
    let pageSize: Size
    let imageResizer: ImageResizer
    const imageResizers: ImageResizer[] = []

    test("Instantiating image resizer", async () => {
        const pdf = new PDFDocument({ size: "A4" })
        const imageProvider = new ImageProvider()
        await imageProvider.read("./assets/images")

        while (imageProvider.hasNext()) {
            const image = imageProvider.next()
            const width = image.metadata.width ?? 0
            const height = image.metadata.height ?? 0
            imagesSize.push({ width, height })
        }

        const pageType = pdf.page.size as PageType
        const pageLayout = pdf.page.layout as PageLayout
        pageSize = PostScript.getPageSizeBasedOnLayout(pageType, pageLayout)
        imageResizer = new ImageResizer({ imagesSize, pageSize })
    })

    test("Redimension landscape images", () => {
        const resizedImages = imageResizer.redimensionLandscapeImages()
        expect(resizedImages).toBeDefined()
    })

    test("Redimension portrait images", () => {
        const resizedImages = imageResizer.redimensionPortraitImages()
        expect(resizedImages).toBeDefined()
    })

    test("Instantiating new image resizers with specified cli", () => {
        const newImagesSize: Size[][] = []
        let couter = 0
        let index = 0
        for (let i = 0; i < imagesSize.length; i++) {
            if (couter === 0) {
                newImagesSize.push([])
            }
            if (couter < 4) {
                newImagesSize[index].push(imagesSize[i])
                couter++
            }
            if (couter === 4) {
                couter = 0
                index += 1
            }
        }

        const argv: string[] = [
            "-i",
            "../assets/images",
            "-p",
            "../assets/pdf",
            "--amount-of-images-per-page",
            "5",
            "--mode",
            "matrix",
            "--rows",
            "3",
            "--columns",
            "3",
        ]

        newImagesSize.forEach(imagesSizeItem => {
            const cli = new CLI(argv)
            const newImageResizer = new ImageResizer({ imagesSize: imagesSizeItem, pageSize, cli })
            imageResizers.push(newImageResizer)
        })

        expect(imageResizers.length).toBeGreaterThan(0)
    })

    test("Redimension landscape images on matrix --mode", () => {
        imageResizers.forEach(imageResizerItem => {
            const resizedImages = imageResizerItem.redimensionLandscapeImages()
            expect(resizedImages).toBeDefined()
        })
    })

    test("Redimension portrait images on matrix --mode", () => {
        imageResizers.forEach(imageResizerItem => {
            const resizedImages = imageResizerItem.redimensionPortraitImages()
            expect(resizedImages).toBeDefined()
        })
    })
})
