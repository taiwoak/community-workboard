import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";

type Application = {
  id: string;
  message: string;
  appliedAt: string;
  user: { name: string };
};

type Task = {
  id: string;
  title: string;
  description: string;
  createdBy: { name: string };
};

type User = {
  id: string;
  name: string;
  role: 'volunteer' | 'contributor';
};

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [message, setMessage] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          axiosInstance.get(`/tasks/${id}`),
          axiosInstance.get('/me'),
        ]);

        setTask(taskRes.data);
        setUser(userRes.data);

        if (userRes.data.role === 'contributor') {
          const appsRes = await axiosInstance.get(`/tasks/${id}/applications`);
          setApplications(appsRes.data);
        }
      } catch (err) {
        alert('Error loading task details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post(`/tasks/${id}/apply`, { message });
      setMessage('');
      alert("Application submitted!");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Application failed";
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const BackToDashboard = () => (
    <Link
      to="/dashboard"
      className="flex items-center gap-1 text-sm text-gray-800 hover:text-blue-600 transition cursor-pointer"
    >
      ← Back
    </Link>
  );

  if (loading || !task || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 animate-pulse text-lg">Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

        {user.role === 'volunteer' && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-700">
                  Apply to this task
                </h3>
                <BackToDashboard />
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Enter your application message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg font-medium
                    ${isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"}
                  `}
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </>
        )}

        {user.role === 'contributor' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Applications
              </h3>
              <BackToDashboard />
            </div>
            {applications.length === 0 ? (
              <p className="text-gray-500">No one has applied yet.</p>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div
                    key={app.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{app.user.name}</span>: {app.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Applied on: {new Date(app.appliedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
