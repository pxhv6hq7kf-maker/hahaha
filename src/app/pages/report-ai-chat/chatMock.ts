/**
 * Mock Claude Code 接入模块
 *
 * 模拟「研报全文 + 用户指令 + 上传文件 -> Claude Code 分析 -> 更新内容」流程。
 * 这是唯一的 AI 接入点，将来接入真实 Claude Code 时只需替换本文件内部逻辑，
 * 调用方（ReportAIChat）无需改动。
 */

export interface UploadedFile {
  name: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  files?: UploadedFile[];
  /** AI 完成的操作列表 */
  actions?: string[];
  /** AI 生成、待用户确认替换的新研报内容 */
  pendingUpdate?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface GenerateResult {
  actions: string[];
  summary: string;
  newContent: string;
}

export interface GenerateTask {
  promise: Promise<GenerateResult>;
  cancel: () => void;
}

/** 根据指令关键词推断完成的操作 */
function inferActions(instruction: string, files: UploadedFile[]): string[] {
  const actions: string[] = [];
  if (/补充|现场|调研|纪要|走访|资料/.test(instruction)) {
    actions.push("融合现场调研素材，补全调研信息");
  }
  if (/重构|行业分析|段落|结构/.test(instruction)) {
    actions.push("重构行业分析段落，优化逻辑结构");
  }
  if (/文风|统一|风格/.test(instruction)) {
    actions.push("统一全文研报正式文风");
  }
  if (/冗余|精简|删减|压缩/.test(instruction)) {
    actions.push("删减冗余表述，精简内容");
  }
  if (/逻辑|修正|纠错/.test(instruction)) {
    actions.push("修正逻辑漏洞与数据矛盾");
  }
  if (files.length > 0) {
    actions.push(`解析并融合 ${files.length} 个上传文件素材`);
  }
  return actions;
}

/** 生成更新后的研报核心摘要（mock） */
function buildNewContent(instruction: string, files: UploadedFile[]): string {
  const hasResearch = /补充|现场|调研|纪要|走访|资料/.test(instruction);
  const source = files.length > 0 ? "最新上传调研素材" : "多维数据模型与公开资料";
  const researchNote = hasResearch
    ? "结合现场调研纪要与走访记录，进一步验证了企业在细分赛道的领先优势，海外市场拓展节奏稳健。"
    : "";
  return `本报告基于${source}，对目标企业的核心竞争力、市场占位、财务健康度及未来发展潜力进行了全面评估。${researchNote}研发投入持续加码，技术壁垒进一步巩固，预计全年业绩将保持高质量增长，长期投资价值显著。`;
}

/**
 * 模拟 Claude Code 处理：打包研报全文 + 指令 + 文件 -> 分析 -> 生成更新。
 */
export function generateUpdate(
  instruction: string,
  files: UploadedFile[],
  _reportText: string
): GenerateTask {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<GenerateResult>((resolve) => {
    // 模拟 2~3s 的分析耗时
    const delay = 2000 + Math.floor(Math.random() * 1000);
    timer = setTimeout(() => {
      const actions = inferActions(instruction, files);
      const newContent = buildNewContent(instruction, files);
      const summary = "我将基于本次提出的【修改需求】，针对性重构【对应文档】部分内容，严格适配全文专业正式文风，保障整体逻辑统一、上下文流畅连贯。";
      resolve({ actions, summary, newContent });
    }, delay);
  });
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  return { promise, cancel };
}

/** 生成简单 id */
export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
