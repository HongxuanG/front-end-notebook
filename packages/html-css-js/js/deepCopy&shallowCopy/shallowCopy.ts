// 哪些方法是浅拷贝呢？
// 1. Object.assign()
// 2. [{name: 'xioaming', {name: 'xiaohong'}, {name: 'xiaohua'}}].slice()
// 3. [{name: 'xioaming', {name: 'xiaohong'}, {name: 'xiaohua'}}].concat([{name: 'jige'},{name: 'ghx'}])
// 4. let arraylike = Array.from([1,2,3,4,5])

