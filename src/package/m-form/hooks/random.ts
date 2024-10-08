// _Function 生成随机字符串
function random(prefix = "", randomLength = 8) {
  const nameArr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "g",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ]
  ];
  // 随机名字字符串
  let name = prefix;
  // 循环遍历从用户词典中随机抽出一个
  for (let i = 0; i < randomLength; i++) {
    // 随机生成index
    const index = Math.floor(Math.random() * 2);
    let zm: string = String(nameArr[index][Math.floor(Math.random() * nameArr[index].length)]);
    // 如果随机出的是英文字母
    if (index === 1) {
      // 则百分之50的概率变为大写
      if (Math.floor(Math.random() * 2) === 1) {
        zm = zm.toUpperCase();
      }
    }
    // 拼接进名字变量中
    name += zm;
  }
  // 将随机生成的名字返回
  return name;
}

export { random };
