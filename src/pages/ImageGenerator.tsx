import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { LoaderCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.imageBase64) {
        setImageUrl(`data:image/png;base64,${data.imageBase64}`);
        showSuccess("Imagem gerada com sucesso!");
      } else {
        throw new Error(data.error || "A resposta da API não continha uma imagem.");
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