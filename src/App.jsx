import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoursesManager from './pages/CoursesManager';
import ModulesManager from './pages/ModulesManager';
import TopicsManager from './pages/TopicsManager';
import MediaManager from './pages/MediaManager';
import EnquiriesManager from './pages/EnquiriesManager';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Admin Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CoursesManager />} />
            <Route path="modules" element={<ModulesManager />} />
            <Route path="topics" element={<TopicsManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="enquiries" element={<EnquiriesManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
