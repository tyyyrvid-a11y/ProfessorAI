import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/toast";
import { LoaderCircle, Image as ImageIcon } from "lucide-react";
import { usePollinationsImage } from '@pollinations/react';

const ImageGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  // O hook `usePollinationsImage` irá gerar uma nova imagem sempre que `submittedPrompt` mudar.
  const imageUrl = usePollinationsImage(submittedPrompt, { width: 512, height: 512 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showError("Por favor, insira um prompt.");
      return;
    }
    setLoading(true);
    // Limpa a imagem antiga enquanto a nova está sendo gerada
    if (prompt !== submittedPrompt) {
      setSubmittedPrompt(""); 
    }
    // Define o novo prompt para acionar a geração da imagem
    setTimeout(() => setSubmittedPrompt(prompt), 100);
  };

  useEffect(() => {
    // Quando uma nova URL de imagem é recebida, paramos o indicador de carregamento.
    if (imageUrl && loading) {
      setLoading(false);
    }
  }, [imageUrl, loading]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerador de Imagens</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes da Imagem</CardTitle>
              <CardDescription>Descreva a imagem que você quer criar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Input 
                  id="prompt" 
                  placeholder="Ex: Um gato astronauta flutuando no espaço" 
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
            ) : imageUrl && submittedPrompt ? (
              <img src={imageUrl} alt={submittedPrompt} className="max-h-full max-w-full object-contain rounded-md" />
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