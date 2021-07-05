import path from "path";
import { klona } from "klona/full";
import fileTypeFromBuffer from "./fileTypeFromBuffer";

/** @typedef {import("../index").DataForMinifyFn} DataForMinifyFn */
/** @typedef {import("../index").ImageminMinimizerOptions} ImageminMinimizerOptions */
/** @typedef {import("../index").MinifyFnResult} MinifyFnResult */
/** @typedef {import("imagemin").Options} ImageminOptions */

/**
 * @typedef {Object} MetaData
 * @property {Array<Error>} warnings
 * @property {Array<Error>} errors
 */

/**
 * @param {Error} error
 * @param {MetaData} [metaData]
 * @param {string} [type]
 */
function log(error, metaData, type) {
  if (metaData) {
    if (type === "error") {
      if (typeof metaData.errors === "undefined") {
        metaData.errors = [];
      }

      // Todo remove this name (name already exist and equal "InvalidConfigError")
      error.name = "ConfigurationError";

      metaData.errors.push(error);
    } else {
      if (typeof metaData.warnings === "undefined") {
        metaData.warnings = [];
      }

      metaData.warnings.push(error);
    }

    return;
  }

  throw error;
}

class InvalidConfigError extends Error {
  /**
   * @param {string | undefined} message
   */
  constructor(message) {
    super(message);

    this.name = "InvalidConfigError";
  }
}

/**
 * @param {ImageminMinimizerOptions} minimizerOptions
 * @param {MetaData} [metaData]
 */
function imageminNormalizeConfig(minimizerOptions, metaData) {
  if (
    !minimizerOptions ||
    !minimizerOptions.plugins ||
    (minimizerOptions.plugins && minimizerOptions.plugins.length === 0)
  ) {
    log(
      new Error("No plugins found for `imagemin`. Please read documentation."),
      metaData
    );

    return minimizerOptions;
  }

  const imageminConfig = klona(minimizerOptions);

  if (!imageminConfig.pluginsMeta) {
    imageminConfig.pluginsMeta = [];
  }

  imageminConfig.plugins = imageminConfig.plugins
    .map((plugin) => {
      const isPluginArray = Array.isArray(plugin);

      if (typeof plugin === "string" || isPluginArray) {
        const pluginName = isPluginArray
          ? /** @type {[string, object]} */ (plugin)[0]
          : /** @type {string} */ (plugin);
        const pluginOptions = isPluginArray
          ? /** @type {[string, object]} */ (plugin)[1]
          : undefined;

        let requiredPlugin = null;
        let requiredPluginName = `imagemin-${pluginName}`;

        try {
          // eslint-disable-next-line import/no-dynamic-require
          requiredPlugin = require(requiredPluginName)(pluginOptions);
        } catch {
          requiredPluginName = pluginName;

          try {
            // eslint-disable-next-line import/no-dynamic-require
            requiredPlugin = require(requiredPluginName)(pluginOptions);
          } catch {
            const pluginNameForError = pluginName.startsWith("imagemin")
              ? pluginName
              : `imagemin-${pluginName}`;

            log(
              new Error(
                `Unknown plugin: ${pluginNameForError}\n\nDid you forget to install the plugin?\nYou can install it with:\n\n$ npm install ${pluginNameForError} --save-dev\n$ yarn add ${pluginNameForError} --dev`
              ),
              metaData
            );

            return false;
          }
          // Nothing
        }

        let version = "unknown";

        try {
          // eslint-disable-next-line import/no-dynamic-require
          ({ version } = require(`${requiredPluginName}/package.json`));
        } catch {
          // Nothing
        }

        /** @type {Array<Object>} imageminConfig.pluginsMeta */
        (imageminConfig.pluginsMeta).push([
          {
            name: requiredPluginName,
            options: pluginOptions || {},
            version,
          },
        ]);

        return requiredPlugin;
      }

      log(
        new InvalidConfigError(
          `Invalid plugin configuration "${JSON.stringify(
            plugin
          )}, plugin configuraion should be 'string' or '[string, object]'"`
        ),
        metaData,
        "error"
      );

      return false;
    })
    .filter(Boolean);

  return imageminConfig;
}

/**
 * @param {MinifyFnResult} original
 * @param {ImageminMinimizerOptions} minimizerOptions
 * @returns {Promise<MinifyFnResult>}
 */
async function imageminMinify(original, minimizerOptions) {
  let imagemin;

  try {
    imagemin = require("imagemin");
  } catch (error) {
    original.errors.push(error);

    return original;
  }

  // Implement autosearch config on root directory of project in future
  const minimizerOptionsNormalized = /** @type {ImageminOptions} */ (
    imageminNormalizeConfig(minimizerOptions, original)
  );

  let result;

  try {
    result = await imagemin.buffer(original.data, minimizerOptionsNormalized);
  } catch (error) {
    original.errors.push(error);

    return original;
  }

  const extInput = path.extname(original.filename).slice(1).toLowerCase();
  const { ext: extOutput } = fileTypeFromBuffer(result) || {};

  if (extOutput && extInput !== extOutput) {
    original.warnings.push(
      new Error(
        `"imageminMinify" function do not support generate to "${extOutput}" from "${original.filename}". Use "imageminGenerate"`
      )
    );

    return original;
  }

  return {
    filename: original.filename,
    data: result,
    warnings: [],
    errors: [],
    info: {
      ...original.info,
      minimized: true,
      minimizedBy:
        original.info && original.info.minimizedBy
          ? ["imagemin", ...original.info.minimizedBy]
          : ["imagemin"],
    },
  };
}

export default imageminMinify;
export { imageminNormalizeConfig };
