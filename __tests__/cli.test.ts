import { describe, expect, jest, test } from "@jest/globals"
import path from "node:path"

import { CLI, ParsedArgs } from "../src/cli"


describe("cli", () => {

    test("Show help", () => {
        const mockExit = jest.spyOn(process, "exit")
            .mockImplementation(exitCode => {
                throw new Error(`process.exit(${exitCode})`)
            })

        const argv: string[] = ["-h"]
        expect(() => new CLI(argv)).toThrow("process.exit(0)")

        expect(mockExit).toHaveBeenCalledWith(0)
        mockExit.mockRestore()
    })

    test("Show version", () => {
        const mockExit = jest.spyOn(process, "exit")
            .mockImplementation(exitCode => {
                throw new Error(`process.exit(${exitCode})`)
            })

        const argv: string[] = ["-v"]
        expect(() => new CLI(argv)).toThrow("process.exit(0)")

        expect(mockExit).toHaveBeenCalledWith(0)
        mockExit.mockRestore()
    })

    test("Get parsed args", async () => {
        const cli = new CLI()
        const args = cli.getArgs()

        const cliArguments = Object.keys(args) as (keyof ParsedArgs)[]
        cliArguments.forEach(cliArgument => {
            expect(args[cliArgument]).toBeDefined()
        })
    })


    test("Test undefined --images", () => {
        const argv: string[] = []

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const imagesPath = args["--images"]
        const cwd = process.cwd()

        expect(imagesPath).toEqual(cwd)
        expect(path.isAbsolute(imagesPath)).toBeTruthy()
    })

    test("Test absolute path for --images", () => {
        const argv: string[] = ["--images", "/absolute/path"]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const imagesPath = args["--images"]

        expect(imagesPath).toEqual("/absolute/path")
        expect(path.isAbsolute(imagesPath)).toBeTruthy()
    })

    test("Test relative path for --images", () => {
        const relativeImagesPath = "./relative/path"
        const argv: string[] = ["--images", relativeImagesPath]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const cwd = process.cwd()
        const expectedPath = path.join(cwd, relativeImagesPath)

        const imagesPath = args["--images"]
        expect(imagesPath).toEqual(expectedPath)
        expect(path.isAbsolute(imagesPath)).toBeTruthy()
    })


    test("Test undefined --output-name", () => {
        const argv: string[] = ["--output-name", "custom_name.pdf"]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const outputName = args["--output-name"]
        expect(outputName).toEqual("custom_name.pdf")
    })


    test("Test undefined --output-path", () => {
        const argv: string[] = []

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const outputPath = args["--output-path"]
        const cwd = process.cwd()

        expect(outputPath).toEqual(cwd)
        expect(path.isAbsolute(outputPath)).toBeTruthy()
    })

    test("Test absolute path for --output-path", () => {
        const argv: string[] = ["--output-path", "/absolute/path"]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const outputPath = args["--output-path"]

        expect(outputPath).toEqual("/absolute/path")
        expect(path.isAbsolute(outputPath)).toBeTruthy()
    })

    test("Test relative path for --output-path", () => {
        const relativeOutputPath = "./relative/path"
        const argv: string[] = ["--output-path", relativeOutputPath]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const cwd = process.cwd()
        const expectedPath = path.join(cwd, relativeOutputPath)

        const outputPath = args["--output-path"]
        expect(outputPath).toEqual(expectedPath)
        expect(path.isAbsolute(outputPath)).toBeTruthy()
    })

    test("Test relative path for --images and --output-path", () => {
        const relativeImagesPath = "./relative/images"
        const relativeOutputPath = "./relative/output"
        const argv: string[] = ["--images", relativeImagesPath, "--output-path", relativeOutputPath]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const cwd = process.cwd()
        const imagesPath = args["--images"]
        const outputPath = args["--output-path"]
        const expectedImagesPath = path.join(cwd, relativeImagesPath)
        const expectedOutputPath = path.join(cwd, relativeOutputPath)

        expect(imagesPath).toEqual(expectedImagesPath)
        expect(path.isAbsolute(imagesPath)).toBeTruthy()
        expect(outputPath).toEqual(expectedOutputPath)
        expect(path.isAbsolute(outputPath)).toBeTruthy()
    })


    test("Test undefined --amount-of-images-per-page", () => {
        const argv: string[] = []

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const amountOfImagesPerPage = args["--amount-of-images-per-page"]
        expect(amountOfImagesPerPage).toEqual(2)
    })

    test("Test --amount-of-images-per-page", () => {
        const argv: string[] = ["--amount-of-images-per-page", "3"]

        const cli = new CLI(argv)
        const args = cli.getArgs()

        const amountOfImagesPerPage = args["--amount-of-images-per-page"]
        expect(amountOfImagesPerPage).toEqual(3)
    })

    test("Test --amount-of-images-per-page lesser than 1", () => {
        const expectedErrorMessage = "Option --amount-of-images-per-page must be a number greater than 0"

        expect(() => new CLI(["--amount-of-images-per-page", "0"])).toThrow(expectedErrorMessage)
        expect(() => new CLI(["--amount-of-images-per-page", "-1"])).toThrow(expectedErrorMessage)
    })
})
