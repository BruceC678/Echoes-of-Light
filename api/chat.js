export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { base64Image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // 从系统环境读取，不写死在代码里

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [
                        { text: `Analyze image. Return ONLY JSON: {"title_en":"max 4 poetic words","title_cn":"中文标题","location_en":"City, Country","location_cn":"城市, 国家","story_en":"one deep poetic paragraph","story_cn":"一段极具人文质感的文字","theme":{"r":int,"g":int,"b":int}}` },
                        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                    ]
                }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "AI Analysis Failed" });
    }
}
