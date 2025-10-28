import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getGroqCompletion } from "@/lib/groq";
import { showError } from "@/utils/toast";
import { LoaderCircle } from "lucide-react";

const LessonPlanGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    grade: "",
    duration: "50 minutos",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const prompt = `Crie um plano de aula detalhado para a matéria de "${formData.subject}", sobre o tópico "${formData.topic}", para alunos da série "${formData.grade}". A aula deve ter uma duração de aproximadamente "${formData.duration}". O plano de aula deve incluir objetivos, materiais necessários, atividades passo a passo e uma forma de avaliação.`;

    try {
      const completion = await getGroqCompletion(prompt);
      setResult(completion);
    } catch (error) {
      showError("Failed to generate lesson plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerador de Plano de Aula</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes da Aula</CardTitle>
              <CardDescription>Preencha as informações para gerar o plano de aula.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria</Label>
                <Input id="subject" placeholder="Ex: Geografia, Biologia" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tópico</Label>
                <Input id="topic" placeholder="Ex: Relevo Brasileiro, Células" value={formData.topic} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Série/Nível</Label>
                <Input id="grade" placeholder="Ex: 8º ano, Ensino Médio" value={formData.grade} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração da Aula</Label>
                <Input id="duration" value={formData.duration} onChange={handleChange} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Plano de Aula
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>O plano de aula gerado aparecerá aqui.</CardDescription>
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

export default LessonPlanGenerator;