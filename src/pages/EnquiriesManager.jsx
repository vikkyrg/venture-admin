import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../services/api';
import { FaSearch, FaTrash } from 'react-icons/fa';

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await getEnquiries({ search, status: statusFilter });
      setEnquiries(res.data || []);
    } catch (err) {
      console.error('Fetch enquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      fetchEnquiries();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry record?')) {
      try {
        await deleteEnquiry(id);
        fetchEnquiries();
      } catch (err) {
        console.error('Delete enquiry error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Enquiry Management</h1>
          <p className="text-xs text-slate-500 mt-1">Review contact forms and student inquiries and update lead conversion statuses.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs shadow-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm focus:outline-none focus:border-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email / Phone</th>
              <th className="py-4 px-6">Course Track</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading enquiries...</td></tr>
            ) : enquiries.length > 0 ? (
              enquiries.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{e.name}</td>
                  <td className="py-4 px-6 text-slate-600">
                    <div>
                      <a href={`mailto:${e.email}`} className="hover:text-blue-600 hover:underline">{e.email}</a>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      <a href={`tel:${e.phone}`} className="hover:text-blue-600 hover:underline">{e.phone}</a>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-700">{e.course}</td>
                  <td className="py-4 px-6">
                    <select
                      value={e.status}
                      onChange={(evt) => handleStatusChange(e._id, evt.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1 font-semibold focus:outline-none focus:border-blue-600"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate">{e.message || 'N/A'}</td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDelete(e._id)} className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="py-8 text-center text-slate-500">No student enquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EnquiriesManager;
