import { describe, expect, test } from "@jest/globals"

import { PostScript } from "../src/PostScript"
import { UnitConversor } from "../src/UnitConversor"


describe("UnitConversor", () => {
  test("psToCm", () => {
    const a4Size = PostScript.getPageSize("A4")
    const a4MaxSize = Math.max(a4Size.width, a4Size.height)

    const cmSize = UnitConversor.psToCm(a4MaxSize)
    expect(cmSize).toBeCloseTo(29.7, 1)
  })

  test("cmToPs", () => {
    const a4Size = PostScript.getPageSize("A4")
    const a4MaxSize = Math.max(a4Size.width, a4Size.height)

    const psSize = UnitConversor.cmToPs(29.7)
    expect(psSize).toBeCloseTo(a4MaxSize, 1)
  })
})
