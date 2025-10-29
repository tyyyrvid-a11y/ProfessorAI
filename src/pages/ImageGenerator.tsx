import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/toast";
import { LoaderCircle, Image as ImageIcon } from "lucide-react";
import { Image as PollinationsImage } from "@pollinations/react";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showError("Por favor, insira um prompt.");
      return;
    }
    setLoading(true);
    // Definimos o prompt submetido para acionar a geração da imagem
    setSubmittedPrompt(prompt);
  };

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
            {submittedPrompt ? (
              <PollinationsImage 
                prompt={submittedPrompt} 
                width={512} 
                height={512}
                // A biblioteca lida com o estado de carregamento, mas usamos onDone para reativar nosso botão
                onDone={() => setLoading(false)}
                className="max-h-full max-w-full object-contain rounded-md"
              />
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