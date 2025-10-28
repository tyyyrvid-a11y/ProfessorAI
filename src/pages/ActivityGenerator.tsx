import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getGroqCompletion } from "@/lib/groq";
import { showError } from "@/utils/toast";
import { LoaderCircle } from "lucide-react";

const ActivityGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    grade: "",
    activityType: "exercicio_fixacao",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const prompt = `Crie uma atividade do tipo "${formData.activityType.replace(/_/g, ' ')}" para a matéria de "${formData.subject}", sobre o tópico "${formData.topic}", para alunos da série "${formData.grade}". A atividade deve ser criativa, engajadora e incluir instruções claras para os alunos e, se aplicável, uma chave de resposta para o professor.`;

    try {
      const completion = await getGroqCompletion(prompt);
      setResult(completion);
    } catch (error) {
      showError("Failed to generate activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerador de Atividades</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes da Atividade</CardTitle>
              <CardDescription>Preencha as informações para gerar a atividade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria</Label>
                <Input id="subject" placeholder="Ex: Ciências, Português" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tópico</Label>
                <Input id="topic" placeholder="Ex: Sistema Solar, Pontuação" value={formData.topic} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Série/Nível</Label>
                <Input id="grade" placeholder="Ex: 4º ano, Ensino Fundamental I" value={formData.grade} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityType">Tipo de Atividade</Label>
                <Select value={formData.activityType} onValueChange={(value) => handleSelectChange("activityType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exercicio_fixacao">Exercício de Fixação</SelectItem>
                    <SelectItem value="caca_palavras">Caça-palavras</SelectItem>
                    <SelectItem value="palavras_cruzadas">Palavras Cruzadas</SelectItem>
                    <SelectItem value="problema_matematico">Problema Matemático</SelectItem>
                    <SelectItem value="experimento_simples">Experimento Simples</SelectItem>
                    <SelectItem value="debate_em_grupo">Debate em Grupo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Atividade
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>A atividade gerada aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-96 min-h-[400px] font-mono text-sm"
              placeholder="Aguardando geração..."
              value={result}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityGenerator;