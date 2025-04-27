// src/JokeGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';

const JokeGenerator = () => {
  const [joke, setJoke] = useState('');

  const fetchJoke = async () => {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      setJoke(`${response.data.setup} - ${response.data.punchline}`);
    } catch (error) {
      console.error('Error fetching joke', error);
    }
  };

  return (
    <div>
      <h3>Want to hear a joke?</h3>
      <button onClick={fetchJoke}>Get Joke</button>
      <p>{joke}</p>
    </div>
  );
};

export default JokeGenerator;
