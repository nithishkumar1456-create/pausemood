/**
 * Profile.jsx – /profile
 * Displays the user's name and a button to change name / switch user.
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleChangeName() {
    logout();
    navigate('/welcome');
  }

  if (!user) {
    return (
      <main className="profile page-wrapper">
        <p className="profile__no-user">No profile found.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/welcome')}
        >
          Enter Your Name
        </button>
      </main>
    );
  }

  return (
    <main className="profile page-wrapper">
      {/* Avatar */}
      <div className="profile__avatar" aria-hidden="true">🐱</div>

      <h1 className="profile__name">{user.name || 'Friend'}</h1>
      <p className="profile__email">One check-in at a time ✨</p>

      {/* Stats card */}
      <div className="profile__card card">
        <h2 className="profile__card-title">Your Pause Journey</h2>
        <p className="profile__card-body">
          Every check-in is a small act of self-care. Be kind to yourself today! 🌸
        </p>
      </div>

      {/* Button to change name / exit */}
      <button
        type="button"
        className="btn-ghost profile__logout"
        onClick={handleChangeName}
      >
        Change Name / Switch User
      </button>
    </main>
  );
}
