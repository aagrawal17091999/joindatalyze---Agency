import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

import {
  cloudFunctionsBaseUrl,
  firebaseConfig,
  isFirebaseConfigured
} from './config.js';

const toolConfig = {
  'event-cleanup': {
    name: 'Event Cleanup Assistant',
    url: 'https://your-event-cleanup.streamlit.app'
  },
  'activation-doctor': {
    name: 'Activation Funnel Doctor',
    url: 'https://your-activation-doctor.streamlit.app'
  },
  'cohort-health': {
    name: 'Cohort Health Monitor',
    url: 'https://your-cohort-health.streamlit.app'
  },
  'growth-forecast': {
    name: 'Growth Forecast Builder',
    url: 'https://your-growth-forecast.streamlit.app'
  },
  'ads-roi': {
    name: 'Paid Ads ROI Snapshot',
    url: 'https://your-ads-roi.streamlit.app'
  },
  'pricing-lab': {
    name: 'Pricing Experiment Lab',
    url: 'https://your-pricing-lab.streamlit.app'
  }
};

const getToolFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('tool');
};

const toolId = getToolFromQuery();
const toolMeta = toolId && toolConfig[toolId] ? toolConfig[toolId] : null;

const toolNameEl = document.querySelector('#tool-name');
if (toolNameEl) {
  toolNameEl.textContent = toolMeta ? toolMeta.name : 'Datalyze tools';
}

const signupLink = document.querySelector('#signup-link');
const signinLink = document.querySelector('#signin-link');
const toolQuery = toolId ? `?tool=${toolId}` : '';

if (signupLink && toolQuery) {
  signupLink.href = `/signup${toolQuery}`;
}

if (signinLink && toolQuery) {
  signinLink.href = `/signin${toolQuery}`;
}

if (!isFirebaseConfigured(firebaseConfig)) {
  console.warn('Firebase config missing. Update src/config.js with your Firebase project values.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const statusEl = document.querySelector('#auth-status');

const setStatus = (message, type = 'info') => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.state = type;
};

const postEvent = async (eventName, user, payload = {}) => {
  if (!cloudFunctionsBaseUrl || cloudFunctionsBaseUrl.includes('YOUR_REGION')) {
    return;
  }

  const token = await user.getIdToken();
  await fetch(`${cloudFunctionsBaseUrl}/recordToolEvent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      eventName,
      toolId,
      toolName: toolMeta?.name,
      ...payload
    })
  });
};

const redirectToTool = () => {
  if (!toolMeta?.url) {
    window.location.href = '/tools';
    return;
  }
  window.location.href = toolMeta.url;
};

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  setStatus('Authenticated. Redirecting you to the tool…', 'success');
  await postEvent('login', user);
  redirectToTool();
});

const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const googleButton = document.querySelector('#google-login');

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      setStatus('Creating your account…');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
      await postEvent('signup', result.user, { name });
      setStatus('Account created. Redirecting…', 'success');
      redirectToTool();
    } catch (error) {
      console.error(error);
      setStatus(error.message || 'Unable to create account. Try again.', 'error');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      setStatus('Signing you in…');
      const result = await signInWithEmailAndPassword(auth, email, password);
      await postEvent('login', result.user);
      setStatus('Signed in. Redirecting…', 'success');
      redirectToTool();
    } catch (error) {
      console.error(error);
      setStatus(error.message || 'Unable to sign in. Try again.', 'error');
    }
  });
}

if (googleButton) {
  googleButton.addEventListener('click', async () => {
    try {
      setStatus('Opening Google sign-in…');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await postEvent('login', result.user, { provider: 'google' });
      setStatus('Signed in. Redirecting…', 'success');
      redirectToTool();
    } catch (error) {
      console.error(error);
      setStatus(error.message || 'Google sign-in failed. Try again.', 'error');
    }
  });
}
