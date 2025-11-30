import OpenAI from "openai";

export async function POST(req) {
  const body = await req.json();
  const { match, homeForm, awayForm, injury, homecourt } = body;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const injPenalty = injury === "home" ? -12 : injury === "away" ? 12 : 0;
  const homecourtBonus = homecourt === "home" ? 5 : homecourt === "away" ? -5 : 0;

  const base = 50 + (homeForm - awayForm) * 2 + injPenalty + homecourtBonus;

  const homeWin = Math.max(5, Math.min(95, base));
  const awayWin = 100 - homeWin;

  const prompt = `
你是 Bruce NBA Model，一个严谨的稳健型预测系统。
比赛：${match}

根据以下信息输出结构化预测：
- 主队状态：${homeForm}/10
- 客队状态：${awayForm}/10
- 主客场：${homecourt}
- 伤病影响：${injury}

请输出：
【胜率】
主队：${homeWin.toFixed(1)}%
客队：${awayWin.toFixed(1)}%

【预测比分】
给出稳健区间

【稳健度】
1–10 分，偏稳健风格

【下注建议】
尽量避免风险，偏稳建议

【爆冷风险】
用 3 条关键因素说明

【战术分析】
1 段话，简明、专业。
  `;

  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return Response.json({ output: ai.choices[0].message.content });
}