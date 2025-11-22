
export type PageTypeA = 'A0' | 'A1' | 'A2' | 'A3' | 'A4'
  | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10'
export type PageTypeB = 'B0' | 'B1' | 'B2' | 'B3' | 'B4'
  | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10'
export type PageTypeC = 'C0' | 'C1' | 'C2' | 'C3' | 'C4'
  | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10'
export type PageTypeRA = 'RA0' | 'RA1' | 'RA2' | 'RA3' | 'RA4'
export type PageTypeSRA = 'SRA0' | 'SRA1' | 'SRA2' | 'SRA3' | 'SRA4'
export type PageTypeUSA = 'EXECUTIVE' | 'LEGAL' | 'LETTER' | 'TABLOID'
export type PageTypeOther = '4A0' | '2A0' | 'FOLIO'
export type PageType = PageTypeA | PageTypeB | PageTypeC
  | PageTypeRA | PageTypeSRA | PageTypeUSA | PageTypeOther


export type PageLayout = 'portrait' | 'landscape'


export type PostScriptSize = {
  width: number
  height: number
}


type PagesSize = {
  [key in PageType]: PostScriptSize
}


export class PostScript {


  // Extracted from https://pdfkit.org/docs/paper_sizes.html
  static SUPPORTED_PAGES_SIZE: PagesSize = {
    A0: {
      width: 2383.94,
      height: 3370.39,
    },
    A1: {
      width: 1683.78,
      height: 2383.94,
    },
    A2: {
      width: 1190.55,
      height: 1683.78,
    },
    A3: {
      width: 841.89,
      height: 1190.55,
    },
    A4: {
      width: 595.28,
      height: 841.89,
    },
    A5: {
      width: 419.53,
      height: 595.28,
    },
    A6: {
      width: 297.64,
      height: 419.53,
    },
    A7: {
      width: 209.76,
      height: 297.64,
    },
    A8: {
      width: 147.40,
      height: 209.76,
    },
    A9: {
      width: 104.88,
      height: 147.40,
    },
    A10: {
      width: 73.70,
      height: 104.88,
    },
    B0: {
      width: 2834.65,
      height: 4008.19,
    },
    B1: {
      width: 2004.09,
      height: 2834.65,
    },
    B2: {
      width: 1417.32,
      height: 2004.09,
    },
    B3: {
      width: 1000.63,
      height: 1417.32,
    },
    B4: {
      width: 708.66,
      height: 1000.63,
    },
    B5: {
      width: 498.90,
      height: 708.66,
    },
    B6: {
      width: 354.33,
      height: 498.90,
    },
    B7: {
      width: 249.45,
      height: 354.33,
    },
    B8: {
      width: 175.75,
      height: 249.45,
    },
    B9: {
      width: 124.72,
      height: 175.75,
    },
    B10: {
      width: 87.87,
      height: 124.72,
    },
    C0: {
      width: 2599.37,
      height: 3676.54,
    },
    C1: {
      width: 1836.85,
      height: 2599.37,
    },
    C2: {
      width: 1298.27,
      height: 1836.85,
    },
    C3: {
      width: 918.43,
      height: 1298.27,
    },
    C4: {
      width: 649.13,
      height: 918.43,
    },
    C5: {
      width: 459.21,
      height: 649.13,
    },
    C6: {
      width: 323.15,
      height: 459.21,
    },
    C7: {
      width: 229.61,
      height: 323.15,
    },
    C8: {
      width: 161.57,
      height: 229.61,
    },
    C9: {
      width: 113.39,
      height: 161.57,
    },
    C10: {
      width: 79.37,
      height: 113.39,
    },
    RA0: {
      width: 2437.80,
      height: 3458.27,
    },
    RA1: {
      width: 1729.13,
      height: 2437.80,
    },
    RA2: {
      width: 1218.90,
      height: 1729.13,
    },
    RA3: {
      width: 864.57,
      height: 1218.90,
    },
    RA4: {
      width: 609.45,
      height: 864.57,
    },
    SRA0: {
      width: 2551.18,
      height: 3628.35,
    },
    SRA1: {
      width: 1814.17,
      height: 2551.18,
    },
    SRA2: {
      width: 1275.59,
      height: 1814.17,
    },
    SRA3: {
      width: 907.09,
      height: 1275.59,
    },
    SRA4: {
      width: 637.80,
      height: 907.09,
    },
    EXECUTIVE: {
      width: 521.86,
      height: 756.00,
    },
    LEGAL: {
      width: 612.00,
      height: 1008.00,
    },
    LETTER: {
      width: 612.00,
      height: 792.00,
    },
    TABLOID: {
      width: 792.00,
      height: 1224.00,
    },
    '4A0': {
      width: 4767.89,
      height: 6740.79,
    },
    '2A0': {
      width: 3370.39,
      height: 4767.87,
    },
    FOLIO: {
      width: 612.00,
      height: 936.00,
    },
  }


  static getPageSize(pageType: PageType): PostScriptSize {
    if (!(pageType in PostScript.SUPPORTED_PAGES_SIZE)) {
      throw new Error(`Unsupported page type: ${pageType}`)
    }
    return PostScript.SUPPORTED_PAGES_SIZE[pageType]
  }

  static getPageSizeBasedOnLayout(
    pageType: PageType,
    layout: PageLayout,
  ): PostScriptSize {
    const size = PostScript.getPageSize(pageType)
    const newSize = { ...size }

    const shouldInvertPortrait = layout === 'portrait' && size.width > size.height
    const shouldInvertLandscape = layout === 'landscape' && size.height > size.width
    if (shouldInvertPortrait || shouldInvertLandscape) {
      newSize.width = size.height
      newSize.height = size.width
    }
    return newSize
  }
}
