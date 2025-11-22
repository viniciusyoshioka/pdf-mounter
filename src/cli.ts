import type { Handler, Spec } from 'arg'
import arg from 'arg'
import path from 'node:path'
import process from 'node:process'


interface ConfigArgs extends Spec {
  '--help': Handler
  '--version': Handler
  '--images': Handler
  '--output-name': Handler
  '--output-path': Handler
  '--amount-of-images-per-page': Handler
  '--mode': Handler
  '--rows': Handler
  '--columns': Handler
}


export type ArrangementMode = 'linear' | 'matrix'

export interface ParsedArgs {
  _: string[]
  '--help': boolean
  '--version': boolean
  '--images': string
  '--output-name': string
  '--output-path': string
  '--amount-of-images-per-page': number
  '--mode': ArrangementMode
  '--rows': number
  '--columns': number
}


const argConfig: ConfigArgs = {
  '--help': Boolean,
  '--version': Boolean,
  '--images': String,
  '--output-name': String,
  '--output-path': String,
  '--amount-of-images-per-page': Number,
  '--mode': String,
  '--rows': Number,
  '--columns': Number,

  '-h': '--help',
  '-v': '--version',
  '-i': '--images',
  '-o': '--output-name',
  '-p': '--output-path',
  '-q': '--amount-of-images-per-page',
  '-m': '--mode',
  '-r': '--rows',
  '-c': '--columns',
}


export class CLI {


  private readonly NAME = 'pdf-mounter'
  private readonly VERSION = '0.0.1'
  private args: ParsedArgs


  constructor(argv?: string[]) {
    this.args = arg(argConfig, { argv }) as ParsedArgs

    if (this.args['--help']) {
      this.showHelpAndExit()
    }
    if (this.args['--version']) {
      this.showVersionAndExit()
    }

    this.setDefaultValuesToOptionalArgs()
  }


  getArgs(): ParsedArgs {
    return this.args
  }


  private showHelpAndExit() {
    const helpMessage = `Usage: ${this.NAME} [options]
    
    Options:
    -h, --help                      Show this help message
    -v, --version                   Show program version
    -i, --images <path>             Path to a folder containing the images. Default: current directory
    -o, --output-name <name>        Output file name of generated PDF. Default: generated_file.pdf
    -p, --output-path <path>        Output path of generated PDF file. Default: current directory
    -q, --amount-of-images-per-page How many images will be placed on each page. Default: 2
    -m, --mode                      How the images will be arranged on the page. Possible values are 'linear' and 'matrix'. If set to matrix, --rows and --columns must be set too. Default: linear
    -r, --rows                      How many rows will be present on the page. Only has effect if --mode is set to matrix. Default: 1 or --amount-of-images-per-page, depending on page's orientation
    -c, --columns                   How many columns will be present on the page. Only has effect if --mode is set to matrix. Default: 1 or --amount-of-images-per-page, depending on page's orientation
    `

    console.log(helpMessage)
    process.exit(0)
  }

  private showVersionAndExit() {
    const versionMessage = `${this.NAME} version: ${this.VERSION}`

    console.log(versionMessage)
    process.exit(0)
  }


  private setDefaultValuesToOptionalArgs() {
    this.setDefaultValueToImages()
    this.setDefaultValueToOutputName()
    this.setDefaultValueToOutputPath()
    this.setDefaultValueToAmountOfImagesPerPage()
    this.setDefaultValueToMode()
    this.setDefaultValueToRows()
    this.setDefaultValueToColumns()
  }

  private setDefaultValueToImages() {
    if (!this.args['--images']) {
      this.args['--images'] = process.cwd()
    }
    if (path.isAbsolute(this.args['--images'])) {
      return
    }

    const cwd = process.cwd()
    const imagesPath = this.args['--images']
    this.args['--images'] = path.join(cwd, imagesPath)
  }

  private setDefaultValueToOutputName() {
    if (!this.args['--output-name']) {
      this.args['--output-name'] = 'generated_file.pdf'
    }
  }

  private setDefaultValueToOutputPath() {
    if (!this.args['--output-path']) {
      this.args['--output-path'] = process.cwd()
    }
    if (path.isAbsolute(this.args['--output-path'])) {
      return
    }

    const cwd = process.cwd()
    const outputPath = this.args['--output-path']
    this.args['--output-path'] = path.join(cwd, outputPath)
  }

  private setDefaultValueToAmountOfImagesPerPage() {
    if (!this.args['--amount-of-images-per-page']) {
      this.args['--amount-of-images-per-page'] = 2
    }
    if (this.args['--amount-of-images-per-page'] < 1) {
      throw new Error(
        'Option --amount-of-images-per-page must be a number greater than 0',
      )
    }
  }

  private setDefaultValueToMode() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.args['--mode']) {
      this.args['--mode'] = 'linear'
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.args['--mode'] !== 'linear' && this.args['--mode'] !== 'matrix') {
      throw new Error("Option --mode must be either 'linear' or 'matrix'")
    }
  }

  private setDefaultValueToRows() {
    if (!this.args['--rows']) {
      this.args['--rows'] = 1
    }
    if (this.args['--rows'] < 1) {
      throw new Error('Option --rows must be a number greater than 0')
    }
  }

  private setDefaultValueToColumns() {
    if (!this.args['--columns']) {
      this.args['--columns'] = 1
    }
    if (this.args['--columns'] < 1) {
      throw new Error('Option --columns must be a number greater than 0')
    }
  }
}


const cli = new CLI()
export const args = cli.getArgs()
