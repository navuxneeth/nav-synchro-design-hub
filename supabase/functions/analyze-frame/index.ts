import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frameName, analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a design analysis AI specialized in ${analysisType} analysis.

Analyze the "${frameName}" frame and provide 3-5 specific issues with:
- Issue description
- Severity (Low, Medium, or High)
- Concrete suggestion for improvement

Return ONLY a JSON array in this exact format:
[
  {
    "issue": "Issue description",
    "severity": "Medium",
    "suggestion": "Specific actionable suggestion"
  }
]

Focus on real, practical design issues that a designer can act on immediately.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze ${analysisType} for the ${frameName} frame.` }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let analysisResults = data.choices[0].message.content;
    
    // Try to extract JSON if it's wrapped in markdown
    const jsonMatch = analysisResults.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      analysisResults = jsonMatch[1];
    }
    
    // Parse and validate the JSON
    let results = JSON.parse(analysisResults);
    
    // Ensure it's an array
    if (!Array.isArray(results)) {
      results = [results];
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-frame error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
