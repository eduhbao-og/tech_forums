import Header from "../Header";
import Footer from "../Footer";

import styles from "../stylesheets/Home.module.css";

import { useNavigate } from "react-router-dom";
import { useDiscussionComments, useDiscussions, useForumDiscussions, useForums } from "../Utils";

export default function Home() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {
  return (
    <div id={styles.content}>
      <Feed />
      <Forums />
    </div>
  );
}

function Feed() {

  const {discussions, getDiscussions} = useDiscussions()

  return (
    <div id={styles.feed}>
      <h1>Latest Discussions</h1>
      {
        discussions.sort((a, b) => b.pk - a.pk).slice(0, 5).map(
          (discussion) =>
            <Discussion
              title={discussion.title}
              author={discussion.account.user.username}
              description={discussion.description}
              discussion_id={discussion.pk}
            />
        )
      }
    </div>
  );
}

function Discussion({ title, author, description, discussion_id }) {

  const navigateTo = useNavigate();

  const {comments, getComments} = useDiscussionComments(discussion_id);

  return (
    <button class={styles.discussion} onClick={() => { navigateTo(`/discussion/${discussion_id}`, { state: { discussion_id: discussion_id } }) }}>
      <a href={window.location.href + "discussion/" + discussion_id}>
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

function Forums() {
  const {forums, getForums} = useForums();

  return (
    <aside id={styles.forums}>
      <h1>Trending</h1>
      {
        forums.slice(0, 3).map(
          (forum) =>
            <Forum
              title={forum.name}
              description={forum.description}
              forum={forum.pk}
              route={forum.route}
            />
        )
      }
    </aside>
  );
}

function Forum({ title, description, forum, route }) {
  const {forumDiscussions, getForumDiscussions} = useForumDiscussions(forum);

  return (
    <button class={styles.forum}>
      <a href={"/forum/" + forum}>
        <h2 class={styles["forum-title"]}>{title}</h2>
      </a>
      <p class={styles["forum-description"]}>{description}</p>
      <p class={styles["forum-discussions"]}>
        <img src="/discussion-icon.svg" />
        {forumDiscussions.length}
      </p>
    </button>
  );
}
