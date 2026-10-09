import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars } from 'react-icons/fa';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
      <div className="flex items-center md:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-2 text-slate-600 hover:text-blue-700 focus:outline-none"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex-1 md:flex-none flex justify-end ml-auto">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
          <FaUserCircle className="text-blue-700 text-lg" />
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Venture Admin'}</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{user?.email || 'admin@venturesoft.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
