import styles from './InlineCTA.module.css';

type Props = {
  href: string;
  heading: string;
  buttonLabel: string;
};

export function InlineCTA({ href, heading, buttonLabel }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>{heading}</p>
      <a href={href} className={styles.button}>
        <span>{buttonLabel}</span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </a>
    </div>
  );
}
