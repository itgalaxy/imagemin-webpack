import ImageMinimizerPlugin from '../src';

it('validation', () => {
  /* eslint-disable no-new */
  expect(() => {
    new ImageMinimizerPlugin({ test: /foo/ });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: 'foo' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: ['foo', 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: [/foo/, 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ test: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ test: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ include: /foo/ });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: 'foo' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: ['foo', 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: [/foo/, 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ include: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ include: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: /foo/ });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: 'foo' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: ['foo', 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: [/foo/, 'bar'] });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ exclude: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ filter: () => true });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ filter: () => false });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ filter: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ filter: {} });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ cache: false });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ cache: true });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ cache: 'path/to/cache' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ cache: {} });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ filename: '[name].[ext]' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ filename: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ filename: {} });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ severityError: false });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ severityError: true });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ severityError: 'error' });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ severityError: () => {} });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ keepOriginal: false });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ keepOriginal: {} });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ keepOriginal: true });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ minimizerOptions: {} });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ minimizerOptions: null });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({
      minimizerOptions: { plugins: [] },
    });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ maxConcurrency: 2 });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ maxConcurrency: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ maxConcurrency: 'true' });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new ImageMinimizerPlugin({ loader: false });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ loader: true });
  }).not.toThrow();

  expect(() => {
    new ImageMinimizerPlugin({ loader: 'true' });
  }).toThrowErrorMatchingSnapshot();
  /* eslint-enable no-new */
});
