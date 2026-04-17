import { useEffect } from "react";
import axios from "axios";
import { useUserState } from "./User";

import styles from "./stylesheets/Header.module.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  return (
    <header id={styles.header}>
      <Content />
    </header>
  );
}

function Content() {
  return (
    <div id={styles.content}>
      <Logo />
      <div id={styles["content-right"]}>
        <Shortcuts />
        <Account />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a href="/" id={styles.logo}>
      <img src="/logo.svg" alt="Logo" />
      <h1>Tech Forums</h1>
    </a>
  );
}

function Shortcuts() {
  return (
    <div id={styles.shortcuts}>
      <a href="/">Home</a>
      <a href="/forums">All Forums</a>
    </div>
  );
}

function Account() {

  const navigate = useNavigate();
  const [user, updateUser] = useUserState()

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(response => updateUser('username', response.data.user.username))
      .catch(error => console.log("User not logged in"))
  }, []);

  const logoutHandler = async () => {
    await axios.get('http://localhost:8000/api/logout/', { withCredentials: true })
      .then(() => {
        updateUser('username', '')
        updateUser('email', '')
        updateUser('phone', 0)
        updateUser('developer', false)
      })
      .catch(err => alert('Logout failed'));
    navigate('/')
    window.location.reload(false);
  }

  if (user.username) {
    return (
      <div id={styles.profile}>
        <img src="/profile-icon.svg" alt="Profile Picture" />
        <div id={styles["profile-right"]}>
          <a href="/profile" id={styles.username}>{user.username}</a>
          <a id={styles.logout} onClick={logoutHandler} >Log out</a>
        </div>
      </div>
    );
  } else {
    return (
      <Login />
    );
  }
}

function Login() {
  return (
    <a href="/login" id={styles.login}>Log in</a>
  );
}
