import Header from "../Header";
import Footer from "../Footer";

import styles from "../stylesheets/Forums.module.css";
import { useForumDiscussions, useForums } from "../Utils";

export default function Forums() {
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
    </div>
  );
}

function Feed() {

  const {forums, getForums} = useForums();

  return (
    <div id={styles.forums}>
      <h1>Forums</h1>
      {
        forums.map(
          (forum) =>
            <Forum
              title={forum.name}
              description={forum.description}
              forum={forum.pk}
              route={forum.route}
            />
        )
      }
    </div>
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
