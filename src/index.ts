import path from "node:path"
import PDFDocument from "pdfkit"

import { ImageProvider } from "./ImageProvider"
import { PdfMounter } from "./PdfMounter"
import { args } from "./cli"


const pdfMounter = new PdfMounter({
    pdf: new PDFDocument({ size: "A4", autoFirstPage: false }),
    imageProvider: new ImageProvider(),
})


pdfMounter.start()
    .then(() => {
        const outputFolderPath = args["--output-path"]
        const outputFileName = args["--output-name"]
        const outputPath = path.join(outputFolderPath, outputFileName)

        console.log("PDF generated successfully!")
        console.log(`Output path: ${outputPath}`)
    })
    .catch(error => {
        console.log("Error while generating PDF:", error)
    })
