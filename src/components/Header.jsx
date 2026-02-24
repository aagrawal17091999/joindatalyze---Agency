import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/tools', label: 'Tools' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/resources', label: 'Resources' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setProfileOpen(false);
      navigate('/');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">D</span>
          <div className="brand-text">
            <span className="brand-name">Datalyze</span>
            <span className="brand-tag">Analytics & Growth</span>
          </div>
        </Link>
        <nav className="site-nav">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
          {!loading && (
            <>
              {user ? (
                <div className={`profile-dropdown-wrap ${profileOpen ? 'is-open' : ''}`} ref={dropdownRef}>
                  <button
                    type="button"
                    className="profile-trigger"
                    onClick={() => setProfileOpen((o) => !o)}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                    aria-label="Profile menu"
                  >
                    <span className="profile-avatar" aria-hidden="true">
                      {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="profile-name">{displayName}</span>
                    <svg className="profile-chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  {profileOpen && (
                    <div className="profile-dropdown" role="menu">
                      <div className="profile-dropdown-header">
                        <span className="profile-dropdown-email">{user.email}</span>
                      </div>
                      <Link
                        className="profile-dropdown-item"
                        to="/tools"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                      >
                        Tools
                      </Link>
                      <button
                        type="button"
                        className="profile-dropdown-item profile-dropdown-item--logout"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </>
          )}
          <Link className="btn pill" to="/contact">
            Book Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
