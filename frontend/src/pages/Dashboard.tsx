import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import ContributorDashboard from "../components/ContributorDashboard";
import VolunteerDashboard from "../components/VolunteerDashboard";

type MeResponse = {
  role: 'contributor' | 'volunteer';
};

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<MeResponse>('/me')
      .then(res => {
        setRole(res.data.role);
        setLoading(false);
      })
      .catch(() => {
        alert('Unauthorized');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return role === 'contributor' ? <ContributorDashboard /> : <VolunteerDashboard />;
};

export default Dashboard;
