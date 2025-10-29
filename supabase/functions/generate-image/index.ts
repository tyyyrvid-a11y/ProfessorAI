import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// IMPORTANTE: O ID do projeto aqui deve ser o seu ID de projeto do Google Cloud.
// O ID do projeto Supabase (vucfaxjhxuvwswwytbwt) provavelmente NÃO é o correto.
// Se o erro persistir, verifique e substitua este valor.
const GOOGLE_CLOUD_PROJECT_ID = "vucfaxjhxuvwswwytbwt"; 
const GOOGLE_AI_API_URL = `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/imagegeneration:predict`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "O prompt é obrigatório." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const googleApiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!googleApiKey) {
        return new Response(JSON.stringify({ error: "A chave de API do Google não está configurada nos segredos da Supabase." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch(GOOGLE_AI_API_URL, {
      method: "POST",
      headers: {
        // Correção: A API do Google Vertex AI espera a chave no header 'x-goog-api-key'.
        "x-goog-api-key": googleApiKey,
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
      const errorBody = await response.json(); // Tenta ler o erro como JSON para mais detalhes.
      console.error("Google AI API Error:", errorBody);
      const errorMessage = errorBody?.error?.message || "Falha ao gerar a imagem na API do Google AI.";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    if (!data.predictions || data.predictions.length === 0 || !data.predictions[0].bytesBase64Encoded) {
        console.error("Resposta inesperada da API do Google:", data);
        return new Response(JSON.stringify({ error: "A resposta da API do Google não continha os dados da imagem esperados." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

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