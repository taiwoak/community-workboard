import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import Logout from "./Logout";
import { Link } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  description: string;
  createdBy: { name: string };
};

const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axiosInstance.get('/tasks').then(res => setTasks(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
        <Logout />
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Tasks</h2>

        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available at the moment.</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-700">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-400 mt-1">Posted by: {task.createdBy?.name || "Unknown"}</p>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-blue-600 hover:underline font-medium mt-2 inline-block"
                >
                  Apply →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
