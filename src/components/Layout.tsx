import { NavLink, Outlet } from "react-router-dom";
import { Book, BotMessageSquare, FileQuestion, Languages, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiKeyModal } from "./ApiKeyModal";

const navigation = [
  { name: "Gerador de Questões", href: "/", icon: FileQuestion },
  { name: "Gerador de Plano de Aula", href: "/lesson-plan", icon: Book },
  { name: "Tradutor", href: "/translator", icon: Languages },
  { name: "Chatbot para Professores", href: "/chatbot", icon: BotMessageSquare },
  { name: "Gerador de Atividades", href: "/activity-generator", icon: Sparkles },
];

export function Layout() {
  return (
    <div className="flex min-h-screen w-full">
      <ApiKeyModal />
      <aside className="w-64 flex-shrink-0 border-r bg-gray-50">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold">Ferramentas de IA</h2>
            <p className="text-sm text-gray-500">para Professores</p>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-200"
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}