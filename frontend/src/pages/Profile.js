import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";

import Header from "../Header";
import Footer from "../Footer";
import { useUserState } from "../User";
import styles from "../stylesheets/Profile.module.css";
import { getCookie } from "../Cookie";
import { useDiscussionComments, useDiscussions, useForumDiscussions, useForums } from "../Utils";

export default function Profile() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {

  const [account, updateAccount] = useState();

  const fetchAccount = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/', {
        withCredentials: true,
      });
      updateAccount(response.data);
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (!account || !account.user) {
    return <div>Loading...</div>;
  }

  return (
    <div id={styles.content}>
      <Details username={account.user.username} phone={account.phone} developer={account.developer} />
      <Developer developer={account.developer} username={account.user.username} />
    </div>
  );
}

function Details({ username, phone, developer }) {
  return (
    <div id={styles.details}>
      <div id={styles["details-top"]}>
        <h1>{username}</h1>
        <Verified developer={developer} />
      </div>
      <h2>Contacts:</h2>
      <p>Phone: {phone}</p>
    </div>
  );
}

function Verified({ developer }) {
  if (developer)
    return (
      <div id={styles.verified}>
        <img src="/verified-icon.svg" />
      </div>
    );
}

function Developer({ developer, username }) {
  if (developer) {
    return (
      <div>
        <Forums username={username} />
        <CreateForum />
      </div>
    );
  } else {
    return (
      <div>
        <Discussions username={username} />
      </div>
    );
  }
}

function Discussions({ username }) {

  const {discussions, SetDiscussions} = useDiscussions();

  return (
    <div id={styles.discussions}>
      <h1>Your Discussions</h1>
      {
        discussions.map(
          (discussion) => {
            if (discussion.account !== null && discussion.account.user.username === username) {
              return (<Discussion
                title={discussion.title}
                description={discussion.description}
                author={discussion.account.user.username}
                pk={discussion.pk}
                route={discussion.route}
              />)
            }
          }
        )
      }
    </div>
  );
}

function Discussion({ title, description, author, pk, route }) {
  const {comments, getComments} = useDiscussionComments(pk);

  const handleDelete = async () => {
    try {
      const cookie = getCookie('csrftoken');
      await axios.delete('http://localhost:8000/api/discussion/' + pk, {
        headers: {
          'X-CSRFToken': cookie,
        },
        withCredentials: true
      });
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button class={styles.discussion}>
      <div class={styles["discussion-top"]}>
        <a href={"/discussion/" + pk}>
          <h2 class={styles["discussion-title"]}>{title}</h2>
        </a>
        <button onClick={handleDelete}>
          <img src="/remove-icon.svg" class={styles["remove-discussion"]} />
        </button>
      </div>
      <p class={styles["discussion-description"]}>{description}</p>
      <p class={styles["discussion-comments"]}>
        <img src="/comment-icon.svg" />
        {comments.length}
      </p>
    </button >
  );
}

function Forums({ username }) {

  const {forums, getForums} = useForums();

  return (
    <div id={styles.forums}>
      <h1>Your Forums</h1>
      {
        forums.map(
          (forum) => {
            if (forum.account !== null && forum.account.user.username === username) {
              return (<Forum
                title={forum.name}
                description={forum.description}
                forum={forum.pk}
                route={forum.route}
              />)
            }
          }
        )
      }
    </div>
  );
}

function Forum({ title, description, forum, route }) {
  const {forumDiscussions, getForumDiscussions} = useForumDiscussions(forum);

  const handleDelete = async () => {
    try {
      const cookie = getCookie('csrftoken');
      await axios.delete('http://localhost:8000/api/forum/' + forum, {
        headers: {
          'X-CSRFToken': cookie,
        },
        withCredentials: true
      });
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button class={styles.forum}>
      <div class={styles["forum-top"]}>
        <a href={"/forum/" + forum}>
          <h2 class={styles["forum-title"]}>{title}</h2>
        </a>
        <button onClick={handleDelete}>
          <img src="/remove-icon.svg" class={styles["remove-forum"]} />
        </button>
      </div>
      <p class={styles["forum-description"]}>{description}</p>
      <p class={styles["forum-discussions"]}>
        <img src="/discussion-icon.svg" />
        {forumDiscussions.length}
      </p>
    </button>
  );
}

function CreateForum() {

  const navigate = useNavigate();
  const [user, updateUser] = useUserState()

  const [forum, setForum] = useState({
    name: '',
    description: '',
    license: '',
    repository: '',
    website: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cookie = getCookie('csrftoken');
      await axios.post('http://localhost:8000/api/forums/', forum, {
        headers: {
          'X-CSRFToken': cookie,
        },
        withCredentials: true
      });
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e) => {
    setForum({ ...forum, [e.target.name]: e.target.value });
  }

  return (
    <div id={styles["create-forum"]}>
      <h1>Create Forum</h1>
      <form onSubmit={handleSubmit}>
        <div id={styles.fields}>
          <div id={styles.name}>
            <label for="name">Name:</label>
            <input type="text" name="name" value={forum.name} onChange={handleInput} required />
          </div>
          <div id={styles.license}>
            <label for="license">License:</label>
            <input type="text" name="license" value={forum.license} onChange={handleInput} required />
          </div>
          <div id={styles.repository}>
            <label for="repository">Repository:</label>
            <input type="text" name="repository" value={forum.repository} onChange={handleInput} required />
          </div>
          <div id={styles.website}>
            <label for="website">Website:</label>
            <input type="text" name="website" value={forum.website} onChange={handleInput} required />
          </div>
          <div id={styles.description}>
            <label for="description">Description:</label>
            <input type="text" name="description" value={forum.description} onChange={handleInput} required />
          </div>
        </div>
        <input type="submit" value="Create" id={styles.create} />
      </form>
    </div>
  );
}
