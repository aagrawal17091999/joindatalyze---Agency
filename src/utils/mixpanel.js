import mixpanel from 'mixpanel-browser';

mixpanel.init('30e052985041de7abb61aed0ec34ad38', {
  track_pageviews: true,
  autocapture: {
    pageview: "full-url",
    click: false,
    dead_click: false,
    input: false,
    rage_click: false,
    scroll: false,
    submit: false,
    capture_text_content: true,
  },
  record_sessions_percent: 100,
  record_mask_all_text: false,
  record_heatmap_data: true,
});

export default mixpanel;
