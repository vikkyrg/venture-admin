import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import { getCourses, getModulesByCourse, getTopicsByModule, createTopic, updateTopic, deleteTopic } from '../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { generateSlug } from '../utils/generateSlug';

const TopicsManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    learningObjectivesStr: '',
    subTopicsStr: '',
    status: 'published'
  });

  useEffect(() => {
    const init = async () => {
      const res = await getCourses();
      const list = res.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0]._id);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadModules = async () => {
      if (!selectedCourseId) return;
      const res = await getModulesByCourse(selectedCourseId);
      const list = res.data || [];
      setModules(list);
      if (list.length > 0) {
        setSelectedModuleId(list[0]._id);
      } else {
        setSelectedModuleId('');
        setTopics([]);
      }
    };
    loadModules();
  }, [selectedCourseId]);

  const fetchTopics = async () => {
    if (!selectedModuleId) return;
    try {
      setLoading(true);
      const res = await getTopicsByModule(selectedModuleId);
      setTopics(res.data || []);
    } catch (err) {
      console.error('Fetch topics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedModuleId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isSlugManuallyEdited ? prev.slug : generateSlug(val)
    }));
  };

  const handleOpenModal = (t = null) => {
    setIsSlugManuallyEdited(false);
    if (t) {
      setEditingTopic(t);
      setFormData({
        title: t.title,
        slug: t.slug,
        shortDescription: t.shortDescription || '',
        content: t.content || '',
        learningObjectivesStr: (t.learningObjectives || []).join('\n'),
        subTopicsStr: (t.subTopics || []).join(', '),
        status: t.status || 'published'
      });
    } else {
      setEditingTopic(null);
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        content: '',
        learningObjectivesStr: '',
        subTopicsStr: '',
        status: 'published'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        courseId: selectedCourseId,
        moduleId: selectedModuleId,
        learningObjectives: formData.learningObjectivesStr.split('\n').filter(s => s.trim()),
        subTopics: formData.subTopicsStr.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingTopic) {
        await updateTopic(editingTopic._id, payload);
      } else {
        await createTopic(payload);
      }
      setIsModalOpen(false);
      fetchTopics();
    } catch (err) {
      console.error('Save topic error:', err);
      alert(err.response?.data?.message || 'Error saving topic.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this topic?')) {
      try {
        await deleteTopic(id);
        fetchTopics();
      } catch (err) {
        console.error('Delete topic error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Topic Content Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage detailed lesson topics, markdown descriptions, and learning objectives.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm focus:outline-none focus:border-blue-600"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm focus:outline-none focus:border-blue-600"
          >
            {modules.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            disabled={!selectedModuleId}
            className="px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow disabled:opacity-50 transition-colors"
          >
            <FaPlus />
            Add New Topic
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
              <th className="py-4 px-6">Topic Title</th>
              <th className="py-4 px-6">Slug</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr><td colSpan="4" className="py-8 text-center text-slate-500">Loading topics...</td></tr>
            ) : topics.length > 0 ? (
              topics.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div>{t.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal line-clamp-1">{t.shortDescription}</div>
                  </td>
                  <td className="py-4 px-6 text-blue-700 font-mono text-[11px] font-semibold">{t.slug}</td>
                  <td className="py-4 px-6"><Badge status={t.status} /></td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => handleOpenModal(t)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200"><FaEdit /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="py-8 text-center text-slate-500">No topics found for this module. Click "Add New Topic" above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900">{editingTopic ? 'Edit Topic' : 'Create Topic'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                  <input type="text" required value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug *</label>
                  <input type="text" required value={formData.slug} onChange={(e) => { setIsSlugManuallyEdited(true); setFormData({ ...formData, slug: e.target.value }); }} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Content (Markdown Supported)</label>
                <textarea rows="6" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Learning Objectives (One per line)</label>
                <textarea rows="3" value={formData.learningObjectivesStr} onChange={(e) => setFormData({ ...formData, learningObjectivesStr: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtopics (Comma Separated)</label>
                <input type="text" value={formData.subTopicsStr} onChange={(e) => setFormData({ ...formData, subTopicsStr: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold shadow hover:bg-blue-800">Save Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TopicsManager;
