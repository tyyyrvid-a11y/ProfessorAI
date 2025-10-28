import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getGroqCompletion } from "@/lib/groq";
import { showError } from "@/utils/toast";
import { LoaderCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu assistente de IA. Como posso ajudar você hoje com suas tarefas de ensino?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const userPrompt = `O histórico da conversa é:\n${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nMinha nova mensagem é: "${input}"`;
    const systemPrompt = "Você é um assistente de IA prestativo e amigável para professores. Seu objetivo é responder a perguntas, fornecer sugestões e ajudar com várias tarefas relacionadas ao ensino. Responda diretamente à última mensagem do usuário, usando o histórico como contexto. Sempre formate suas respostas em Markdown para clareza e organização.";

    try {
      const aiResponse = await getGroqCompletion(userPrompt, systemPrompt);
      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente."
      };
      setMessages(prev => [...prev, errorMessage]);
      showError("Desculpe, não consegui processar sua mensagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Chatbot para Professores</h1>
        <p className="text-gray-500">Converse com um assistente de IA para obter ajuda com suas tarefas.</p>
      </div>
      <Card className="flex flex-1 flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xl rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Digite sua mensagem..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chatbot;