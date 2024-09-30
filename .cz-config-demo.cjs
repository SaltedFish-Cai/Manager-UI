module.exports = {
  types: [
    { value: "（Your Name）feat✨", name: "✨ 特性: 一个新的特性" },
    { value: "（Your Name）fix🐞", name: "🐞 修复: 修复一个Bug" },
    { value: "（Your Name）docs📚", name: "📚 文档: 变更的只有文档" },
    { value: "（Your Name）style💅", name: "💅 样式: 空格, 分号等格式修复" },
    { value: "（Your Name）refactor🛠", name: "🛠  重构: 代码重构" },
    { value: "（Your Name）perf🐎", name: "🐎 性能: 提升性能" },
    { value: "（Your Name）test🏁", name: "🏁 测试: 添加一个测试" },
    { value: "（Your Name）revert⏪", name: "⏪ 回滚: 代码回退" },
    { value: "（Your Name）chore🗯", name: "🗯  工具:开发工具变动(构建、脚手架工具等)" },
    { value: "（Your Name）merge⌛", name: "⌛ 合并:合并代码" },
    { value: "（Your Name）build📦", name: "📦 打包: 打包发布" },
    { value: "（Your Name）ci🔧", name: "🔧 集成: 持续集成" },
    { value: "（Your Name）release🚀", name: "🚀 发布: 发布新版本" },
    { value: "（Your Name）other🌈", name: "🌈 其他: 其他改动，比如构建流程, 依赖管理" }
  ],
  messages: {
    type: "选择一种你的提交类型:",
    customScope: "请输入修改范围(可选):",
    subject: "短说明:",
    body: '长说明，使用"|"换行(可选)：',
    footer: "关联关闭的issue，例如：#31, #34(可选):",
    confirmCommit: "确定提交说明?"
  },
  skipQuestions: ["customScope", "body", "footer"],
  allowCustomScopes: true,
  allowBreakingChanges: ["特性", "修复"],
  subjectLimit: 100,
};
