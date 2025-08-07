import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import Logout from "./Logout";
import { Link } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  description: string;
};

const ContributorDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () =>
    axiosInstance.get('/my-posted-tasks').then(res => setTasks(res.data));

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosInstance.post('/tasks', { title, description });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contributor Dashboard</h1>
        <Logout />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-10 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Task</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task Title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Task Description"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Posted Tasks</h2>
        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <p className="text-gray-500">You haven’t posted any tasks yet.</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-700">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Applications →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboard;
