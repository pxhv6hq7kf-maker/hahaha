/**
 * Mock AI 生成模块
 *
 * 当前为演示性实现：按动作类型对选中文本做轻量变换 + 模拟网络延时。
 * 这是唯一的 AI 接入点 —— 将来接入真实大模型 API 时，只需替换本文件内部逻辑，
 * 调用方（Report 页）无需改动。
 */

export type AIAction =
  | "polish" // AI 润色
  | "compress" // 精简压缩
  | "expand" // 内容扩写
  | "correct" // 纠错修正
  | "supplement"; // 补充信息（AI 填入）

export interface AIGenerateOptions {
  /** 补充信息场景下用户在弹窗中输入的内容 */
  userInput?: string;
  /** 选中内容的上下文，辅助补充信息生成 */
  context?: string;
}

export interface AIGenerateTask {
  promise: Promise<string>;
  /** 取消生成：中止延时，promise 不再 resolve */
  cancel: () => void;
}

/** 压缩空白并去首尾 */
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

/** 取第一句（到首个句号/分号/换行） */
const firstSentence = (s: string) => {
  const m = normalize(s).split(/[。；！？\n]/)[0];
  return m ? `${m}。` : normalize(s);
};

/**
 * 按动作对文本做演示性变换。
 * 真实接入时，此处改为调用大模型，根据 action 构造不同 prompt。
 */
function transform(
  action: AIAction,
  selectedText: string,
  options: AIGenerateOptions = {}
): string {
  const text = normalize(selectedText);
  const tail = text.endsWith("。") ? "" : "。";

  switch (action) {
    case "polish": {
      // 润色：统一为研报正式口吻，轻度改写
      const core = text.replace(/[。]+$/, "");
      return `整体而言，${core}，呈现出稳健向好的发展态势${tail}`;
    }
    case "compress": {
      // 精简压缩：保留核心句，去除冗余
      return firstSentence(selectedText);
    }
    case "expand": {
      // 内容扩写：在原文基础上补充展开
      const core = text.replace(/[。]+$/, "");
      return `${core}。值得注意的是，这一趋势在细分赛道表现尤为突出，叠加政策端持续利好与产业链协同深化，预计未来将释放更大的增长空间。`;
    }
    case "correct": {
      // 纠错修正：清理重复标点与多余空白
      return normalize(selectedText)
        .replace(/，+/g, "，")
        .replace(/[。]{2,}/g, "。")
        .replace(/\s+/g, " ");
    }
    case "supplement": {
      // 补充信息 AI 填入：基于用户输入优化为研报风格
      const input = normalize(options.userInput || "");
      if (!input) return "";
      const ctx = normalize(options.context || "");
      const lead = ctx ? "结合上述分析，" : "";
      return `进一步来看，${input.replace(/[。]+$/, "")}。${lead}这一因素将对企业中长期竞争力产生积极影响，建议持续关注其落地节奏与边际变化。`;
    }
    default:
      return selectedText;
  }
}

/**
 * 模拟异步 AI 生成。
 * @returns task.promise 在延时后 resolve 为生成结果；task.cancel() 可中止。
 */
export function aiGenerate(
  action: AIAction,
  selectedText: string,
  options: AIGenerateOptions = {}
): AIGenerateTask {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<string>((resolve) => {
    // 模拟 1.2~2.0s 的生成耗时
    const delay = 1200 + Math.floor(Math.random() * 800);
    timer = setTimeout(() => resolve(transform(action, selectedText, options)), delay);
  });
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  return { promise, cancel };
}
