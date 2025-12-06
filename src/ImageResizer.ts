import { UnitConversor } from './UnitConversor.ts'
import { ArrangementMode } from './cli.ts'


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
  rows: number
  columns: number
  mode: ArrangementMode
}


export class ImageResizer {


  private readonly page: Size
  private readonly original: Size[]
  private readonly resized: ResizedImage[] = []
  private readonly amountOfImages: number
  private readonly rows: number
  private readonly columns: number
  private readonly mode: ArrangementMode


  constructor(options: ImageResizerArgs) {
    this.page = options.pageSize
    this.original = options.imagesSize
    this.amountOfImages = options.imagesSize.length
    this.rows = options.rows
    this.columns = options.columns
    this.mode = options.mode
  }


  redimensionLandscapeImages(): ResizedImage[] {
    const gapInPs = Math.round(UnitConversor.cmToPs(0.25))

    const pageRows = this.mode === ArrangementMode.LINEAR
      ? this.amountOfImages
      : this.rows
    const pageColumns = this.mode === ArrangementMode.LINEAR
      ? 1
      : this.columns

    const maxImageWidth = (this.page.width - ((pageColumns - 1) * gapInPs)) / pageColumns
    const maxImageHeight = (this.page.height - ((pageRows - 1) * gapInPs)) / pageRows

    let posX = 0
    let posY = 0

    // eslint-disable-next-line no-useless-assignment
    let newImageWidth = 0
    // eslint-disable-next-line no-useless-assignment
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

    const pageRows = this.mode === ArrangementMode.LINEAR
      ? 1
      : this.rows
    const pageColumns = this.mode === ArrangementMode.LINEAR
      ? this.amountOfImages
      : this.columns

    const maxImageWidth = (this.page.width - ((pageColumns - 1) * gapInPs)) / pageColumns
    const maxImageHeight = (this.page.height - ((pageRows - 1) * gapInPs)) / pageRows

    let posX = 0
    let posY = 0

    // eslint-disable-next-line no-useless-assignment
    let newImageHeight = 0
    // eslint-disable-next-line no-useless-assignment
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
