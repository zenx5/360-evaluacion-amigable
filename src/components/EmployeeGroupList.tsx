
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList } from "lucide-react";

interface EmployeeGroup {
  id: string;
  name: string;
  created_at: string;
  _count: {
    members: number;
  };
}

export const EmployeeGroupList = ({ onEvaluate }: { onEvaluate: (groupId: string, groupName: string) => void }) => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['employee_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_groups')
        .select(`
          id,
          name,
          created_at,
          _count {
            members: group_members(count)
          }
        `);
      
      if (error) throw error;
      return data as EmployeeGroup[];
    }
  });

  if (isLoading) return <div>Cargando grupos...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Grupo</TableHead>
          <TableHead>Miembros</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups?.map((group) => (
          <TableRow key={group.id}>
            <TableCell>{group.name}</TableCell>
            <TableCell>{group._count.members} miembros</TableCell>
            <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEvaluate(group.id, group.name)}
                className="mr-2"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Evaluar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
