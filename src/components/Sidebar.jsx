import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { 
  FaChartPie, 
  FaBook, 
  FaLayerGroup, 
  FaListAlt, 
  FaImages, 
  FaEnvelope, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartPie /> },
    { label: 'Courses', path: '/admin/courses', icon: <FaBook /> },
    { label: 'Modules', path: '/admin/modules', icon: <FaLayerGroup /> },
    { label: 'Topics', path: '/admin/topics', icon: <FaListAlt /> },
    { label: 'Enquiries', path: '/admin/enquiries', icon: <FaEnvelope /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen z-50 shadow-xl md:shadow-sm transform transition-transform duration-300 ease-in-out shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Venture Soft Admin" className="h-9 w-auto object-contain" />
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mt-2 block">
            Admin Control Center
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex flex-col overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 font-bold border-l-4 border-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`text-sm ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 font-bold text-xs transition-colors"
        >
          <FaSignOutAlt />
          Logout System
        </button>
      </div>

    </aside>
    </>
  );
};

export default Sidebar;
