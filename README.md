# pdf-mounter

A tool that automates the creation of PDF files, reading all the images inside a folder and adding a certain amount of images per page.

## Requirements

Requires [NodeJS](https://nodejs.org/) to execute the program.

## Installation

```sh
npm install
```

or

```sh
yarn install
```

## Adding an alias

If you want to run this program from anywhere, you can add an alias to the file `./dist/index.js`:

On Linux, add the following line to your `.bashrc` file or equivalent:

```sh
alias pdf-mounter='node <PATH_TO_THIS_REPOSITORY>/dist/index.js'
```

## Usage

| Argument | Required | Default value | Description |
|----------|----------|---------------|-------------|
 `--images`, `-i` | No | Current Directory | Path to a folder containing the images to be added to PDF file. All files that are not image files will be ignored. See [supported image extensions](#supported-image-extensions).
 `--output-name`, `-o` | No | `generated_file.pdf` | The name of resulting PDF file.
 `--output-path`, `-p` | No | Current Directory | The path (to a folder) where the resulting PDF file will be written.
 `--amount-of-images-per-page`, `-c` | No | 2 | How many images will be added to each page.
 `--mode`, `-m` | No | `linear` | How the images will be arranged on the page. When passing `matrix`, `--rows` and `--columns` are required too.
 `--rows`, `-r` | No | `1` or `--amount-of-images-per-page`, depending on page orientation | How many rows will be present on the page. Only has effect if `--mode` is set to `matrix`.
 `--columns`, `-c` | No | `1` or `--amount-of-images-per-page`, depending on page orientation | How many columns will be present on the page. Only has effect if `--mode` is set to `matrix`.

## Examples

With the Terminal open in the desired folder, the next command will read the images and add 3 images to a pdf file called `new_file.pdf`.

```sh
pdf-mounter -o new_file.pdf -c 3
```

If you haven't add the alias, you still can select any folder, but the command is slightly different.

With the terminal open in the root of this project, you can run either:

```sh
yarn start -i /path/to/specific/folder
```

or

```sh
node ./dist/index.js -i /path/to/specific/folder
```

## Supported image extensions

The supported images extensions are: `png`, `jpg`, `jpeg`, `bmp` and `webp`.

All other files will be ignored, even image files with any other extensions or no extension.

## Testing with Jest

To test, you will have to create 2 folders: `./assets/images` and `./assets/pdf`

The first contains some images that will be added to an test pdf file. And you will have to add some images to it in order to run the tests.

The second is the path where the PDF files, created during the test, will be stored.

Note that the coverage of the test may be different depending on the images you added. Some aspects are the presence of `orientation` metadata, width, height and file extension.
