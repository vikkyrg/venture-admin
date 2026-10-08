import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-xs font-semibold text-slate-500">System API: Active</span>
      </div>

      <div className="flex items-center gap-6">
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
