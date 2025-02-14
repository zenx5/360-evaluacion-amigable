
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Evaluaciones 360°</h1>
      <p className="text-gray-600">¡Bienvenido a tu dashboard!</p>
    </div>
  );
};

export default Dashboard;
