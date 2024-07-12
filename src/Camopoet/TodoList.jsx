import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    // Simulate a loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const addTask = () => {
    if (task.trim() === '') {
      setError('Task cannot be empty');
      return;
    }

    if (isEditing) {
      const updatedTasks = tasks.map((item, index) => 
        index === currentTaskIndex ? task : item
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setCurrentTaskIndex(null);
    } else {
      const newTasks = [...tasks, task];
      setTasks(newTasks);

      // Automatically move to new page if current page is filled
      if (newTasks.length > currentPage * tasksPerPage) {
        setCurrentPage(currentPage + 1);
      }
    }

    setTask('');
    setError('');
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);

    // Automatically move to previous page if current page is empty after deletion
    if (newTasks.length <= (currentPage - 1) * tasksPerPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const editTask = (index) => {
    setTask(tasks[index]);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Task</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{indexOfFirstTask + index + 1}</td>
              <td className="border px-4 py-2">{task}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => editTask(indexOfFirstTask + index)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(indexOfFirstTask + index)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 border ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastTask >= tasks.length}
          className={`px-4 py-2 mx-1 border ${indexOfLastTask >= tasks.length ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TodoList;
