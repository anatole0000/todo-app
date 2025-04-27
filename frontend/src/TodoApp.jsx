import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, TextField, Button } from '@mui/material';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoStatsGraph from './TodoStatsGraph'; // Make sure this file exists
import AuthForm from './AuthForm'; // Your login/register form

const TodoApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const funIdeas = [
    "Learn a new word 📚",
    "Go for a walk 🚶‍♂️",
    "Organize your desk 🖥️",
    "Call a friend ☎️",
    "Drink water 💧",
    "Write a short poem ✍️",
    "Stretch for 5 minutes 🧘",
    "Plan your weekend 🎉",
  ];

  // Fetch todos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/todos', { withCredentials: true })
        .then(res => setTodos(res.data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  // Fetch stats
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/todos/stats', { withCredentials: true })
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const addTodo = (task) => {
    axios.post('http://localhost:5000/todos', { task }, { withCredentials: true })
      .then(res => setTodos([...todos, res.data]))
      .catch(err => console.error(err));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.error(err));
  };

  const editTodo = (todo) => {
    setEditingTodo(todo);
  };

  const updateTodo = (updatedTask) => {
    if (editingTodo) {
      axios.put(`http://localhost:5000/todos/${editingTodo._id}`, { task: updatedTask }, { withCredentials: true })
        .then(() => {
          setTodos(todos.map(todo =>
            todo._id === editingTodo._id ? { ...todo, task: updatedTask } : todo
          ));
          setEditingTodo(null);
        })
        .catch(err => console.error(err));
    }
  };

  // Search and Filter Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilter = () => {
    setFilterStatus('all');
  };

  const generateIdea = () => {
    const randomIndex = Math.floor(Math.random() * funIdeas.length);
    const randomIdea = funIdeas[randomIndex];
    addTodo(randomIdea);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.task.toLowerCase().includes(searchTerm);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'pending' && !todo.completed);
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ padding: 3 }}>
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="outlined"
        color="error"
        onClick={async () => {
          await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
          setIsAuthenticated(false);
        }}
        sx={{ mb: 2 }}
      >
        Logout
      </Button>

      <Typography variant="h3" gutterBottom>
        Todo App
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        {/* Search Field */}
        <TextField
          label="Search Todos"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearSearch}
          sx={{ marginBottom: 3 }}
        >
          Clear Search
        </Button>

        {/* Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearFilter}
          >
            Clear Filter
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={generateIdea}
          >
            💡 Generate Idea
          </Button>
        </Box>
      </Box>

      {/* Display Stats */}
      {stats ? (
        <>
          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="body1">{stats.total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="body1">{stats.completed}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="body1">{stats.pending}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Overdue</Typography>
                <Typography variant="body1">{stats.overdue}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Graph */}
          <TodoStatsGraph stats={stats} />
        </>
      ) : (
        <Typography>Loading stats...</Typography>
      )}

      {/* Todo Form */}
      <TodoForm
        addTodo={addTodo}
        updateTodo={updateTodo}
        editingTodo={editingTodo}
      />

      {/* Todo List */}
      <TodoList
        todos={filteredTodos}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </Box>
  );
};

export default TodoApp;
