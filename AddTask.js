import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddTask() {
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [newDeadline, setNewDeadline] = useState("");
  const navigate = useNavigate();

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.post(
      'http://127.0.0.1:4000/addTodoList',
      { task: newTask, status: newStatus, deadline: newDeadline },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        navigate("/tasks");  
      })
      .catch(err => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: 'white' }}>Add New Task</h2>
      <form className="bg-light p-4 rounded shadow" onSubmit={addTask}>
        <div className="mb-3">
          <label className="form-label">Task</label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            className="form-control"
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Task</button>
      </form>
    </div>
  );
}

export default AddTask;
