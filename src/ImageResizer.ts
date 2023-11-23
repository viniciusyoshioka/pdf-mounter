import { UnitConversor } from "./UnitConversor"
import { args } from "./cli"


export type Size = {
    width: number
    height: number
}


export type ResizedImage = {
    x: number
    y: number
    width: number
    height: number
}


export type ImageResizerArgs = {
    pageSize: Size
    imagesSize: Size[]
}


export class ImageResizer {


    private amountOfImages: number
    private mode = args["--mode"]
    private rows = args["--rows"]
    private columns = args["--columns"]
    private page: Size
    private original: Size[]
    private resized: ResizedImage[] = []


    constructor(args: ImageResizerArgs) {
        this.amountOfImages = args.imagesSize.length
        this.page = args.pageSize
        this.original = args.imagesSize
    }


    redimensionLandscapeImages(): ResizedImage[] {
        const paddingInPs = UnitConversor.cmToPs(0.5)

        const pageRows = this.mode === "linear" ? this.amountOfImages : this.rows
        const pageColumns = this.mode === "linear" ? 1 : this.columns

        const maxImageWidth = (this.page.width / pageColumns) - paddingInPs
        const maxImageHeight = (this.page.height / pageRows) - paddingInPs

        let posX = 0
        let posY = 0

        let newImageWidth = 0
        let newImageHeight = 0

        let index = 0
        for (let i = 0; i < pageRows; i++) {
            for (let j = 0; j < pageColumns; j++) {
                if (index >= this.amountOfImages) {
                    break
                }

                const image = this.original[index]
                const imageRatio = image.width / image.height

                newImageWidth = maxImageWidth
                newImageHeight = maxImageWidth / imageRatio
                if (newImageHeight > maxImageHeight) {
                    newImageHeight = maxImageHeight
                    newImageWidth = maxImageHeight * imageRatio
                }

                this.resized.push({
                    x: posX,
                    y: posY,
                    width: newImageWidth,
                    height: newImageHeight,
                })

                posX += newImageWidth + paddingInPs
                index += 1
            }

            posX = 0
            posY += newImageHeight + paddingInPs
        }

        return this.resized
    }

    redimensionPortraitImages(): ResizedImage[] {
        const paddingInPs = UnitConversor.cmToPs(0.25)

        const pageRows = this.mode === "linear" ? 1 : this.rows
        const pageColumns = this.mode === "linear" ? this.amountOfImages : this.columns

        const maxImageWidth = (this.page.width / pageColumns) - paddingInPs
        const maxImageHeight = (this.page.height / pageRows) - paddingInPs

        let posX = 0
        let posY = 0

        let newImageHeight = 0
        let newImageWidth = 0

        let index = 0
        for (let i = 0; i < pageRows; i++) {
            for (let j = 0; j < pageColumns; j++) {
                if (index >= this.amountOfImages) {
                    break
                }

                const image = this.original[i]
                const imageRatio = image.width / image.height

                newImageHeight = maxImageHeight
                newImageWidth = maxImageHeight * imageRatio
                if (newImageWidth > maxImageWidth) {
                    newImageWidth = maxImageWidth
                    newImageHeight = maxImageWidth / imageRatio
                }

                this.resized.push({
                    x: posX,
                    y: posY,
                    width: newImageWidth,
                    height: newImageHeight,
                })

                posX += newImageWidth + paddingInPs
                index += 1
            }

            posX = 0
            posY += newImageHeight + paddingInPs
        }

        return this.resized
    }
}
