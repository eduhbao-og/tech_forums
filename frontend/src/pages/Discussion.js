import Header from "../Header";
import Footer from "../Footer";

import styles from "../stylesheets/Discussion.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../Cookie";

import { useEffect, useState } from "react";
import { useDiscussionComments } from "../Utils";

const URL_DISCUSSION = "http://localhost:8000/api/discussion/";
const URL_DISCUSSION_COMMENTS = "http://localhost:8000/api/discussion_comments/";

export default function Discussion() {

  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {

  const [discussion, setDiscussion] = useState({});

  const { discussion_id } = useParams();

  const fetchDiscussion = () => {
    axios.get(URL_DISCUSSION + discussion_id)
      .then((request) => {
        setDiscussion(request.data);
        setUser(request.data.account.user)
      })
  };

  useEffect(() => {
    try {
      fetchDiscussion();
    } catch (error) {
      return (
        <h1>ERROR DISCUSSION NOT FOUND</h1>
      );
    }
  }, []);

  const [user, setUser] = useState(null);

  return (
    <div id={styles.content}>
      <Details
        title={discussion.title}
        author={user?.username}
        description={discussion.description}
      />
      <h2 id={styles["comments-heading"]}>Comments</h2>
      <CreateComment />
      <Comments discussion_id={discussion_id} />
    </div >
  );
}

function Details({ title, author, description }) {
  return (
    <div id={styles.details}>
      <h1>{title}</h1>
      <h2>{author}</h2>
      <p>{description}</p>
    </div>
  );
}

function CreateComment() {
  const { discussion_id } = useParams();

  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cookie = getCookie('csrftoken');
      await axios.post(URL_DISCUSSION_COMMENTS + discussion_id, { content: content, discussion_id: discussion_id }, {
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

  return (
    <div id={styles["create-comment"]}>
      <form onSubmit={handleSubmit}>
        <div id={styles.description}>
          <label for="content">New comment:</label>
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <input type="submit" value="Create" id={styles.create} />
      </form>
    </div>
  );
}

function Comments({ discussion_id }) {

  const {comments, getComments} = useDiscussionComments(discussion_id);

  return (
    <div id={styles.comments}>
      {
        comments.map(
          (comment) =>
            <Comment
              author={comment.account}
              content={comment.content}
            />
        )
      }
    </div>
  );
}

function Comment({ author, content }) {
  if (author.developer) {
    return (
      <div class={styles.comment}>
        <div class={styles["comment-top"]}>
          <h3>{author.user.username}</h3>
          <img src="/verified-icon.svg" />
        </div>
        <p>{content}</p>
      </div>
    );
  } else {
    return (
      <div class={styles.comment}>
        <h3>{author.user.username}</h3>
        <p>{content}</p>
      </div>
    );
  }
}
