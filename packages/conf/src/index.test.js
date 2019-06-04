import { getConfig, replaceRootDir } from "@lingui/conf"
import cosmiconfig from "cosmiconfig"

const mockExplorer = {
  searchSync: jest.fn(),
  loadSync: jest.fn()
}

jest.mock("cosmiconfig", function() {
  return function() {
    return mockExplorer
  }
})

jest.mock("fs", function() {
  return {
    existsSync: function() {
      return true
    }
  }
})

beforeEach(function() {
  cosmiconfig().loadSync.mockClear()
  cosmiconfig().searchSync.mockClear()
})

describe("lingui-conf", function() {
  it("should return default config", function() {
    const config = getConfig()
    expect(config).toBeInstanceOf(Object)
    expect(config.localeDir).toBeDefined()
    expect(config.sourceLocale).toBeDefined()
    expect(config.fallbackLocale).toBeDefined()
    expect(config.pseudoLocale).toBeDefined()
    expect(config.srcPathDirs).toBeDefined()
    expect(config.srcPathIgnorePatterns).toBeDefined()
    expect(config.extractBabelOptions).toBeDefined()
    expect(config.extractBabelVersion).toBeDefined()
  })

  it("should replace <rootDir>", function() {
    const config = replaceRootDir(
      {
        boolean: false,
        localeDir: "<rootDir>",
        srcPathDirs: ["<rootDir>", "rootDir"]
      },
      "/Root"
    )

    expect(config.boolean).toEqual(false)
    expect(config.localeDir).toEqual("/Root")
    expect(config.srcPathDirs).toEqual(["/Root", "rootDir"])
  })

  it("searches for a config file", function() {
    getConfig()
    expect(cosmiconfig().searchSync).toHaveBeenCalled()
  })

  describe("with configPath parameter", function() {
    it("allows specific config file to be loaded", function() {
      getConfig({ configPath: "./lingui/myconfig" })
      expect(cosmiconfig().searchSync).not.toHaveBeenCalled()
      expect(cosmiconfig().loadSync).toHaveBeenCalledWith("./lingui/myconfig")
    })
  })
})
