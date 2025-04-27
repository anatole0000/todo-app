import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';  // Importing EditIcon

const TodoList = ({ todos, deleteTodo, editTodo }) => {
  return (
    <List>
      {todos.map(todo => (
        <ListItem key={todo._id}>
          <ListItemText primary={todo.task} />
          <IconButton edge="end" onClick={() => editTodo(todo)}>
            <EditIcon /> {/* Edit Button */}
          </IconButton>
          <IconButton edge="end" onClick={() => deleteTodo(todo._id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default TodoList;
