// _Function 设置数据格式Children转小写格式
export function setTableChild(data) {
  if (Array.isArray(data)) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const _c = item.children?.length > 0 ? item.children : [];
      const _C = item.Children?.length > 0 ? item.Children : [];
      const child = [..._C, ..._c];
      data[index].children = child;
    }
  }
  return data;
}

// _Function 扁平化 tableData
export function flatTableDataFunc(tableData: [], flatArr: any = []) {
  tableData.forEach(async (col: any) => {
    if (col.children?.length) {
      flatArr.push(...flatTableDataFunc(col.children, []));
    }
    flatArr.push(col);
  });
  return flatArr;
}
