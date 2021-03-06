import fs from "fs";
import path from "path";

import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminSvgo from "imagemin-svgo";
import pify from "pify";

// eslint-disable-next-line import/no-extraneous-dependencies
import { extendDefaultPlugins } from "svgo";

import minify from "../src/minify";

import imageminMinify from "../src/utils/imageminMinify";

function isPromise(obj) {
  return (
    Boolean(obj) &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}

describe("minify", () => {
  it("minify should be is function", () =>
    expect(typeof minify === "function").toBe(true));

  it("should return `Promise`", () =>
    expect(
      isPromise(
        minify([{ minify: imageminMinify, input: Buffer.from("Foo") }], {
          minify: imageminMinify,
          minimizerOptions: { plugins: ["mozjpeg"] },
        })
      )
    ).toBe(true));

  it("should optimize", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["mozjpeg"],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (relative filename)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename: path.relative(process.cwd(), filename),
      minimizerOptions: {
        plugins: ["mozjpeg"],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(path.relative(process.cwd(), filename));

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should return optimized image even when optimized image large then original", async () => {
    const svgoOptions = {
      plugins: extendDefaultPlugins([
        {
          name: "addAttributesToSVGElement",
          params: {
            attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
          },
        },
      ]),
    };

    const filename = path.resolve(
      __dirname,
      "./fixtures/large-after-optimization.svg"
    );
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: { plugins: [["svgo", svgoOptions]] },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminSvgo(svgoOptions)],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should throw error on empty", async () => {
    const result = await minify([{}]);

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].toString()).toMatch(/Empty input/);
    expect(result.filename).toBeUndefined();
    expect(result.input).toBeUndefined();
    expect(result.data).toBeUndefined();
  });

  it("should throw error on empty `imagemin` options", async () => {
    const input = Buffer.from("Foo");
    const filename = path.resolve("foo.png");
    const result = await minify({ minify: imageminMinify, input, filename });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].toString()).toMatch(
      /No plugins found for `imagemin`/
    );
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);
    expect(result.data.equals(input)).toBe(true);
  });

  it("should throw error on empty `imagemin.plugins` options", async () => {
    const input = Buffer.from("Foo");
    const filename = path.resolve("foo.png");
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: { plugins: [] },
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].toString()).toMatch(
      /No plugins found for `imagemin`/
    );
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);
    expect(result.data.equals(input)).toBe(true);
  });

  it("should throw error on invalid `imagemin.plugins` options", async () => {
    const input = Buffer.from("Foo");
    const filename = path.resolve("foo.png");
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: { plugins: false },
    });

    expect(result.errors).toHaveLength(1);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].toString()).toMatch(
      /No plugins found for `imagemin`/
    );
    expect(result.errors[0].toString()).toMatch(
      "TypeError: Found non-callable @@iterator"
    );
    expect(result.filename).toBe(filename);
    expect(result.data.equals(input)).toBe(true);
  });

  it("should return original content and emit a error on invalid content (`String`)", async () => {
    const input = "Foo";
    const result = await minify({
      minify: imageminMinify,
      input,
      filename: "foo.jpg",
      minimizerOptions: { plugins: ["mozjpeg"] },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.data).toBe(input);
  });

  it("should optimize (configuration using `function`)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["mozjpeg"],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `string`)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["mozjpeg"],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `array`)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: [["mozjpeg", { quality: 0 }]],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg({ quality: 0 })],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `array` without options)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: [["mozjpeg"]],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `string` with full name)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["imagemin-mozjpeg"],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `array` with full name)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: [["imagemin-mozjpeg", { quality: 0 }]],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg({ quality: 0 })],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize (configuration using `array` with full name and without options)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: [["imagemin-mozjpeg"]],
      },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should throw error on empty `imagemin` options (configuration using `string` and starting with `imagemin`)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["imagemin-unknown"],
      },
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].toString()).toMatch(
      /Unknown plugin: imagemin-unknown/
    );
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);
    expect(result.data.equals(input)).toBe(true);
  });

  it("should optimize and throw error on unknown plugin (configuration using `string`)", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: ["imagemin-mozjpeg", "unknown"],
      },
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].toString()).toMatch(
      /Unknown plugin: imagemin-unknown/
    );
    expect(result.errors).toHaveLength(0);
    expect(result.filename).toBe(filename);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminMozjpeg()],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should optimize and throw warning on using `Function` configuration", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: {
        plugins: [imageminMozjpeg()],
      },
    });

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].toString()).toMatch(/Invalid plugin configuration/);
    expect(result.warnings).toHaveLength(0);
    expect(result.filename).toBe(filename);
  });

  it("should support svgo options", async () => {
    const svgoOptions = {
      plugins: extendDefaultPlugins([
        {
          name: "cleanupIDs",
          params: {
            prefix: "qwerty",
          },
        },
      ]),
    };

    const filename = path.resolve(__dirname, "./fixtures/svg-with-id.svg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: imageminMinify,
      input,
      filename,
      minimizerOptions: { plugins: [["svgo", svgoOptions]] },
    });

    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);

    const optimizedSource = await imagemin.buffer(input, {
      plugins: [imageminSvgo(svgoOptions)],
    });

    expect(result.data.equals(optimizedSource)).toBe(true);
  });

  it("should throw two errors", async () => {
    const filename = path.resolve(__dirname, "./fixtures/loader-test.jpg");
    const input = await pify(fs.readFile)(filename);
    const result = await minify({
      minify: [
        () => ({ errors: [new Error("fail")] }),
        () => ({ errors: [new Error("fail")] }),
      ],
      input,
      filename,
    });

    expect(result.errors).toHaveLength(2);
    expect(result.errors[0].toString()).toMatch(/Error: fail/);
    expect(result.errors[1].toString()).toMatch(/Error: fail/);
    expect(result.filename).toBe(filename);
  });
});
