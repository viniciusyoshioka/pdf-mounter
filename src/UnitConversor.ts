import { PostScript } from './PostScript.ts'


export class UnitConversor {


  private static getA4MinSizeInPostScript(): number {
    const a4Size = PostScript.getPageSize('A4')
    return Math.min(a4Size.width, a4Size.height)
  }

  private static getA4MinSizeInCm(): number {
    return 21
  }


  static psToCm(ps: number): number {
    const psSize = this.getA4MinSizeInPostScript()
    const cmSize = this.getA4MinSizeInCm()

    const onePsInCm = cmSize / psSize
    return onePsInCm * ps
  }

  static cmToPs(cm: number): number {
    const psSize = this.getA4MinSizeInPostScript()
    const cmSize = this.getA4MinSizeInCm()

    const oneCmInPs = psSize / cmSize
    return cm * oneCmInPs
  }
}
