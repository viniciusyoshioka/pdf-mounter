import { describe, expect, test } from "@jest/globals"
import PDFDocument from "pdfkit"

import { ImageProvider } from "../src/ImageProvider"
import { ImageResizer, Size } from "../src/ImageResizer"
import { PageLayout, PageType, PostScript } from "../src/PostScript"


describe("ImageResizer", () => {
    let imageResizer: ImageResizer

    test("Instantiating image resizer", async () => {
        const pdf = new PDFDocument({ size: "A4" })
        const imageProvider = new ImageProvider()
        await imageProvider.read("./assets/images")

        const imagesSize: Size[] = []
        while (imageProvider.hasNext()) {
            const image = imageProvider.next()
            const width = image.metadata.width ?? 0
            const height = image.metadata.height ?? 0
            imagesSize.push({ width, height })
        }

        const pageType = pdf.page.size as PageType
        const pageLayout = pdf.page.layout as PageLayout
        const pageSize = PostScript.getPageSizeBasedOnLayout(pageType, pageLayout)
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
})
