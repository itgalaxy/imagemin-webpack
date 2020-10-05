import path from 'path';

import fileType from 'file-type';

import { fixturesPath, isOptimized, webpack } from './helpers';

describe('plugin filename option', () => {
  it('should transform image to webp and remove original image (default behavior)', async () => {
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: path.resolve(__dirname, 'outputs'),
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        keepOriginal: false,
        filename: '[path][name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.webp')
    );

    const originalAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.png')
    );

    const file = path.resolve(
      __dirname,
      'outputs',
      './nested/deep/plugin-test.webp'
    );
    const ext = await fileType.fromFile(file);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(originalAssets).toHaveLength(0);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp and keep original uncompressed image', async () => {
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: path.resolve(__dirname, 'outputs'),
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        keepOriginal: true,
        filename: '[path][name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.webp')
    );

    const originalAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.png')
    );

    const file = path.resolve(
      __dirname,
      'outputs',
      './nested/deep/plugin-test.webp'
    );
    const ext = await fileType.fromFile(file);

    await expect(
      isOptimized('./nested/deep/plugin-test.png', compilation)
    ).resolves.toBe(false);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(originalAssets).toHaveLength(1);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp and keep original compressed image', async () => {
    const multiStats = await webpack([
      {
        entry: path.join(fixturesPath, './empty-entry.js'),
        output: {
          path: path.resolve(__dirname, 'outputs'),
        },
        emitPlugin: true,
        emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
        imageminPluginOptions: {
          keepOriginal: false,
          filename: '[path][name].webp',
          minimizerOptions: {
            plugins: ['imagemin-webp'],
          },
        },
      },
      {
        entry: path.join(fixturesPath, './empty-entry.js'),
        output: {
          path: path.resolve(__dirname, 'outputs'),
        },
        emitPlugin: true,
        emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
        imageminPluginOptions: {
          minimizerOptions: {
            plugins: ['pngquant'],
          },
        },
      },
    ]);

    expect(multiStats.stats).toHaveLength(2);

    const [
      { compilation },
      { compilation: secondCompilation },
    ] = multiStats.stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.webp')
    );

    const originalAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.png')
    );

    const file = path.resolve(
      __dirname,
      'outputs',
      './nested/deep/plugin-test.webp'
    );
    const ext = await fileType.fromFile(file);

    const {
      warnings: secondWarnings,
      errors: secondErrors,
    } = secondCompilation;

    expect(secondWarnings).toHaveLength(0);
    expect(secondErrors).toHaveLength(0);

    await expect(
      isOptimized('./nested/deep/plugin-test.png', secondCompilation)
    ).resolves.toBe(true);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(originalAssets).toHaveLength(0);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp (plugin + loader)', async () => {
    const stats = await webpack({
      entry: path.join(fixturesPath, './loader-single.js'),
      output: {
        path: path.resolve(__dirname, 'outputs'),
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        keepOriginal: true,
        filename: '[path][name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;
    const assetsKeys = Object.keys(assets);

    [
      'nested/deep/loader-test.webp',
      'nested/deep/loader-test.jpg',
      './nested/deep/plugin-test.png',
      './nested/deep/plugin-test.webp',
    ].forEach((asset) => {
      expect(assetsKeys.includes(asset)).toBe(true);
    });

    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });
});