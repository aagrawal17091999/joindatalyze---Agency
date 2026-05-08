'use client';
import { useEffect, useState } from 'react';
import styles from './TechStack.module.css';

const MOBILE_VISIBLE = 6;

type Tool = {
  name: string;
  logo: string;
  category: 'Product' | 'Marketing' | 'Revenue' | 'Warehouse' | 'Dashboarding' | 'Pipelines';
  partner?: string;
};

const tools: Tool[] = [
  { name: 'Mixpanel', logo: '/tech-stack-svg/mixpanel.svg', category: 'Product', partner: 'Certified Partner' },
  { name: 'PostHog', logo: '/tech-stack-svg/posthog.svg', category: 'Product', partner: 'Implementation Specialist' },
  { name: 'Amplitude', logo: '/tech-stack-svg/amplitude.svg', category: 'Product' },
  { name: 'Heap', logo: '/tech-stack-svg/heap.svg', category: 'Product' },
  { name: 'Google Ads', logo: '/tech-stack-svg/google-ads.svg', category: 'Marketing' },
  { name: 'Meta Ads', logo: '/tech-stack-svg/meta-ads.svg', category: 'Marketing' },
  { name: 'GA4', logo: '/tech-stack-svg/ga4.svg', category: 'Marketing' },
  { name: 'Google Tag Manager', logo: '/tech-stack-svg/google-tag-manager.svg', category: 'Marketing' },
  { name: 'HubSpot', logo: '/tech-stack-svg/hubspot.svg', category: 'Marketing' },
  { name: 'Stripe', logo: '/tech-stack-svg/stripe.svg', category: 'Revenue' },
  { name: 'Chargebee', logo: '/tech-stack-svg/chargebee.svg', category: 'Revenue' },
  { name: 'Recurly', logo: '/tech-stack-svg/recurly.svg', category: 'Revenue' },
  { name: 'RevenueCat', logo: '/tech-stack-svg/revenuecat.svg', category: 'Revenue' },
  { name: 'BigQuery', logo: '/tech-stack-svg/bigquery.svg', category: 'Warehouse' },
  { name: 'Snowflake', logo: '/tech-stack-svg/snowflake.svg', category: 'Warehouse' },
  { name: 'Postgres', logo: '/tech-stack-svg/postgres.svg', category: 'Warehouse' },
  { name: 'Looker Studio', logo: '/tech-stack-svg/looker-studio.svg', category: 'Dashboarding' },
  { name: 'Metabase', logo: '/tech-stack-svg/metabase.svg', category: 'Dashboarding' },
  { name: 'Databricks', logo: '/tech-stack-svg/databricks.svg', category: 'Dashboarding' },
  { name: 'Segment', logo: '/tech-stack-svg/segment.svg', category: 'Pipelines' },
  { name: 'dbt', logo: '/tech-stack-svg/dbt.svg', category: 'Pipelines' },
  { name: 'Fivetran', logo: '/tech-stack-svg/fivetran.svg', category: 'Pipelines' },
  { name: 'Hightouch', logo: '/tech-stack-svg/hightouch.svg', category: 'Pipelines' },
  { name: 'Airbyte', logo: '/tech-stack-svg/airbyte.svg', category: 'Pipelines' },
];

const filters = ['All', 'Product', 'Marketing', 'Revenue', 'Warehouse', 'Dashboarding', 'Pipelines'] as const;
type Filter = typeof filters[number];

export function TechStack() {
  const [active, setActive] = useState<Filter>('All');
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const visible = active === 'All' ? tools : tools.filter(t => t.category === active);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [active]);

  const collapseOnMobile = isMobile && !expanded && visible.length > MOBILE_VISIBLE;
  const hiddenCount = collapseOnMobile ? visible.length - MOBILE_VISIBLE : 0;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>■ TECH STACK</div>
        <h2 className={styles.heading}>Your stack is our stack.</h2>
        <p className={styles.sub}>
        </p>

        <div className={styles.filterRow} role="tablist" aria-label="Filter tools by category">
          {filters.map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              className={`${styles.pill} ${active === f ? styles.pillActive : ''}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visible.map((tool, i) => (
            <div
              key={tool.name}
              className={`${styles.card} ${
                collapseOnMobile && i >= MOBILE_VISIBLE ? styles.cardHiddenMobile : ''
              }`}
            >
              <div className={styles.logoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tool.logo} alt={tool.name} className={styles.logo} />
              </div>
              <div className={styles.cardLabel}>{tool.category}</div>
              {tool.partner && <div className={styles.partnerLabel}>{tool.partner}</div>}
            </div>
          ))}
        </div>

        {isMobile && visible.length > MOBILE_VISIBLE && (
          <button
            type="button"
            className={`${styles.pill} ${styles.toggle}`}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : `See ${hiddenCount} more`}
          </button>
        )}
      </div>
    </section>
  );
}
