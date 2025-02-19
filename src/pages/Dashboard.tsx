
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./dashboards/AdminDashboard";
import ManagerDashboard from "./dashboards/ManagerDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse( sessionStorage.getItem('user--data') )

      if (!user) {
        navigate('/');
      }
      console.log( user )
      setProfile( user )
      setIsLoading( false )
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!profile) {
    return null;
  }

  switch (profile.role) {
    case 'admin':
      return "<AdminDashboard />";
    case 'manager':
      return <ManagerDashboard  profileId={profile.id} profileName={profile.full_name} />;
    case 'employee':
      return <EmployeeDashboard profileId={profile.id} profileName={profile.full_name} />;
    default:
      toast.error("Rol no válido");
      return null;
  }
};

export default Dashboard;
