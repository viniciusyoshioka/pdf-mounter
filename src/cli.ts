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


export enum ArrangementMode {
  LINEAR = 'linear',
  MATRIX = 'matrix',
}

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
  private readonly args: ParsedArgs


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
    -m, --mode                      How the images will be arranged on the page. Possible values are '${ArrangementMode.LINEAR}' and '${ArrangementMode.MATRIX}'. If set to ${ArrangementMode.MATRIX}, --rows and --columns must be set too. Default: ${ArrangementMode.LINEAR}
    -r, --rows                      How many rows will be present on the page. Only has effect if --mode is set to ${ArrangementMode.MATRIX}. Default: 1 or --amount-of-images-per-page, depending on page's orientation
    -c, --columns                   How many columns will be present on the page. Only has effect if --mode is set to ${ArrangementMode.MATRIX}. Default: 1 or --amount-of-images-per-page, depending on page's orientation
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
    const args = this.args as Partial<ParsedArgs>

    if (args['--images'] === undefined) {
      args['--images'] = process.cwd()
    }

    if (path.isAbsolute(args['--images'])) {
      return
    }

    const cwd = process.cwd()
    const imagesPath = args['--images']
    args['--images'] = path.join(cwd, imagesPath)
  }

  private setDefaultValueToOutputName() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--output-name'] === undefined) {
      args['--output-name'] = 'generated_file.pdf'
    }

    if (!args['--output-name'].length) {
      throw new Error('Option --output-name cannot be empty')
    }
  }

  private setDefaultValueToOutputPath() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--output-path'] === undefined) {
      args['--output-path'] = process.cwd()
    }

    if (path.isAbsolute(args['--output-path'])) {
      return
    }

    const cwd = process.cwd()
    const outputPath = args['--output-path']
    args['--output-path'] = path.join(cwd, outputPath)
  }

  private setDefaultValueToAmountOfImagesPerPage() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--amount-of-images-per-page'] === undefined) {
      args['--amount-of-images-per-page'] = 2
    }

    if (args['--amount-of-images-per-page'] < 1) {
      throw new Error(
        'Option --amount-of-images-per-page must be a number greater than 0',
      )
    }
  }

  private setDefaultValueToMode() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--mode'] === undefined) {
      args['--mode'] = ArrangementMode.LINEAR
    }

    const allowedModes = [ArrangementMode.LINEAR, ArrangementMode.MATRIX]
    const allowedModesForErrorMessage = allowedModes.map(mode => `'${mode}'`).join(', ')

    const isModeAllowed = allowedModes.includes(args['--mode'])
    if (!isModeAllowed) {
      throw new Error(`Option --mode must be one of ${allowedModesForErrorMessage}`)
    }
  }

  private setDefaultValueToRows() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--rows'] === undefined) {
      args['--rows'] = 1
    }

    if (args['--rows'] < 1) {
      throw new Error('Option --rows must be a number greater than 0')
    }
  }

  private setDefaultValueToColumns() {
    const args = this.args as Partial<ParsedArgs>

    if (args['--columns'] === undefined) {
      args['--columns'] = 1
    }

    if (args['--columns'] < 1) {
      throw new Error('Option --columns must be a number greater than 0')
    }
  }
}


const cli = new CLI()
export const args = cli.getArgs()
