import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axiosInstance, { endpoints } from "../apis";
import { FiLogOut, FiEdit, FiTrash, FiSave } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im"; // spinner icon

interface Task {
  _id: string;
  title: string;
  status: string;
}

export default function Task() {
  const { signOut, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState({
    add: false,
    update: false,
    deleteId: "", // to track which delete button is loading
  });

  const addTask = useCallback(async () => {
    if (input.trim()) {
      setLoading((prev) => ({ ...prev, add: true }));
      try {
        const { data } = await axiosInstance.post(endpoints.task.create, {
          title: input.trim(),
        });
        setTasks((prev) => [...prev, data.data]);
        setInput("");
      } catch (error) {
        console.error("Error adding task:", error);
      } finally {
        setLoading((prev) => ({ ...prev, add: false }));
      }
    }
  }, [input]);

  const toggleStatus = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, update: true }));
      const status =
        tasks.find((task) => task._id === id)?.status === "completed"
          ? "pending"
          : "completed";
      try {
        const { data } = await axiosInstance.put(endpoints.task.update, {
          taskId: id,
          status,
        });
        setTasks((prev) =>
          prev.map((task) => (task._id === id ? data.data : task))
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      } finally {
        setLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(async (id: string) => {
    setLoading((prev) => ({ ...prev, deleteId: id }));
    try {
      const { data } = await axiosInstance.delete(endpoints.task.delete(id));
      if (data.success) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading((prev) => ({ ...prev, deleteId: "" }));
    }
  }, []);

  const updateTitle = useCallback(
    async (id: string) => {
      if (editingTitle.trim()) {
        setLoading((prev) => ({ ...prev, update: true }));
        try {
          const { data } = await axiosInstance.put(endpoints.task.update, {
            taskId: id,
            title: editingTitle.trim(),
          });
          setTasks((prev) =>
            prev.map((task) => (task._id === id ? data.data : task))
          );
          setEditingTaskId(null);
          setEditingTitle("");
        } catch (error) {
          console.error("Error updating title:", error);
        } finally {
          setLoading((prev) => ({ ...prev, update: false }));
        }
      }
    },
    [editingTitle, tasks]
  );

  const fetchAllTask = useCallback(async () => {
    const { data } = await axiosInstance.get(endpoints.task.get);
    setTasks(data.data);
  }, []);

  useEffect(() => {
    if (user === null) return;
    fetchAllTask();
  }, [fetchAllTask, user]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Task Manager</h2>
        <button
          onClick={signOut}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
          title="Logout"
        >
          <FiLogOut className="text-xl" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            disabled={loading.add}
          />
          <button
            onClick={addTask}
            disabled={loading.add}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg transition ${
              loading.add ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading.add ? <ImSpinner2 className="animate-spin" /> : "Add"}
          </button>
        </div>

        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => toggleStatus(task._id)}
                  disabled={loading.update}
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  } ${loading.update ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {task.status === "completed" && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    className="border rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && updateTitle(task._id)
                    }
                    disabled={loading.update}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setEditingTaskId(task._id);
                      setEditingTitle(task.title);
                    }}
                    className={`flex-grow cursor-pointer ${
                      task.status === "completed"
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                )}
              </div>

              <div className="flex gap-3 ml-3">
                {editingTaskId === task._id ? (
                  <button
                    onClick={() => updateTitle(task._id)}
                    disabled={loading.update}
                    className={`text-green-500 hover:text-green-700 transition ${
                      loading.update ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    title="Save Task"
                  >
                    {loading.update ? (
                      <ImSpinner2 className="animate-spin" />
                    ) : (
                      <FiSave className="text-lg" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditingTitle(task.title);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit Task"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task._id)}
                  disabled={loading.deleteId === task._id}
                  className={`text-red-500 hover:text-red-700 transition ${
                    loading.deleteId === task._id
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  title="Delete Task"
                >
                  {loading.deleteId === task._id ? (
                    <ImSpinner2 className="animate-spin" />
                  ) : (
                    <FiTrash className="text-lg" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No tasks yet. Add one!
          </p>
        )}
      </div>
    </div>
  );
}
