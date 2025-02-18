
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GroupMember {
  profiles: {
    id: string;
    full_name: string | null;
  };
}

interface Group {
  id: string;
  name: string;
  members: GroupMember[];
}

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const { data: userGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['user_groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('employee_groups')
        .select(`
          id,
          name,
          members:group_members(
            profiles(
              id,
              full_name
            )
          )
        `)
        .in('id', (
          supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id)
        ));

      if (error) throw error;
      return data as Group[];
    }
  });

  // Mutation para crear una nueva evaluación
  const createEvaluation = async (evaluatedId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Usuario no encontrado');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('evaluations')
        .insert({
          evaluator_id: user.id,
          evaluated_id: evaluatedId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Evaluación creada exitosamente');
      // Aquí podrías redirigir al usuario a la página de evaluación
      // navigate(`/evaluation/${data.id}`);
    } catch (error: any) {
      toast.error('Error al crear la evaluación: ' + error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };

  if (isLoadingGroups) {
    return <div className="container mx-auto p-8">Cargando grupos...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Grupos</h2>
          {userGroups?.length === 0 ? (
            <p className="text-gray-500">No perteneces a ningún grupo todavía.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {userGroups?.map((group) => (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {group.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4">
                      <h3 className="font-medium text-gray-700">Miembros del grupo:</h3>
                      <div className="grid gap-3">
                        {group.members.map(({ profiles: member }) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                          >
                            <span>{member.full_name}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => createEvaluation(member.id)}
                            >
                              <ClipboardList className="h-4 w-4 mr-2" />
                              Evaluar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
