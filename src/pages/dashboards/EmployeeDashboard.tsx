
import { useEffect, useState } from "react";
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
import { EvaluationForm } from "@/components/EvaluationForm";
import Profile from "@/integrations/firebase/models/Profile";
import Evaluation from "@/integrations/firebase/models/Evaluation";

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

const EmployeeDashboard = ({ profileId, profileName }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [userGroups, setUserGroups] = useState([])

  useEffect(() => {
    if( profileId) {
      Profile.onSnapDetailed( data => {
        setUserGroups( data?.groups ?? [])
        setIsLoading( false )
      }, profileId)
    }
  }, [navigate]);

  

  const handleLogout = async () => {
    sessionStorage.removeItem('user--data')
    navigate("/")
  };

  if (isLoading) {
    return <div className="container mx-auto p-8">Cargando grupos...</div>;
  }

  if (isError) {
    toast.error("Error al cargar los grupos");
    return <div className="container mx-auto p-8">Error al cargar los grupos.</div>;
  }

  const handleOpen = (data) => {
    setEvaluation( data )
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
      { evaluation && <EvaluationForm onClose={()=>{setEvaluation(null)}} />}
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Grupos</h2>
          {!userGroups?.length ? (
            <p className="text-gray-500">No perteneces a ningún grupo todavía.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {userGroups.map((group) => (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {group.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4">
                      <h3 className="font-medium text-gray-700">Miembros del grupo:</h3>
                      <div className="grid gap-3">
                        {group.members.map((profileId) => <Member profileId={profileId} groupId={group.id} onOpen={handleOpen}/> )}
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

function Member({ profileId, groupId, onOpen }:{ profileId:string, groupId:string, onOpen?:(data)=>void }) {
  const [member, setMember] = useState<{ full_name:string, id:string }>()
  useEffect(()=>{
    Profile.onSnap( data =>  {
      setMember(data)
    }, profileId)

  },[profileId])

  const createEvaluation = async () => {
    const user = JSON.parse( sessionStorage.getItem('user--data') )
    if( !user ) {
      toast.success('Session expirada');
    }

    try {

      const { error, data } = await Evaluation.create(user.id, profileId, groupId)
      
      if (error) throw error;

      toast.success('Evaluación creada exitosamente');
      if(onOpen) onOpen(data)
    } catch (error: any) {
      toast.error('Error al crear la evaluación: ' + error.message);
    }
  };

  return (
    <div
      key={profileId}
      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
    >
      <span>{member?.full_name}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={createEvaluation}
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Evaluar
      </Button>
    </div>
  )
}

export default EmployeeDashboard;
