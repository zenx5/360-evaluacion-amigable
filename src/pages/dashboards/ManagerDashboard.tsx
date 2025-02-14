
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserList } from "@/components/UserList";
import { EmployeeGroupList } from "@/components/EmployeeGroupList";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };

  const handleEvaluateGroup = (groupId: string, groupName: string) => {
    // Aquí implementaremos la lógica para crear evaluaciones para el grupo
    toast.info(`Próximamente: Crear evaluación para ${groupName}`);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Manager</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Grupos de Empleados</h2>
            <CreateGroupDialog />
          </div>
          <EmployeeGroupList onEvaluate={handleEvaluateGroup} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Todos los Empleados</h2>
          <UserList onEvaluate={(userId, userName) => {}} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
