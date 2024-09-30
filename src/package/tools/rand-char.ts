// _Message 随机字符串
export function randChar(length = 8, characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  const charactersArr = characters.split(""); //分割字符。
  let result = ""; //返回的结果。
  while (result.length < length) result += charactersArr[Math.round(Math.random() * characters.length)];

  return result;
}

export default randChar;
