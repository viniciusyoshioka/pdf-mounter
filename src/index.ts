import path from "node:path"
import PDFDocument from "pdfkit"

import { ImageProvider } from "./ImageProvider"
import { PdfMounter } from "./PdfMounter"
import { args } from "./cli"


const AMOUNT_OF_IMAGES_PER_PAGE = args["--amount-of-images-per-page"]
const IMAGES_PATH = args["--images"]
const OUTPUT_FOLDER_PATH = args["--output-path"]
const OUTPUT_FILE_NAME = args["--output-name"]
const OUTPUT_PATH = path.join(OUTPUT_FOLDER_PATH, OUTPUT_FILE_NAME)


const pdfMounter = new PdfMounter({
    pdf: new PDFDocument({ size: "A4", autoFirstPage: false }),
    imageProvider: new ImageProvider(),
    imagesPath: IMAGES_PATH,
    outputPath: OUTPUT_PATH,
    amountOfImagesPerPage: AMOUNT_OF_IMAGES_PER_PAGE,
})


pdfMounter.start()
    .then(() => {
        console.log("PDF generated successfully!")
        console.log(`Output path: ${OUTPUT_PATH}`)
    })
    .catch(error => {
        console.log("Error while generating PDF:", error)
    })
