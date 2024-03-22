import { describe, expect, test } from "@jest/globals"

import { ImageProvider } from "../src/ImageProvider"


describe("ImageProvider", () => {
  const imageProvider = new ImageProvider()


  test("ImageProvider reads folder", async () => {
    const result = await imageProvider.read("./assets/images")
    expect(result).toBeUndefined()
  })


  test("Check if image provider is not empty", () => {
    expect(imageProvider.isEmpty()).toBeFalsy()
  })


  test("Reading all portrait images", () => {
    function readAllPortraitImages() {
      while (imageProvider.hasNextPortrait()) {
        const image = imageProvider.nextPortrait()
        expect(image).toBeDefined()
      }
    }

    expect(readAllPortraitImages).not.toThrow()
  })

  test("Reading portrait image not having a next portrait image", () => {
    expect(imageProvider.hasNextPortrait()).toBeFalsy()
    expect(() => imageProvider.nextPortrait())
      .toThrow("No more portrait images read to return")
  })


  test("Reading all landscape images", () => {
    function readAllLandscapeImages() {
      while (imageProvider.hasNextLandscape()) {
        const image = imageProvider.nextLandscape()
        expect(image).toBeDefined()
      }
    }

    expect(readAllLandscapeImages).not.toThrow()
  })

  test("Reading landscape image not having a next landscape image", () => {
    expect(imageProvider.hasNextLandscape())
      .toBeFalsy()
    expect(() => imageProvider.nextLandscape())
      .toThrow("No more landscape images read to return")
  })


  test("Reading all images", async () => {
    await imageProvider.read("./assets/images")

    function readAllImages() {
      while (imageProvider.hasNext()) {
        const image = imageProvider.next()
        expect(image).toBeDefined()
      }
    }

    expect(readAllImages).not.toThrow()
  })

  test("Reading image not having a next image", () => {
    expect(imageProvider.hasNext()).toBeFalsy()
    expect(() => imageProvider.next()).toThrow("No more images read to return")
  })


  test("Check if image provider is empty", () => {
    expect(imageProvider.isEmpty()).toBeTruthy()
  })
})
