import styles from "./stylesheets/Footer.module.css";

export default function Footer() {
  return (
    <footer id={styles.footer}>
      <Content />
    </footer>
  );
}

function Content() {
  return (
    <div id={styles.content}>
      <Logo />
      <Contacts />
    </div>
  );
}

function Logo() {
  return (
    <a href="/" id={styles.logo}>
      <img src="/logo.svg" alt="Logo" />
      <p>Tech Forums</p>
    </a>

  );
}

function Contacts() {
  return (
    <div id={styles.contacts}>
      <p>Email: <a href="mailto:techforums@example.com">techforums@example.com</a></p>
      <p>Phone: +351 999 888 777</p>
      <Socials />
    </div>
  );
}

function Socials() {
  return (
    <div id={styles.socials}>
      <a href="https://facebook.com">
        <img src="/facebook-icon.svg" alt="Facebook" />
      </a>
      <a href="https://twitter.com">
        <img src="/twitter-icon.svg" alt="Twitter" />
      </a>
      <a href="https://instagram.com">
        <img src="/instagram-icon.svg" alt="Instagram" />
      </a>
      <a href="https://linkedin.com">
        <img src="/linkedin-icon.svg" alt="LinkedIn" />
      </a>
    </div>
  );
}
