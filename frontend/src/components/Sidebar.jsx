import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-indigo-700 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Scripture Mind</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/verses/new"
          className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Add New Verse
        </Link>
      </nav>

      <div className="border-t border-indigo-600 pt-4 mt-4">
        <div className="mb-2 text-sm text-indigo-200">
          {user?.email || user?.username}
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
