import { UnitConversor } from "./UnitConversor"
import { ArrangementMode, CLI, ParsedArgs, args } from "./cli"


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
    cli?: CLI
}


export class ImageResizer {


    private page: Size
    private original: Size[]
    private resized: ResizedImage[] = []
    private amountOfImages: number

    private parsedArgs: ParsedArgs = args
    private mode: ArrangementMode
    private rows: number
    private columns: number


    constructor(options: ImageResizerArgs) {
        this.page = options.pageSize
        this.original = options.imagesSize
        this.amountOfImages = options.imagesSize.length

        const cliArgs = options.cli?.getArgs()
        if (cliArgs) {
            this.parsedArgs = cliArgs
        }
        this.mode = this.parsedArgs["--mode"]
        this.rows = this.parsedArgs["--rows"]
        this.columns = this.parsedArgs["--columns"]
    }


    redimensionLandscapeImages(): ResizedImage[] {
        const gapInPs = Math.round(UnitConversor.cmToPs(0.25))

        const pageRows = this.mode === "linear" ? this.amountOfImages : this.rows
        const pageColumns = this.mode === "linear" ? 1 : this.columns

        const maxImageWidth = (this.page.width - ((pageColumns - 1) * gapInPs)) / pageColumns
        const maxImageHeight = (this.page.height - ((pageRows - 1) * gapInPs)) / pageRows

        let posX = 0
        let posY = 0

        let newImageWidth = 0
        let newImageHeight = 0

        const biggestImageWidth = 0
        let biggestImageHeight = 0

        let processedImageIndex = 0
        for (let i = 0; i < pageRows; i++) {
            for (let j = 0; j < pageColumns; j++) {
                if (processedImageIndex >= this.amountOfImages) {
                    break
                }

                const image = this.original[processedImageIndex]
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

                posX += newImageWidth + gapInPs
                if (newImageHeight > biggestImageHeight) {
                    biggestImageHeight = newImageHeight
                }
                processedImageIndex += 1
            }

            posX = 0
            posY += biggestImageHeight + gapInPs
        }

        return this.resized
    }

    redimensionPortraitImages(): ResizedImage[] {
        const gapInPs = Math.round(UnitConversor.cmToPs(0.25))

        const pageRows = this.mode === "linear" ? 1 : this.rows
        const pageColumns = this.mode === "linear" ? this.amountOfImages : this.columns

        const maxImageWidth = (this.page.width - ((pageColumns - 1) * gapInPs)) / pageColumns
        const maxImageHeight = (this.page.height - ((pageRows - 1) * gapInPs)) / pageRows

        let posX = 0
        let posY = 0

        let newImageHeight = 0
        let newImageWidth = 0

        const biggestImageWidth = 0
        let biggestImageHeight = 0

        let processedImageIndex = 0
        for (let i = 0; i < pageRows; i++) {
            for (let j = 0; j < pageColumns; j++) {
                if (processedImageIndex >= this.amountOfImages) {
                    break
                }

                const image = this.original[processedImageIndex]
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

                posX += newImageWidth + gapInPs
                if (newImageHeight > biggestImageHeight) {
                    biggestImageHeight = newImageHeight
                }
                processedImageIndex += 1
            }

            posX = 0
            posY += biggestImageHeight + gapInPs
        }

        return this.resized
    }
}
