import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskStatus, setTaskStatus] = useState('');
  const [tasks, setTasks] = useState([]);
  const [pieData, setPieData] = useState([
    { title: 'Completed', value: 0, color: '#1e88e5' },   
    { title: 'In Progress', value: 0, color: '#64b5f6' },  
    { title: 'Pending', value: 0, color: '#1a237e' }       
  ]);
  const navigate = useNavigate();

  const statusColors = {
    completed: '#1e3d59',
    'in-progress': '#17a2b8',
    pending: '#ffc107'
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTodoList = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/getTodoList", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const todos = response.data;
        console.log('Raw todos:', todos); // Debug raw data

        // Set tasks first
        setTasks(todos);
        
        // Debug each task's status
        todos.forEach((todo, index) => {
          console.log(`Task ${index + 1} status:`, todo.status);
        });

        // Count tasks by status
        const completedTasks = todos.filter(todo => todo.status.toLowerCase() === 'completed').length;
        const inProgressTasks = todos.filter(todo => todo.status.toLowerCase() === 'in-progress').length;
        const pendingTasks = todos.filter(todo => 
          !todo.status || 
          todo.status.toLowerCase() === 'pending' || 
          todo.status === ''
        ).length;

        // Debug counts
        console.log('Task counts:', {
          total: todos.length,
          completed: completedTasks,
          inProgress: inProgressTasks,
          pending: pendingTasks,
        });

        // Update pie chart data
        setPieData([
          { title: 'Completed', value: completedTasks, color: '#1e88e5' },    // Bright blue
          { title: 'In Progress', value: inProgressTasks, color: '#64b5f6' }, // Light blue
          { title: 'Pending', value: pendingTasks, color: '#1a237e' }         // Dark navy blue
        ]);

      } catch (error) {
        console.error('Error fetching todo list:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchTodoList();
  }, [navigate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const tasksForDate = tasks.filter(
      (task) => new Date(task.deadline).toDateString() === date.toDateString()
    );

    if (tasksForDate.length > 0) {
      const taskList = tasksForDate.map(task => ({
        task: task.task,
        status: task.status
      }));
      setTaskStatus(taskList);
    } else {
      setTaskStatus('No tasks assigned for this date.');
    }
  };

  const tileClassName = ({ date }) => {
    const tasksForDate = tasks.filter(
      (task) => new Date(task.deadline).toDateString() === date.toDateString()
    );
    
    if (tasksForDate.length > 0) {
      const hasCompleted = tasksForDate.some(task => task.status === 'completed');
      const hasPending = tasksForDate.some(task => task.status === 'pending' || task.status === 'in-progress');
      
      if (hasCompleted && hasPending) {
        return 'highlight-mixed';
      }
      return hasCompleted ? 'highlight-completed' : 'highlight-pending';
    }
    return '';
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div style={{ 
            height: '400px', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ width: '100%', height: '300px', position: 'relative', marginBottom: '20px' }}>
              <PieChart
                data={pieData}
                lineWidth={40}
                radius={50}
                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                label={({ dataEntry }) => `${dataEntry.value}`}
                labelStyle={{
                  fontSize: '14px',
                  fontFamily: 'Arial',
                  fill: '#fff',
                  fontWeight: 'bold'
                }}
                labelPosition={70}
                animate
                animationDuration={500}
                startAngle={0}
                viewBoxSize={[100, 100]}
                center={[50, 50]}
              />
            </div>
            <div className="mt-4" style={{ width: '100%' }}>
              <div className="d-flex justify-content-around">
                {pieData.map(({ title, color, value }) => (
                  <div key={title} className="d-flex align-items-center">
                    <div style={{
                      width: '15px',
                      height: '15px',
                      backgroundColor: color,
                      marginRight: '8px',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '14px' }}>{title} ({value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={tileClassName}
            className="w-100"
          />
          {taskStatus && (
            <div className="mt-3">
              <h6 className="mb-2">Tasks for selected date:</h6>
              {Array.isArray(taskStatus) ? (
                <div className="task-list p-3" style={{ backgroundColor: '#2c3e50', borderRadius: '8px' }}>
                  {taskStatus.map((task, index) => (
                    <div key={index} className="mb-2" style={{ color: 'white' }}>
                      {task.task} - {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3" style={{ backgroundColor: '#2c3e50', borderRadius: '8px', color: 'white' }}>
                  {taskStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .highlight-completed {
            background-color: #4CAF50 !important;
            color: white !important;
          }
          .highlight-pending {
            background-color: #f44336 !important;
            color: white !important;
          }
          .highlight-mixed {
            background: linear-gradient(45deg, #4CAF50 50%, #f44336 50%) !important;
            color: white !important;
          }
          .react-calendar {
            border-radius: 8px;
            border: none;
            background-color: #2c3e50;
            color: white;
            padding: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .react-calendar__navigation {
            margin-bottom: 16px;
          }
          .react-calendar__navigation button {
            color: white;
            font-size: 16px;
            background: none;
            border: none;
            padding: 8px;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #34495e;
            border-radius: 4px;
          }
          .react-calendar__month-view__weekdays {
            color: #3498db;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
          }
          .react-calendar__tile {
            padding: 12px 6px;
            font-size: 14px;
            color: white;
            background: none;
            border: none;
            transition: all 0.2s;
          }
          .react-calendar__tile:enabled:hover {
            background-color: #34495e !important;
            border-radius: 4px;
          }
          .react-calendar__tile--now {
            background: #34495e !important;
            border-radius: 4px;
          }
          .react-calendar__tile--active {
            background: #3498db !important;
            border-radius: 4px;
          }
          .react-calendar__month-view__days__day--weekend {
            color: #e74c3c;
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: #7f8c8d;
          }
          .highlight-completed,
          .highlight-pending,
          .highlight-mixed {
            font-weight: bold;
            border-radius: 4px;
          }
          .highlight-completed:hover,
          .highlight-pending:hover,
          .highlight-mixed:hover {
            opacity: 0.9;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
