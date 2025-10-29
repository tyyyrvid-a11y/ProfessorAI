import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ATENÇÃO: A URL da API do Google pode variar.
// Esta é uma URL de exemplo para o modelo Imagen via Vertex AI.
// Ajuste o `project-id` e a URL conforme necessário para a sua configuração específica.
const GOOGLE_AI_API_URL = "https://us-central1-aiplatform.googleapis.com/v1/projects/vucfaxjhxuvwswwytbwt/locations/us-central1/publishers/google/models/imagegeneration:predict";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const googleApiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!googleApiKey) {
        return new Response(JSON.stringify({ error: "API key is not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch(GOOGLE_AI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${googleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Google AI API Error:", errorBody);
      return new Response(JSON.stringify({ error: "Failed to generate image from Google AI API" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // A API do Imagen geralmente retorna a imagem como uma string base64.
    const imageBase64 = data.predictions[0].bytesBase64Encoded;

    return new Response(JSON.stringify({ imageBase64 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});