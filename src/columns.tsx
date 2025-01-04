import React, { useState, useEffect } from "react";
import { AddTaskToBoard, GetAddTaskToBoard } from "./Redux/Slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

interface ColumnsProps {
    boardId: string;
    boardTitle: string;
}

const Columns: React.FC<ColumnsProps> = ({ boardId, boardTitle }) => {
    const { Taskdata } = useSelector((state: any) => state?.Board);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [projectName, setProjectName] = useState("");
    const [task, setTask] = useState("");
    const [status, setStatus] = useState("To-Do");
    const dispatch = useDispatch();
    const { id } = useParams();
    const LOCAL_TASKSTORAGE_KEY = "Tasks";

    useEffect(() => {
        const savedTasks = localStorage.getItem(LOCAL_TASKSTORAGE_KEY);
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                dispatch(GetAddTaskToBoard(parsedTasks));
            } catch (error) {
                console.error("Error parsing saved tasks:", error);
            }
        }
    }, [dispatch]);

    const handleSave = () => {
        if (editingTask) {
            // Edit existing task
            const updatedTasks = Taskdata.map((t: any) =>
                t.taskId === editingTask.taskId
                    ? { ...t, projectName, task, status }
                    : t
            );
            dispatch(AddTaskToBoard(updatedTasks));
            localStorage.setItem(LOCAL_TASKSTORAGE_KEY, JSON.stringify(updatedTasks));
        } else {
            // Add new task
            const newTask = {
                projectName,
                task,
                status,
                UserId: id,
                taskId: `${Date.now()}`,
            };
            const updatedTasks = [...Taskdata, newTask];
            dispatch(AddTaskToBoard(updatedTasks));
            localStorage.setItem(LOCAL_TASKSTORAGE_KEY, JSON.stringify(updatedTasks));
        }

        setShowForm(false);
        setEditingTask(null);
        setProjectName("");
        setTask("");
        setStatus("To-Do");
    };

    const handleEdit = (task: any) => {
        setEditingTask(task);
        setProjectName(task.projectName);
        setTask(task.task);
        setStatus(task.status);
        setShowForm(true);
    };

    const handleDelete = (taskId: string) => {
        const updatedTasks = Taskdata.filter((task: any) => task.taskId !== taskId);
        dispatch(AddTaskToBoard(updatedTasks));
        localStorage.setItem(LOCAL_TASKSTORAGE_KEY, JSON.stringify(updatedTasks));
    };

    const filterTasksByStatus = (status: string) =>
        Taskdata.filter((task: any) => task.status === status && task.UserId === id);

    return (
        <div className="columns-container p-6">
            <div className="flex items-center justify-center mb-6">
                <button
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowForm(true)}
                >
                    Add Task
                </button>
            </div>
            <h4 className="text-white text-sm mb-4">
                Columns for {boardTitle} (ID: {boardId})
            </h4>

            <div className="columns-list flex gap-x-6">
                {["To-Do", "In Progress", "Done"].map((columnStatus) => (
                    <div key={columnStatus} className="column-item p-4 rounded w-1/3 bg-blue-500">
                        <h5 className="text-white text-lg mb-2">{columnStatus}</h5>
                        <ul>
                            {filterTasksByStatus(columnStatus).length > 0 ? (
                                filterTasksByStatus(columnStatus).map((task: any) => (
                                    <li
                                        key={task.taskId}
                                        className="text-white mb-2 bg-yellow-600 p-2 rounded flex justify-between items-center"
                                    >
                                        <div>
                                            <div>Project Name: {task.projectName}</div>
                                            <div>Task: {task.task}</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.taskId)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-white">No tasks in {columnStatus}</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="modal-content bg-white p-6 rounded">
                        <h3 className="text-xl mb-4">
                            {editingTask ? "Edit Task" : "Add a New Task"}
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm">Project Name</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">Task</label>
                                <input
                                    type="text"
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    placeholder="Enter task description"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                >
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingTask(null);
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Columns;
