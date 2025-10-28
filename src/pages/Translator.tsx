import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getGroqCompletion } from "@/lib/groq";
import { showError } from "@/utils/toast";
import { LoaderCircle } from "lucide-react";

const Translator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    text: "",
    targetLanguage: "Inglês",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) {
      showError("Por favor, insira um texto para traduzir.");
      return;
    }
    setLoading(true);
    setResult("");

    const prompt = `Traduza o seguinte texto para ${formData.targetLanguage}. Retorne apenas o texto traduzido, sem nenhuma explicação ou formatação adicional:\n\n"${formData.text}"`;

    try {
      const completion = await getGroqCompletion(prompt);
      setResult(completion);
    } catch (error) {
      showError("Falha ao traduzir o texto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tradutor de Texto</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Texto Original</CardTitle>
              <CardDescription>Insira o texto que deseja traduzir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Texto</Label>
                <Textarea
                  id="text"
                  placeholder="Digite ou cole o texto aqui..."
                  className="h-64 min-h-[200px]"
                  value={formData.text}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetLanguage">Traduzir para</Label>
                <Select value={formData.targetLanguage} onValueChange={(value) => handleSelectChange("targetLanguage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inglês">Inglês</SelectItem>
                    <SelectItem value="Espanhol">Espanhol</SelectItem>
                    <SelectItem value="Francês">Francês</SelectItem>
                    <SelectItem value="Alemão">Alemão</SelectItem>
                    <SelectItem value="Português (Brasil)">Português (Brasil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Traduzir
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tradução</CardTitle>
            <CardDescription>O resultado da tradução aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-80 min-h-[200px] font-mono text-sm"
              placeholder="Aguardando tradução..."
              value={result}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Translator;