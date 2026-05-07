import Image from 'next/image';
import type { HomeTestimonial } from '@/lib/data/home-testimonials';
import styles from './wall-of-love.module.css';

type Props = {
  testimonials: HomeTestimonial[];
};

export default function WallOfLove({ testimonials }: Props) {
  return (
    <div className={styles.masonry}>
      {testimonials.map((t, i) => (
        <div key={t.name + i} className={styles.card}>
          <p className={styles.quote}>{t.text}</p>
          <div className={styles.author}>
            {t.avatar ? (
              <Image
                src={t.avatar}
                alt=""
                width={36}
                height={36}
                className={styles.avatar}
              />
            ) : null}
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{t.name}</span>
              <span className={styles.authorRole}>{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
