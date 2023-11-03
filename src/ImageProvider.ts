import fs from "node:fs"
import path from "node:path"
import sharp, { Metadata } from "sharp"


export type Image = {
    path: string
    metadata: Metadata
}


type ImageSize = {
    width: number
    height: number
}


export class ImageProvider {


    static SUPPORTED_EXTENSIONS = ["png", "jpg", "jpeg", "bmp", "webp"]


    private portraitIndex = 0
    private landscapeIndex = 0
    private portraitFiles: Image[] = []
    private landscapeFiles: Image[] = []


    constructor() {}


    async read(folderPath: string) {
        const imageFilesPath = fs
            .readdirSync(folderPath)
            .filter(fileName => this.isImageFile(fileName))
            .map(fileName => path.join(folderPath, fileName))

        for (let i = 0; i < imageFilesPath.length; i++) {
            const imagePath = imageFilesPath[i]
            const imageMetadata = await this.getImageMetadata(imagePath)
            const imageSize = this.getImageSize(imageMetadata)
            if (imageSize.width > imageSize.height) {
                this.landscapeFiles.push({ path: imagePath, metadata: imageMetadata })
            } else {
                this.portraitFiles.push({ path: imagePath, metadata: imageMetadata })
            }
        }
    }

    private isImageFile(fileName: string): boolean {
        const splitFilePath = fileName.toLowerCase().split(".")
        const fileExtension = splitFilePath.length > 1
            ? splitFilePath.pop()
            : undefined

        return fileExtension
            ? ImageProvider.SUPPORTED_EXTENSIONS.includes(fileExtension)
            : false
    }

    private async getImageMetadata(filePath: string): Promise<Metadata> {
        return await sharp(filePath).metadata()
    }

    private getImageSize(imageMetadata: Metadata): ImageSize {
        const width = imageMetadata.width as number
        const height = imageMetadata.height as number
        const orientation = imageMetadata.orientation ?? 0

        if (orientation >= 5) return { width, height }
        return { width: height, height: width }
    }


    hasNextPortrait(): boolean {
        return this.portraitIndex < this.portraitFiles.length
    }

    nextPortrait(): Image {
        if (this.portraitIndex >= this.portraitFiles.length) {
            throw new Error("No more portrait images read to return")
        }
        return this.portraitFiles[this.portraitIndex++]
    }


    hasNextLandscape(): boolean {
        return this.landscapeIndex < this.landscapeFiles.length
    }

    nextLandscape(): Image {
        if (this.landscapeIndex >= this.landscapeFiles.length) {
            throw new Error("No more landscape images read to return")
        }
        return this.landscapeFiles[this.landscapeIndex++]
    }


    hasNext(): boolean {
        return this.hasNextPortrait() || this.hasNextLandscape()
    }

    next(): Image {
        if (this.hasNextPortrait()) {
            return this.nextPortrait()
        }
        if (this.hasNextLandscape()) {
            return this.nextLandscape()
        }
        throw new Error("No more images read to return")
    }
}
