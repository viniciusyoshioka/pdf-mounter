const start = performance.now()

function showElapsedTime() {
    const end = performance.now()
    const time = (end - start) / 1000
    console.log(`Time elapsed: ${time.toFixed(2)}s`)
}


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
        const outputPath = path.join(args["--output-path"], args["--output-name"])
        console.log(`PDF generated successfully at "${outputPath}"`)
        showElapsedTime()
    })
    .catch(error => {
        console.log("Error while generating PDF:", error)
        showElapsedTime()
    })
