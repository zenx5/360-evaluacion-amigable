
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserMinus, UserPlus } from "lucide-react";

interface ManageGroupMembersDialogProps {
  groupId: string;
  groupName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageGroupMembersDialog = ({
  groupId,
  groupName,
  open,
  onOpenChange,
}: ManageGroupMembersDialogProps) => {
  const queryClient = useQueryClient();

  // Obtener los miembros actuales del grupo
  const { data: groupMembers, isLoading: loadingMembers } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          profiles:user_id (
            full_name,
            id
          )
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      return data;
    },
  });

  // Obtener todos los empleados disponibles
  const { data: allEmployees, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'employee');

      if (error) throw error;
      return data;
    },
  });

  // Mutación para agregar miembro
  const addMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('group_members')
        .insert([{ group_id: groupId, user_id: userId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Miembro agregado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['employee_groups'] });
    },
    onError: (error) => {
      toast.error('Error al agregar miembro: ' + error.message);
    },
  });

  // Mutación para eliminar miembro
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Miembro eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['employee_groups'] });
    },
    onError: (error) => {
      toast.error('Error al eliminar miembro: ' + error.message);
    },
  });

  const memberIds = new Set(groupMembers?.map(m => m.user_id));
  const availableEmployees = allEmployees?.filter(emp => !memberIds.has(emp.id)) || [];

  if (loadingMembers || loadingEmployees) {
    return <div>Cargando...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gestionar Miembros - {groupName}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Miembros Actuales */}
          <div>
            <h3 className="font-semibold mb-2">Miembros Actuales</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupMembers?.map((member) => (
                  <TableRow key={member.user_id}>
                    <TableCell className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {member.profiles.full_name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMemberMutation.mutate(member.user_id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empleados Disponibles */}
          <div>
            <h3 className="font-semibold mb-2">Empleados Disponibles</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {employee.full_name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMemberMutation.mutate(employee.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
