import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { LoaderCircle, Image as ImageIcon } from "lucide-react";

// AVISO: A chave de API está exposta no código do cliente.
// Isso não é seguro para produção. Use apenas para testes locais.
const GOOGLE_AI_API_KEY = "AIzaSyAGsM7N3HHB5YctX4ERDMvKrhTV98JtlyY";

// IMPORTANTE: Este deve ser o seu ID de projeto do Google Cloud.
const GOOGLE_CLOUD_PROJECT_ID = "vucfaxjhxuvwswwytbwt"; 
const GOOGLE_AI_API_URL = `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/imagegeneration:predict`;

const ImageGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showError("Por favor, insira um prompt.");
      return;
    }
    setLoading(true);
    setImageUrl("");

    try {
      const response = await fetch(GOOGLE_AI_API_URL, {
        method: "POST",
        headers: {
          // CORREÇÃO: A API do Google Vertex AI espera a chave de API neste cabeçalho.
          "x-goog-api-key": GOOGLE_AI_API_KEY,
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
        const errorBody = await response.json();
        console.error("Google AI API Error:", errorBody);
        const errorMessage = errorBody?.error?.message || "Falha ao gerar a imagem na API do Google AI.";
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        setImageUrl(`data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`);
        showSuccess("Imagem gerada com sucesso!");
      } else {
        throw new Error("A resposta da API não continha uma imagem.");
      }

    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : "Falha ao gerar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerador de Imagens com Google AI</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes da Imagem</CardTitle>
              <CardDescription>Descreva a imagem que você quer criar usando o poder do Google Imagen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Input 
                  id="prompt" 
                  placeholder="Ex: Um astronauta surfando em um anel de Saturno" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Imagem
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>A imagem gerada aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-96 min-h-[400px] bg-muted rounded-md">
            {loading ? (
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            ) : imageUrl ? (
              <img src={imageUrl} alt={prompt} className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p>Sua imagem aparecerá aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;