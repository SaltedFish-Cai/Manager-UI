import inBrowser from "@/package/tools/inBrowser";

/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  let hexs: any = "";
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return window.log.warning("输入错误的hex");
  str = str.replace("#", "");
  hexs = str.match(/../g);
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
  const reg = /^\d{1,3}$/;
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return window.log.error("输入错误的rgb颜色值");
  const hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
  return `#${hexs.join("")}`;
}

/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number): string {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return window.log.error("输入错误的hex颜色值");
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number): string {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return window.log.error("输入错误的hex颜色值");
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// _Function 设置主题色
export function setThemeColor(themeColor: string, isDark: boolean) {
  if (!inBrowser) return;

  const style = window.document?.documentElement.style || null;
  style?.setProperty("--el-color-primary", themeColor);
  style?.setProperty(
    "--el-color-primary-dark-2",
    isDark ? `${getLightColor(themeColor, 0.2)}` : `${getDarkColor(themeColor, 0.3)}`
  );

  for (let i = 1; i <= 9; i++) {
    const infoColor = isDark ? `${getDarkColor("#909399", i / 10)}` : `${getLightColor("#909399", i / 10)}`;
    style?.setProperty(`--el-color-info-light-${i}`, infoColor);

    const successColor = isDark ? `${getDarkColor("#67c23a", i / 10)}` : `${getLightColor("#67c23a", i / 10)}`;
    style?.setProperty(`--el-color-success-light-${i}`, successColor);

    const warningColor = isDark ? `${getDarkColor("#e6a23c", i / 10)}` : `${getLightColor("#e6a23c", i / 10)}`;
    style?.setProperty(`--el-color-warning-light-${i}`, warningColor);

    const dangerColor = isDark ? `${getDarkColor("#f56c6c", i / 10)}` : `${getLightColor("#f56c6c", i / 10)}`;
    style?.setProperty(`--el-color-danger-light-${i}`, dangerColor);

    const primaryColor = isDark ? `${getDarkColor(themeColor, i / 10)}` : `${getLightColor(themeColor, i / 10)}`;
    style?.setProperty(`--el-color-primary-light-${i}`, primaryColor);
  }
}
