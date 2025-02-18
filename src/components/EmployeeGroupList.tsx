
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
import { Users } from "lucide-react";

interface EmployeeGroup {
  id: string;
  name: string;
  created_at: string;
  member_count: { count: number };
}

export const EmployeeGroupList = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['employee_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_groups')
        .select(`
          id,
          name,
          created_at,
          member_count:group_members(count)
        `);
      
      if (error) throw error;
      
      // Transformar los datos para que coincidan con la interfaz
      return (data || []).map(group => ({
        id: group.id,
        name: group.name,
        created_at: group.created_at,
        member_count: { count: (group.member_count as any).count }
      })) as EmployeeGroup[];
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
            <TableCell>{group.member_count.count} miembros</TableCell>
            <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                // Aquí después implementaremos la gestión de miembros
                onClick={() => {}}
                className="mr-2"
              >
                <Users className="h-4 w-4 mr-2" />
                Gestionar Miembros
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
