import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";
import styles from "../stylesheets/Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    developer: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/signup/', user, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div id={styles.content}>
      <div id={styles.logo}>
        <a href="/">
          <img src="/logo.svg" alt="Logo" />
          <h1>Tech Forums</h1>
        </a>
      </div>
      <h1>Criar Conta</h1>
      <form onSubmit={handleSubmit}>
        <div id={styles.username}>
          <label for="username">Username:</label>
          <input type="text" name="username" value={user.username} onChange={handleInput} required />
        </div>
        <div id={styles.password}>
          <label for="password">Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleInput} required />
        </div>
        <div id={styles.email}>
          <label for="email">Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleInput} required />
        </div>
        <div id={styles.phone}>
          <label for="phone">Phone Number:</label>
          <input type="number" name="phone" value={user.phone} onChange={handleInput} required />
        </div>
        <div id={styles.developer}>
          <label for="developer">Developer Code (if applicable):</label>
          <input type="text" name="developer" value={user.developer} onChange={handleInput} />
        </div>
        <input type="submit" value="Sign up" id={styles.signup} />
      </form>
      <a href="/login" id={styles.login}>Already have an account?</a>
    </div>
  );
}
