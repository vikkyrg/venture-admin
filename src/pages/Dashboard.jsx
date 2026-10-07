import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { getCourses, getEnquiries } from '../services/api';
import { FaBook, FaLayerGroup, FaListAlt, FaEnvelope } from 'react-icons/fa';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [courseRes, enquiryRes] = await Promise.all([
          getCourses(),
          getEnquiries()
        ]);
        setCourses(courseRes.data || []);
        setEnquiries(enquiryRes.data || []);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const publishedCoursesCount = courses.filter((c) => c.status === 'published').length;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">System Executive Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Overview of courses, active syllabus modules, and incoming student enquiries.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses.length}
          subtitle={`${publishedCoursesCount} Published`}
          icon={<FaBook />}
        />
        <StatCard
          title="Total Modules"
          value={courses.reduce((acc, c) => acc + (c.modulesCount || 8), 0)}
          subtitle="Dynamic MongoDB Structures"
          icon={<FaLayerGroup />}
        />
        <StatCard
          title="Active Syllabi Topics"
          value={courses.reduce((acc, c) => acc + (c.topicsCount || 3), 0)}
          subtitle="Detailed Lesson Notes"
          icon={<FaListAlt />}
        />
        <StatCard
          title="Student Enquiries"
          value={enquiries.length}
          subtitle={`${enquiries.filter(e => e.status === 'New').length} Pending`}
          icon={<FaEnvelope />}
        />
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Recent Student Enquiries</h3>

        {loading ? (
          <p className="text-xs text-slate-500 py-4">Fetching database records...</p>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email / Phone</th>
                  <th className="py-3 px-4">Course Track</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {enquiries.slice(0, 5).map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{e.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{e.email}</div>
                      <div className="text-[10px] text-slate-400">{e.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-700">{e.course}</td>
                    <td className="py-3 px-4"><Badge status={e.status} /></td>
                    <td className="py-3 px-4 text-slate-500">{new Date(e.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No enquiries recorded yet.</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
