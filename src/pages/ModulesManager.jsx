import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import { getCourses, getModulesByCourse, createModule, updateModule, deleteModule } from '../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { generateSlug } from '../utils/generateSlug';

const ModulesManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    order: 1,
    status: 'published'
  });

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getCourses();
        const list = res.data || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourseId(list[0]._id);
        }
      } catch (err) {
        console.error('Init courses error:', err);
      }
    };
    init();
  }, []);

  const fetchModules = async () => {
    if (!selectedCourseId) {
      setModules([]);
      return;
    }
    try {
      setLoading(true);
      const res = await getModulesByCourse(selectedCourseId);
      setModules(res.data || []);
    } catch (err) {
      console.error('Fetch modules error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [selectedCourseId]);



  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isSlugManuallyEdited ? prev.slug : generateSlug(val)
    }));
  };

  const handleOpenModal = (mod = null) => {
    setIsSlugManuallyEdited(false);
    if (mod) {
      setEditingModule(mod);
      setFormData({
        title: mod.title,
        slug: mod.slug,
        description: mod.description || '',
        order: mod.order !== undefined ? mod.order : 1,
        status: mod.status || 'published'
      });
    } else {
      setEditingModule(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        order: modules.length + 1,
        status: 'published'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert('Please select a course first.');
      return;
    }
    try {
      const payload = {
        ...formData,
        order: Number(formData.order),
        courseId: selectedCourseId
      };
      if (editingModule) {
        await updateModule(editingModule._id, payload);
      } else {
        await createModule(payload);
      }
      setIsModalOpen(false);
      fetchModules();
    } catch (err) {
      console.error('Save module error:', err);
      alert(err.response?.data?.message || 'Error saving module.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this module and associated topics?')) {
      try {
        await deleteModule(id);
        fetchModules();
      } catch (err) {
        console.error('Delete module error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Module Management</h1>
          <p className="text-xs text-slate-500 mt-1">Organize course modules and syllabi structures.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            disabled={!selectedCourseId}
            className="px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow disabled:opacity-50"
          >
            <FaPlus />
            Add Module
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Module Title</th>
              <th className="py-4 px-6">Slug</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading modules...</td></tr>
            ) : modules.length > 0 ? (
              modules.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-blue-700 font-bold">#{m.order}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{m.title}</td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">{m.slug}</td>
                  <td className="py-4 px-6"><Badge status={m.status} /></td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => handleOpenModal(m)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200"><FaEdit /></button>
                    <button onClick={() => handleDelete(m._id)} className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-8 text-center text-slate-500">No modules added yet for this course. Click "Add Module" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">{editingModule ? 'Edit Module' : 'Create Module'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Introduction to HTML"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  placeholder="e.g. introduction-to-html"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of module..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold shadow hover:bg-blue-800">Save Module</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ModulesManager;
