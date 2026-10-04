# 旅行模板与交接规范 v1 审阅包

这是已确认网页样式对应的第一版数据标准，不是新旅行方案。日常手机流程只需把“旅行规划-完整指令包.md”给规划对话，最后把它返回的一份JSON交给同一仓库的Cloud Codex。图片仅填网上URL，不附图片文件。

HTML用于参考：CSS/JS内嵌，日期和卡片可交互，照片仍需联网；不带高德凭据，真实地图沿用线上Cloudflare环境。模板源代码zip和代码参考md是可读代码档案，不要求每次上传。

Schema与MD字段字典对应；template-contract.json固定已确认样式。trip-template.json为空白draft，长沙文件是reference，发布只接受ready。用create新增旅行、update更新同一旅行；新城市新ID，共用域名但链接不同，保留原旅行。

仓库校验：python3 scripts/validate-travel-handoff.py <文件.json> --require-ready。独立解压包可用 python3 工具/validate-travel-handoff.py trip-changsha-reference.json 做结构校验（需安装jsonschema；reference不进入发布）。真正发布需现有仓库与配置，参阅发布执行指令。

当前网站仍使用已有注册入口；本包提供规范化Trip导入方法和校验工具，没有假定已存在“一键上传JSON”的网站后台。后续可以在这份标准上实现通用上传/注册。
