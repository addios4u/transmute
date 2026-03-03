import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

interface LayoutProps {
  activeTool: string;
  onToolSelect: (path: string) => void;
  children: React.ReactNode;
}

export function Layout({ activeTool, onToolSelect, children }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-bg-primary text-text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} onToolSelect={onToolSelect} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
