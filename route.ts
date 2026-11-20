import { NextResponse } from "next/server";

export const runtime = "nodejs";

const schema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    logline: { type: "STRING" },
    characters: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" } }, required: ["name","description"] } },
    scenes: { type: "ARRAY", items: { type: "OBJECT", properties: {
      number: { type: "INTEGER" }, duration: { type: "STRING" }, narration: { type: "STRING" }, visual: { type: "STRING" },
      imagePrompt: { type: "STRING" }, videoPrompt: { type: "STRING" }, sound: { type: "STRING" }
    }, required: ["number","duration","narration","visual","imagePrompt","videoPrompt","sound"] } },
    ending: { type: "STRING" }, youtubeTitle: { type: "STRING" }, description: { type: "STRING" }, hashtags: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["title","logline","characters","scenes","ending","youtubeTitle","description","hashtags"]
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI is not connected yet. Add GEMINI_API_KEY to the server environment, then redeploy." }, { status: 503 });
    const body = await request.json();
    const { idea, category, language, style, format, duration } = body ?? {};
    if (typeof idea !== "string" || !idea.trim() || idea.length > 1000) return NextResponse.json({ error: "Please enter an idea between 1 and 1000 characters." }, { status: 400 });

    const prompt = `You are Sasu.ai, a professional short-form video story and storyboard director. Create an original, coherent story based on this idea.
User idea: ${idea}
Category: ${category}; Language: ${language}; Visual style: ${style}; Aspect ratio: ${format}; Target duration: ${duration}.
Return the entire response in valid JSON matching the supplied schema. Use the requested language for title, logline, character descriptions, narration, visual action, ending, YouTube title and description. Image and video prompts should be detailed and written in English for compatibility with generation tools. Create enough scenes to cover the duration (usually 4-6 for 30 seconds, 8-12 for 60 seconds, 12-16 for 90 seconds). Every scene needs its own distinct image prompt; do not reuse a scene image. Repeat exact character visual details in prompts whenever characters appear. Keep character appearance, clothing, colors, proportions and age consistent. Narration should fit the scene duration. Video prompts must describe movement, facial expressions, camera movement and environmental motion. Avoid copyrighted characters and existing franchise styles.`;

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.8 } })
    });
    const payload = await response.json();
    if (!response.ok) return NextResponse.json({ error: payload?.error?.message || "The AI provider could not complete this request." }, { status: 502 });
    const raw = payload?.candidates?.[0]?.content?.parts?.map((p: {text?:string})=>p.text || "").join("");
    if (!raw) return NextResponse.json({ error: "The AI returned an empty response. Please try again." }, { status: 502 });
    let parsed;
    try { parsed = JSON.parse(raw); } catch { return NextResponse.json({ error: "The AI response could not be read. Please try again." }, { status: 502 }); }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Unexpected server error. Please try again." }, { status: 500 });
  }
}
