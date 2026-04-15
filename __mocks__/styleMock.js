// Mock for CSS modules and styles
module.exports = {
  // Mock CSS classes as empty strings
  '': '',
  // Mock any CSS class name to return itself
  ...(new Array(100).fill(0).reduce((acc, _, i) => {
    acc[`class-${i}`] = `class-${i}`;
    return acc;
  }, {})),
};
