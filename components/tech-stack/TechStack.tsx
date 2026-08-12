'use client';
import { useEffect, useState } from 'react';
import styles from './TechStack.module.css';

const MOBILE_VISIBLE = 6;

type Tool = {
  name: string;
  logo: string;
  category: 'Product' | 'Marketing' | 'Revenue' | 'Warehouse' | 'Dashboarding' | 'Pipelines';
  partner?: string;
  // Intrinsic aspect ratio of the SVG (from its viewBox). The img is scaled to
  // max-height:40px via CSS; these attributes just let the browser reserve the
  // right space before load to avoid layout shift (CLS).
  width: number;
  height: number;
};

const tools: Tool[] = [
  { name: 'Mixpanel', logo: '/tech-stack-svg/mixpanel.svg', category: 'Product', partner: 'Certified Partner', width: 2976, height: 1000 },
  { name: 'PostHog', logo: '/tech-stack-svg/posthog.svg', category: 'Product', partner: 'Implementation Specialist', width: 5713, height: 1000 },
  { name: 'Amplitude', logo: '/tech-stack-svg/amplitude.svg', category: 'Product', width: 4732, height: 1000 },
  { name: 'Heap', logo: '/tech-stack-svg/heap.svg', category: 'Product', width: 64, height: 64 },
  { name: 'Google Ads', logo: '/tech-stack-svg/google-ads.svg', category: 'Marketing', width: 120, height: 60 },
  { name: 'Meta Ads', logo: '/tech-stack-svg/meta-ads.svg', category: 'Marketing', width: 948, height: 191 },
  { name: 'GA4', logo: '/tech-stack-svg/ga4.svg', category: 'Marketing', width: 2902, height: 1000 },
  { name: 'Google Tag Manager', logo: '/tech-stack-svg/google-tag-manager.svg', category: 'Marketing', width: 3093, height: 1000 },
  { name: 'HubSpot', logo: '/tech-stack-svg/hubspot.svg', category: 'Marketing', width: 3418, height: 1000 },
  { name: 'Stripe', logo: '/tech-stack-svg/stripe.svg', category: 'Revenue', width: 360, height: 150 },
  { name: 'Chargebee', logo: '/tech-stack-svg/chargebee.svg', category: 'Revenue', width: 280, height: 60 },
  { name: 'Recurly', logo: '/tech-stack-svg/recurly.svg', category: 'Revenue', width: 240, height: 60 },
  { name: 'RevenueCat', logo: '/tech-stack-svg/revenuecat.svg', category: 'Revenue', width: 24, height: 24 },
  { name: 'BigQuery', logo: '/tech-stack-svg/bigquery.svg', category: 'Warehouse', width: 2000, height: 1000 },
  { name: 'Snowflake', logo: '/tech-stack-svg/snowflake.svg', category: 'Warehouse', width: 3546, height: 1000 },
  { name: 'Postgres', logo: '/tech-stack-svg/postgres.svg', category: 'Warehouse', width: 432, height: 445 },
  { name: 'Looker Studio', logo: '/tech-stack-svg/looker-studio.svg', category: 'Dashboarding', width: 3765, height: 1000 },
  { name: 'Metabase', logo: '/tech-stack-svg/metabase.svg', category: 'Dashboarding', width: 2564, height: 1000 },
  { name: 'Databricks', logo: '/tech-stack-svg/databricks.svg', category: 'Dashboarding', width: 6339, height: 1000 },
  { name: 'Segment', logo: '/tech-stack-svg/segment.svg', category: 'Pipelines', width: 4892, height: 1000 },
  { name: 'dbt', logo: '/tech-stack-svg/dbt.svg', category: 'Pipelines', width: 200, height: 60 },
  { name: 'Fivetran', logo: '/tech-stack-svg/fivetran.svg', category: 'Pipelines', width: 3600, height: 1000 },
  { name: 'Hightouch', logo: '/tech-stack-svg/hightouch.svg', category: 'Pipelines', width: 280, height: 60 },
  { name: 'Airbyte', logo: '/tech-stack-svg/airbyte.svg', category: 'Pipelines', width: 24, height: 24 },
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
        <div className={styles.eyebrow}>Tech stack</div>
        <h2 className={styles.heading}>
          Which analytics tools does Datalyze work with?
        </h2>
        <p className={styles.sub}>
          We work inside your stack, not ours. As of 2026:
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
                <img
                  src={tool.logo}
                  alt={tool.name}
                  width={tool.width}
                  height={tool.height}
                  className={styles.logo}
                />
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
