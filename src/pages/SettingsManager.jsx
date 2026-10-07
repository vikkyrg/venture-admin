import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/api';
import { FaSave, FaCheckCircle } from 'react-icons/fa';

const SettingsManager = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    email: '',
    phone: '',
    address: '',
    footerContent: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getSettings();
        if (res.data) setFormData(res.data);
      } catch (err) {
        console.error('Fetch settings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg('');
      await updateSettings(formData);
      setMsg('Site settings updated successfully!');
    } catch (err) {
      console.error('Update settings error:', err);
      alert('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-500">Loading settings...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">System Brand & Contact Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Global site parameters managed dynamically without hardcoding.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 font-semibold">
          <FaCheckCircle className="text-teal-700" /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
            <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Logo Asset Path</label>
            <input type="text" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-teal-600 focus:bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Footer Tagline</label>
          <textarea rows="2" value={formData.footerContent} onChange={(e) => setFormData({ ...formData, footerContent: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white" />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow">
          <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsManager;
