export default ImageMinimizerPlugin;
export type Schema = import("schema-utils/declarations/validate").Schema;
export type WebpackPluginInstance = import("webpack").WebpackPluginInstance;
export type Compiler = import("webpack").Compiler;
export type Compilation = import("webpack").Compilation;
export type WebpackError = import("webpack").WebpackError;
export type Asset = import("webpack").Asset;
export type AssetInfo = import("webpack").AssetInfo;
export type ImageminOptions = import("imagemin").Options;
export type LoaderOptions = import("./loader").LoaderOptions;
export type ImageminMinifyFunction = typeof imageminMinify;
export type SquooshMinifyFunction = typeof squooshMinify;
export type squooshTransformerFunction = typeof squooshGenerate;
export type Rule = RegExp | string;
export type Rules = Rule[] | Rule;
export type FilterFn = (source: Buffer, sourcePath: string) => boolean;
export type DataForMinifyFn = Record<string, Buffer>;
export type ImageminMinimizerOptions = {
  plugins: ImageminOptions["plugins"] | [string, Record<string, any>];
  pluginsMeta?: Record<string, any>[] | undefined;
};
export type SquooshMinimizerOptions = {
  targets?:
    | {
        [x: string]: string;
      }
    | undefined;
  encodeOptions?:
    | {
        [x: string]: object;
      }
    | undefined;
};
export type CustomFnMinimizerOptions = Record<string, any>;
export type MinimizerOptions =
  | ImageminMinimizerOptions
  | SquooshMinimizerOptions
  | CustomFnMinimizerOptions;
export type InternalMinifyOptions = {
  filename: string;
  input: Buffer;
  severityError?: string | undefined;
  minimizerOptions?: MinimizerOptions | undefined;
  minify: MinifyFunctions;
  info?: import("webpack").AssetInfo | undefined;
  getPathWithInfoFn: Compilation["getPathWithInfo"];
};
export type InternalMinifyResultEntry = {
  data: Buffer;
  filename: string;
  warnings: Array<Error>;
  errors: Array<Error>;
  filenameTemplate: string;
  type?: string | undefined;
};
export type InternalMinifyResult = InternalMinifyResultEntry[];
export type CustomMinifyFunction = (
  data: DataForMinifyFn,
  minifyOptions: CustomFnMinimizerOptions
) => InternalMinifyResult;
export type MinifyFunctions =
  | ImageminMinifyFunction
  | SquooshMinifyFunction
  | CustomMinifyFunction;
export type MinifyFnResultEntry = {
  filename: string;
  data: Buffer;
  warnings: Array<Error>;
  errors: Array<Error>;
  type?: string | undefined;
};
export type MinifyFnResult = MinifyFnResultEntry | MinifyFnResultEntry[];
export type InternalLoaderOptions = {
  /**
   * Test to match files against.
   */
  test?: Rules | undefined;
  /**
   * Files to include.
   */
  include?: Rules | undefined;
  /**
   * Files to exclude.
   */
  exclude?: Rules | undefined;
  loader?: string | undefined;
  loaderOptions?: import("./loader").LoaderOptions | undefined;
};
export type PathData = {
  filename?: string | undefined;
};
export type FilenameFn = (
  pathData: PathData,
  assetInfo?: import("webpack").AssetInfo | undefined
) => string;
export type PluginOptions = {
  /**
   * Allows filtering of images for optimization.
   */
  filter?: FilterFn | undefined;
  /**
   * Test to match files against.
   */
  test?: Rules | undefined;
  /**
   * Files to include.
   */
  include?: Rules | undefined;
  /**
   * Files to exclude.
   */
  exclude?: Rules | undefined;
  /**
   * Allows to choose how errors are displayed.
   */
  severityError?: string | undefined;
  /**
   * Options for `imagemin`.
   */
  minimizerOptions?: MinimizerOptions | undefined;
  /**
   * Automatically adding `imagemin-loader`.
   */
  loader?: boolean | undefined;
  /**
   * Maximum number of concurrency optimization processes in one time.
   */
  maxConcurrency?: number | undefined;
  /**
   * Allows to set the filename for the generated asset. Useful for converting to a `webp`.
   */
  filename?: string | FilenameFn | undefined;
  /**
   * Allows to remove original assets. Useful for converting to a `webp` and remove original assets.
   */
  deleteOriginalAssets?: boolean | undefined;
  minify?: MinifyFunctions | undefined;
};
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").WebpackPluginInstance} WebpackPluginInstance */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").WebpackError} WebpackError */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").AssetInfo} AssetInfo */
/** @typedef {import("imagemin").Options} ImageminOptions */
/** @typedef {import("./loader").LoaderOptions} LoaderOptions */
/** @typedef {import("./utils/imageminMinify").default} ImageminMinifyFunction */
/** @typedef {import("./utils/squooshMinify").default} SquooshMinifyFunction */
/** @typedef {import("./utils/squooshGenerate").default} squooshTransformerFunction */
/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */
/**
 * @callback FilterFn
 * @param {Buffer} source `Buffer` of source file.
 * @param {string} sourcePath Absolute path to source.
 * @returns {boolean}
 */
/**
 * @typedef {Record.<string, Buffer>} DataForMinifyFn
 */
/**
 * @typedef {Object} ImageminMinimizerOptions
 * @property {ImageminOptions["plugins"] | [string, Record<string, any>]} plugins
 * @property {Array<Record<string, any>>} [pluginsMeta]
 */
/**
 * @typedef {Object} SquooshMinimizerOptions
 * @property {Object.<string, string>} [targets]
 * @property {Object.<string, object>} [encodeOptions]
 */
/**
 * @typedef {Record<string, any>} CustomFnMinimizerOptions
 */
/**
 * @typedef {ImageminMinimizerOptions | SquooshMinimizerOptions | CustomFnMinimizerOptions} MinimizerOptions
 */
/**
 * @typedef {Object} InternalMinifyOptions
 * @property {string} filename
 * @property {Buffer} input
 * @property {string} [severityError]
 * @property {MinimizerOptions} [minimizerOptions]
 * @property {MinifyFunctions} minify
 * @property {AssetInfo} [info]
 * @property {Compilation["getPathWithInfo"]} getPathWithInfoFn
 */
/**
 * @typedef {Object} InternalMinifyResultEntry
 * @property {Buffer} data
 * @property {string} filename
 * @property {Array<Error>} warnings
 * @property {Array<Error>} errors
 * @property {string} filenameTemplate
 * @property {string} [type]
 */
/**
 * @typedef {InternalMinifyResultEntry[]} InternalMinifyResult
 */
/**
 * @callback CustomMinifyFunction
 * @param {DataForMinifyFn} data
 * @param {CustomFnMinimizerOptions} minifyOptions
 * @returns {InternalMinifyResult}
 */
/**
 * @typedef {ImageminMinifyFunction | SquooshMinifyFunction | CustomMinifyFunction} MinifyFunctions
 */
/**
 * @typedef {Object} MinifyFnResultEntry
 * @property {string} filename
 * @property {Buffer} data
 * @property {Array<Error>} warnings
 * @property {Array<Error>} errors
 * @property {string} [type]
 */
/**
 * @typedef {MinifyFnResultEntry | MinifyFnResultEntry[]} MinifyFnResult
 */
/**
 * @typedef {Object} InternalLoaderOptions
 * @property {Rules} [test] Test to match files against.
 * @property {Rules} [include] Files to include.
 * @property {Rules} [exclude] Files to exclude.
 * @property {string} [loader]
 * @property {LoaderOptions} [loaderOptions]
 */
/**
 * @typedef {Object} PathData
 * @property {string} [filename]
 */
/**
 * @callback FilenameFn
 * @param {PathData} pathData
 * @param {AssetInfo} [assetInfo]
 * @returns {string}
 */
/**
 * @typedef {Object} PluginOptions
 * @property {FilterFn} [filter] Allows filtering of images for optimization.
 * @property {Rules} [test] Test to match files against.
 * @property {Rules} [include] Files to include.
 * @property {Rules} [exclude] Files to exclude.
 * @property {string} [severityError] Allows to choose how errors are displayed.
 * @property {MinimizerOptions} [minimizerOptions] Options for `imagemin`.
 * @property {boolean} [loader] Automatically adding `imagemin-loader`.
 * @property {number} [maxConcurrency] Maximum number of concurrency optimization processes in one time.
 * @property {string | FilenameFn} [filename] Allows to set the filename for the generated asset. Useful for converting to a `webp`.
 * @property {boolean} [deleteOriginalAssets] Allows to remove original assets. Useful for converting to a `webp` and remove original assets.
 * @property {MinifyFunctions} [minify]
 */
/**
 * @extends {WebpackPluginInstance}
 */
declare class ImageMinimizerPlugin {
  /**
   * @param {PluginOptions} [options={}] Plugin options.
   */
  constructor(options?: PluginOptions | undefined);
  options: {
    minify: MinifyFunctions;
    severityError: string | undefined;
    exclude: Rules | undefined;
    minimizerOptions: MinimizerOptions;
    include: Rules | undefined;
    loader: boolean;
    maxConcurrency: number | undefined;
    test: Rules;
  };
  /**
   *
   * @param {(InternalMinifyResultEntry & {source: Buffer} )[]} data
   * @returns (InternalMinifyResultEntry & {source: Buffer} )[]
   */
  createCacheData(
    data: (InternalMinifyResultEntry & {
      source: Buffer;
    })[]
  ): {
    source: Buffer;
    filename: string;
    warnings: Error[];
    type: string | undefined;
  }[];
  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Record<string, import("webpack").sources.Source>} assets
   * @param {Set<string>} moduleAssets
   * @returns {Promise<void>}
   */
  private optimize;
  /**
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler: import("webpack").Compiler): void;
}
declare namespace ImageMinimizerPlugin {
  export const loader: string;
  export { normalizeImageminConfig };
  export { imageminMinify };
  export { squooshMinify };
  export { imageminGenerate };
  export { squooshGenerate };
}
import imageminMinify from "./utils/imageminMinify";
import squooshMinify from "./utils/squooshMinify";
import squooshGenerate from "./utils/squooshGenerate";
import { normalizeImageminConfig } from "./utils/imageminMinify";
import imageminGenerate from "./utils/imageminGenerate";
