import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { LoaderCircle, Image as ImageIcon } from "lucide-react";

// AVISO: A chave de API está exposta no código do cliente.
// ISSO NÃO É SEGURO PARA PRODUÇÃO. Use apenas para testes locais.
// É altamente recomendável usar um backend para a chave ou o método de autenticação da Vertex AI.
const GOOGLE_AI_API_KEY = "AIzaSyAGsM7N3HHB5YctX4ERDMvKrhTV98JtlyY"; // Chave de exemplo MANTIDA

// CORREÇÃO: Usando o endpoint público do Google AI para geração de imagem
// que é compatível com a chave de API simples.
const GOOGLE_AI_API_URL = `https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-002:generateImages?key=${GOOGLE_AI_API_KEY}`;
// O projeto ID não é mais necessário para este endpoint.

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
          "Content-Type": "application/json",
          // CORREÇÃO: A chave já está na URL, este cabeçalho é opcional/removido.
        },
        body: JSON.stringify({
          // CORREÇÃO: Novo formato de body para o endpoint generativelanguage
          model: "imagen-3.0-generate-002",
          prompt: prompt,
          config: {
            numberOfImages: 1, // Solicita apenas 1 imagem
            outputMimeType: "image/png", // Tipo de saída padrão
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

      // CORREÇÃO: Acessa o campo de resposta correto (generatedImages)
      if (data.generatedImages && data.generatedImages.length > 0) {
        const base64Image = data.generatedImages[0].image.imageBytes;
        setImageUrl(`data:image/png;base64,${base64Image}`);
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
      <h1 className="text-3xl font-bold">Gerador de Imagens com Google AI 🖼️</h1>
      ---
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