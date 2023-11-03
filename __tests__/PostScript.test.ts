import { describe, expect, test } from "@jest/globals"

import { PageType, PostScript } from "../src/PostScript"


describe("PostScript", () => {

    test("Has SUPPORTED_PAGES_SIZE defined", () => {
        expect(PostScript.SUPPORTED_PAGES_SIZE).toBeDefined()
    })

    test("Get A series pages size", () => {
        const supportedSeriesA = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]
        const unsupportedSeriesA = ["A11", "A12", "A13", "A14", "A15"]

        supportedSeriesA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedSeriesA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get B series pages size", () => {
        const supportedSeriesB = ["B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]
        const unsupportedSeriesB = ["B11", "B12", "B13", "B14", "B15"]

        supportedSeriesB.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedSeriesB.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get C series pages size", () => {
        const supportedSeriesC = ["C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"]
        const unsupportedSeriesC = ["C11", "C12", "C13", "C14", "C15"]

        supportedSeriesC.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedSeriesC.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get RA series pages size", () => {
        const supportedSeriesRA = ["RA0", "RA1", "RA2", "RA3", "RA4"]
        const unsupportedSeriesRA = ["RA5", "RA6", "RA7", "RA8", "RA9", "RA10"]

        supportedSeriesRA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedSeriesRA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get SRA series pages size", () => {
        const supportedSeriesSRA = ["SRA0", "SRA1", "SRA2", "SRA3", "SRA4"]
        const unsupportedSeriesSRA = ["SRA5", "SRA6", "SRA7", "SRA8", "SRA9", "SRA10"]

        supportedSeriesSRA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedSeriesSRA.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get pages size used in USA", () => {
        const supportedUsaSeries = ["EXECUTIVE", "LEGAL", "LETTER", "TABLOID"]
        const unsupportedUsaSeries = ["PAPER"]

        supportedUsaSeries.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedUsaSeries.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })

    describe("Get other series pages size", () => {
        const supportedOtherSeries = ["4A0", "2A0", "FOLIO"]
        const unsupportedOtherSeries = ["PAPER"]

        supportedOtherSeries.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeDefined()
        })
        unsupportedOtherSeries.forEach(pageType => {
            expect(PostScript.getPageSize(pageType as PageType)).toBeUndefined()
        })
    })
})
