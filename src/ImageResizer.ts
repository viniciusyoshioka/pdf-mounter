import { UnitConversor } from "./UnitConversor"


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

        const posX = 0
        let posY = 0

        const maxImageWidth = this.page.width
        const maxImageHeight = (this.page.height / this.amountOfImages) - paddingInPs

        for (let i = 0; i < this.amountOfImages; i++) {
            const image = this.original[i]
            const imageRatio = image.width / image.height

            let newImageWidth = this.page.width
            let newImageHeight = this.page.width / imageRatio
            if (newImageHeight > maxImageHeight) {
                newImageHeight = maxImageHeight
                newImageWidth = newImageHeight * imageRatio
            }

            this.resized.push({
                x: posX,
                y: posY,
                width: newImageWidth,
                height: newImageHeight,
            })

            posY += newImageHeight + paddingInPs
        }

        return this.resized
    }

    redimensionPortraitImages(): ResizedImage[] {
        const paddingInPs = UnitConversor.cmToPs(0.25)

        let posX = 0
        const posY = 0

        const maxImageHeight = this.page.height
        const maxImageWidth = (this.page.width / this.amountOfImages) - paddingInPs

        for (let i = 0; i < this.amountOfImages; i++) {
            const image = this.original[i]
            const imageRatio = image.width / image.height

            let newImageHeight = this.page.height
            let newImageWidth = this.page.height * imageRatio
            if (newImageWidth > maxImageWidth) {
                newImageWidth = maxImageWidth
                newImageHeight = newImageWidth / imageRatio
            }

            this.resized.push({
                x: posX,
                y: posY,
                width: newImageWidth,
                height: newImageHeight,
            })

            posX += newImageWidth + paddingInPs
        }

        return this.resized
    }
}
