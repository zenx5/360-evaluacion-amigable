
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Users, Trash2, Edit } from "lucide-react";
import { ManageGroupMembersDialog } from "./ManageGroupMembersDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EmployeeGroup {
  id: string;
  name: string;
  created_at: string;
  member_count: { count: number };
}

export const EmployeeGroupList = () => {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ['employee_groups'],
    queryFn: async () => {
      // employee_groups
      const { data, error } = await supabase.from('employee_groups').select('*');
      console.log( data, error )
      if (error) throw error;
      
      // return (data || []).map(group => ({
      //   id: group.id,
      //   name: group.name,
      //   created_at: group.created_at,
      //   member_count: { count: 0 }
      // })) as EmployeeGroup[];
    }
  });

  // Mutación para eliminar grupo
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('employee_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Grupo eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['employee_groups'] });
    },
    onError: (error) => {
      toast.error('Error al eliminar el grupo: ' + error.message);
    },
  });

  // Mutación para editar nombre del grupo
  const updateGroupNameMutation = useMutation({
    mutationFn: async ({ groupId, name }: { groupId: string; name: string }) => {
      const { error } = await supabase
        .from('employee_groups')
        .update({ name })
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Nombre del grupo actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['employee_groups'] });
      setEditingGroup(null);
    },
    onError: (error) => {
      toast.error('Error al actualizar el nombre del grupo: ' + error.message);
    },
  });

  const handleDelete = (groupId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      deleteGroupMutation.mutate(groupId);
    }
  };

  const handleEdit = (group: { id: string; name: string }) => {
    setEditingGroup(group);
    setNewName(group.name);
  };

  const handleUpdateName = () => {
    if (editingGroup && newName.trim()) {
      updateGroupNameMutation.mutate({
        groupId: editingGroup.id,
        name: newName.trim()
      });
    }
  };

  if (isLoading) return <div>Cargando grupos...</div>;

  return (
    <>
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
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGroup({ id: group.id, name: group.name })}
                  className="mr-2"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Miembros
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(group)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(group.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedGroup && (
        <ManageGroupMembersDialog
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          open={!!selectedGroup}
          onOpenChange={(open) => !open && setSelectedGroup(null)}
        />
      )}

      <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nombre del Grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nuevo nombre del grupo"
            />
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleUpdateName}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
