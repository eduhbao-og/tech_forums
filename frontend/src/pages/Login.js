import styles from "../stylesheets/Login.module.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../Cookie";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post('http://localhost:8000/api/login/', { username, password }, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div id={styles.content}>
        <div id={styles.logo}>
          <a href="/">
            <img src="/logo.svg" alt="Logo" />
            <h1>Tech Forums</h1>
          </a>
        </div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div id={styles.username}>
            <label htmlFor="username">Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div id={styles.password}>
            <label htmlFor="password">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <input type="submit" value="Login" id={styles.login} />
        </form>
        <a href="/signup" id={styles.signup}>Don't have an account?</a>
      </div>
    </div>
  );
}
