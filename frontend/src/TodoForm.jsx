import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const TodoForm = ({ addTodo, updateTodo, editingTodo }) => {
  const [task, setTask] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTask(editingTodo.task);  // Pre-fill the input field if editing a todo
    }
  }, [editingTodo]);

  const handleAddTodo = () => {
    if (task.trim()) {
      addTodo(task);
      setTask('');
    }
  };

  const handleUpdateTodo = () => {
    if (task.trim()) {
      updateTodo(task);  // Call the updateTodo function with the updated task
      setTask('');
    }
  };

  return (
    <div>
      <TextField
        label="Add/Edit a todo"
        variant="outlined"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      {editingTodo ? (
        <Button variant="contained" onClick={handleUpdateTodo}>
          Update Todo
        </Button>
      ) : (
        <Button variant="contained" onClick={handleAddTodo}>
          Add Todo
        </Button>
      )}
    </div>
  );
};

export default TodoForm;
