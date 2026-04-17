import Header from "../Header";
import Footer from "../Footer";

import styles from "../stylesheets/Forum.module.css";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../Cookie";
import { useDiscussionComments, useForum } from "../Utils";

const URL_FORUM_DISCUSSIONS = "http://localhost:8000/api/forum_discussions/";
const URL_DISCUSSIONS_POST = "http://localhost:8000/api/discussions_post/";

export default function Forum() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {
  const { forum_id } = useParams();
  
  const {forum, getForum} = useForum(forum_id);

  return (
    <div id={styles.content}>
      <Details
        name={forum.name}
        authors={forum.authors}
        license={forum.license}
        repo={forum.repository}
        website={forum.website}
        description={forum.description}
      />
      <Feed />
    </div>
  );
}

function Details({ name, authors, license, repo, website, description }) {
  return (
    <div id={styles.details}>
      <h1 id={styles["details-name"]}>{name}</h1>
      <h2 id={styles["details-authors"]}>{authors}</h2>
      <p id={styles["details-license"]}>License: {license}</p>
      <p id={styles["details-repo"]}>
        Repository: <a href={repo}>{repo}</a>
      </p>
      <p id={styles["details-website"]}>
        Website: <a href={website}>{website}</a>
      </p>
      <p id={styles["details-description"]}>{description}</p>
    </div>
  );
}

function Feed() {
  const { forum_id } = useParams();
  const [discussions, setDiscussions] = useState([]);

  const fetchDiscussions = () => {
    axios.get(URL_FORUM_DISCUSSIONS + forum_id, { withCredentials: true })
      .then((request) => {
        setDiscussions(request.data)
      })
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div id={styles.feed}>
      <CreateDiscussion />
      <FeedHeading discussions={discussions.length} />
      {
        discussions.map(
          (discussion) => 
            <Discussion
              title={discussion.title}
              author={discussion.account.user.username}
              description={discussion.description}
              pk={discussion.pk}
            />
        )
      }
    </div>
  );
}

function FeedHeading({ discussions }) {
  return (
    <div id={styles["feed-heading"]}>
      <h1>Discussions</h1>
      <p>
        <img src="/discussion-icon.svg" />
        {discussions}
      </p>
    </div>
  );
}

function CreateDiscussion() {

  const { forum_id } = useParams();

  const [discussion, setDiscussion] = useState({
    title: '',
    description: '',
    forum_id: forum_id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const testAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/", {
          withCredentials: true,
        });
        console.log("User is authenticated:", response.data);
      } catch (err) {
        console.error("User not authenticated:", err.response.status);
      }
    };

    testAuth();

    try {
      const cookie = getCookie('csrftoken');
      const response = await axios.post(URL_DISCUSSIONS_POST, discussion, {
        headers: {
          'X-CSRFToken': cookie,
        },
        withCredentials: true
      });
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleInput = (e) => {
    setDiscussion({ ...discussion, [e.target.name]: e.target.value });
  }

  return (
    <div id={styles["create-discussion"]}>
      <h1>Create Discussion</h1>
      <form onSubmit={handleSubmit}>
        <div id={styles.fields}>
          <div id={styles.name}>
            <label for="title">Title:</label>
            <input type="text" name="title" value={discussion.title} onChange={handleInput} required />
          </div>
          <div id={styles.description}>
            <label for="description">Description:</label>
            <input type="text" name="description" value={discussion.description} onChange={handleInput} required />
          </div>
        </div>
        <input type="submit" value="Create" id={styles.create} />
      </form>
    </div>
  );
}

function Discussion({ title, author, description, pk }) {

  const {comments, getComments} = useDiscussionComments(pk);

  return (
    <button class={styles.discussion}>
      <a href={"/discussion/" + pk}>
        <h2 class={styles["discussion-title"]}>{title}</h2>
      </a>
      <h3 class={styles["discussion-author"]}>{author}</h3>
      <p class={styles["discussion-description"]}>{description}</p>
      <p class={styles["discussion-comments"]}>
        <img src="/comment-icon.svg" />
        {comments.length}
      </p>
    </button >
  );
}
