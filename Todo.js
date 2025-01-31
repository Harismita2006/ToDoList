import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  // Fetch tasks from the database
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get("http://127.0.0.1:4000/getTodoList", getAuthHeaders())
      .then((result) => {
        setTodoList(result.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  
  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data._id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(rowData.deadline || "");
    } else {
      setEditableId(null);
      setEditedTask("");
      setEditedStatus("");
      setEditedDeadline("");
    }
  };

  const saveEditedTask = (id) => {
    const editedData = {
      task: editedTask,
      status: editedStatus,
      deadline: editedDeadline,
    };

    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    axios.put(
      `http://127.0.0.1:4000/updateTodoList/${id}`,
      editedData,
      getAuthHeaders()
    )
      .then(() => {
        setEditableId(null);
        setEditedTask("");
        setEditedStatus("");
        setEditedDeadline("");
        // Refresh the list
        axios.get("http://127.0.0.1:4000/getTodoList", getAuthHeaders())
          .then((result) => setTodoList(result.data))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  };

  // Delete task
  const deleteTask = (id) => {
    axios.delete(
      `http://127.0.0.1:4000/deleteTodoList/${id}`,
      getAuthHeaders()
    )
      .then(() => {
        // Refresh the list
        axios.get("http://127.0.0.1:4000/getTodoList", getAuthHeaders())
          .then((result) => setTodoList(result.data))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  };

  // Redirect to Add Task page
  const redirectToAddTask = () => {
    navigate("/add");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center"></h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoList.map((data) => (
                  <tr key={data._id}>
                    <td>
                      {editableId === data._id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                        />
                      ) : (
                        data.task
                      )}
                    </td>
                    <td>
                      {editableId === data._id ? (
                        <select
                          className="form-control"
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span style={{ 
                          color: data.status === 'completed' ? '#1e88e5' : 
                                 data.status === 'pending' ? '#1a237e' : '#0d47a1',
                          fontWeight: 'bold'
                        }}>
                          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td>
                      {editableId === data._id ? (
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={editedDeadline}
                          onChange={(e) => setEditedDeadline(e.target.value)}
                        />
                      ) : (
                        <span style={{ 
                          color: data.status === 'completed' ? '#1e88e5' : 
                                 data.status === 'pending' ? '#1a237e' : '#0d47a1',
                          fontWeight: data.status === 'pending' ? 'bold' : 'normal'
                        }}>
                          {new Date(data.deadline).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td>
                      {editableId === data._id ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => saveEditedTask(data._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => toggleEditable(data._id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTask(data._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <button className="btn btn-primary btn-sm" onClick={redirectToAddTask}>
              Add List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
