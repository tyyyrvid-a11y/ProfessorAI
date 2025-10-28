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

const QuestionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    questionType: "multiple_choice",
    numQuestions: "5",
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

    const userPrompt = `Crie ${formData.numQuestions} questões do tipo "${formData.questionType}" para uma prova de ${formData.subject} sobre o tópico "${formData.topic}". Inclua as respostas corretas.`;
    const systemPrompt = "Você é um especialista na criação de avaliações educacionais. Sua tarefa é gerar questões de prova de alta qualidade com base nas especificações do usuário. Formate a saída de forma clara, separando cada questão e sua respectiva resposta. Sempre inclua as respostas corretas.";

    try {
      const completion = await getGroqCompletion(userPrompt, systemPrompt);
      setResult(completion);
    } catch (error) {
      showError("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerador de Questões para Prova</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes da Prova</CardTitle>
              <CardDescription>Preencha as informações para gerar as questões.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria</Label>
                <Input id="subject" placeholder="Ex: História, Matemática" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tópico</Label>
                <Input id="topic" placeholder="Ex: Revolução Francesa, Equações" value={formData.topic} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionType">Tipo de Questão</Label>
                <Select value={formData.questionType} onValueChange={(value) => handleSelectChange("questionType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                    <SelectItem value="true_false">Verdadeiro ou Falso</SelectItem>
                    <SelectItem value="short_answer">Resposta Curta</SelectItem>
                    <SelectItem value="essay">Dissertativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Número de Questões</Label>
                <Input id="numQuestions" type="number" min="1" max="20" value={formData.numQuestions} onChange={handleChange} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Questões
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>As questões geradas aparecerão aqui.</CardDescription>
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

export default QuestionGenerator;