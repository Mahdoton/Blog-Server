window.onload = function () {
  async function testAsync() {

  }
  const result = testAsync();
  console.log(result);
  // 微任务
  testAsync().then(v => {
    console.log(v);    // 输出 hello async
  });


  // 2s 之后返回双倍的值
  function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2 * num)
      }, 2000);
    })
  }

  async function testResult() {
    console.log('内部调用前') // 2
    let result = await doubleAfter2seconds(30);
    console.log(result); // 4
    console.log('内部调用后') // 5
  }

  console.log('外部调用前') // 1
  testResult();
  console.log('外部调用后') // 3
  // --- 依次输出
  // 外部调用前
  // 内部调用前
  // 外部调用后
  // --- 2s 之后输出
  // 60
  // 内部调用后
}