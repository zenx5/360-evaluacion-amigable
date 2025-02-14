
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserList } from "@/components/UserList";
import { EvaluationForm } from "@/components/EvaluationForm";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [evaluatingUser, setEvaluatingUser] = useState<{ id: string; name: string } | null>(null);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };

  const handleEvaluate = (userId: string, userName: string) => {
    setEvaluatingUser({ id: userId, name: userName });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Evaluaciones 360°</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Usuarios para Evaluar</h2>
        <UserList onEvaluate={handleEvaluate} />
      </div>

      {evaluatingUser && (
        <EvaluationForm
          userId={evaluatingUser.id}
          userName={evaluatingUser.name}
          onClose={() => setEvaluatingUser(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
