
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
import { ClipboardList } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
}

export const UserList = ({ onEvaluate }: { onEvaluate: (userId: string, userName: string) => void }) => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');
      
      if (error) throw error;
      return data as Profile[];
    }
  });

  if (isLoading) return <div>Cargando usuarios...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles?.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.full_name}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEvaluate(profile.id, profile.full_name)}
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
