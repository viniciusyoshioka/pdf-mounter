import arg, { Handler, Spec } from "arg"
import path from "node:path"
import process from "node:process"


interface ConfigArgs extends Spec {
    "--help": Handler
    "--version": Handler
    "--images": Handler
    "--output-name": Handler
    "--output-path": Handler
    "--amount-of-images-per-page": Handler
}


export interface ParsedArgs {
    "_": string[]
    "--help": boolean
    "--version": boolean
    "--images": string
    "--output-name": string
    "--output-path": string
    "--amount-of-images-per-page": number
}


const argConfig: ConfigArgs = {
    "--help": Boolean,
    "--version": Boolean,
    "--images": String,
    "--output-name": String,
    "--output-path": String,
    "--amount-of-images-per-page": Number,

    "-h": "--help",
    "-v": "--version",
    "-i": "--images",
    "-o": "--output-name",
    "-p": "--output-path",
    "-c": "--amount-of-images-per-page",
}


export interface CliConfig {
    argv?: string[]
    exitOnHelp?: boolean
    exitOnVersion?: boolean
}


export class CLI {


    private NAME = "auto-pdf"
    private VERSION = "0.0.1"
    private args: ParsedArgs


    constructor(argv?: string[]) {
        this.args = arg(argConfig, { argv }) as ParsedArgs

        if (this.args["--help"]) {
            this.showHelpAndExit()
        }
        if (this.args["--version"]) {
            this.showVersionAndExit()
        }

        this.setDefaultValuesToOptionalArgs()
    }


    getArgs(): ParsedArgs {
        return this.args as ParsedArgs
    }


    private showHelpAndExit() {
        console.log(`Usage: ${this.NAME} [options]`)
        console.log("")
        console.log("Options:")
        console.log("    -h, --help                      Show this help message")
        console.log("    -v, --version                   Show program version")
        console.log("    -i, --images <path>             Path to a folder containing the images. Default: current directory")
        console.log("    -o, --output-name <name>        Output file name of generated PDF. Default: generated_file.pdf")
        console.log("    -p, --output-path <path>        Output path of generated PDF file. Default: current directory")
        console.log("    -c, --amount-of-images-per-page How many images will be placed on each page. Default: 2")
        process.exit(0)
    }

    private showVersionAndExit() {
        console.log(`${this.NAME} version: ${this.VERSION}`)
        process.exit(0)
    }


    private setDefaultValuesToOptionalArgs() {
        this.setDefaultValueToImages()
        this.setDefaultValueToOutputName()
        this.setDefaultValueToOutputPath()
        this.setDefaultValueToAmountOfImagesPerPage()
    }

    private setDefaultValueToImages() {
        if (this.args["--images"] === undefined) {
            this.args["--images"] = process.cwd()
        }
        if (path.isAbsolute(this.args["--images"])) {
            return
        }

        const cwd = process.cwd()
        const imagesPath = this.args["--images"]
        this.args["--images"] = path.join(cwd, imagesPath)
    }

    private setDefaultValueToOutputName() {
        if (this.args["--output-name"] === undefined) {
            this.args["--output-name"] = "generated_file.pdf"
        }
    }

    private setDefaultValueToOutputPath() {
        if (this.args["--output-path"] === undefined) {
            this.args["--output-path"] = process.cwd()
        }
        if (path.isAbsolute(this.args["--output-path"])) {
            return
        }

        const cwd = process.cwd()
        const outputPath = this.args["--output-path"]
        this.args["--output-path"] = path.join(cwd, outputPath)
    }

    private setDefaultValueToAmountOfImagesPerPage() {
        if (this.args["--amount-of-images-per-page"] === undefined) {
            this.args["--amount-of-images-per-page"] = 2
        }
        if (this.args["--amount-of-images-per-page"] < 1) {
            throw new Error("Option --amount-of-images-per-page must be a number greater than 0")
        }
    }
}


const cli = new CLI()
export const args = cli.getArgs()
