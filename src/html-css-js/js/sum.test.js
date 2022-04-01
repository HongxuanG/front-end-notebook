const strange = require('./jestTest')
test('validator regexp and isNaN', () => {
  expect(strange()).toBe('校验不通过')
})
