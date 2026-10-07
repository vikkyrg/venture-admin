import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    duration: '8 Weeks',
    level: 'All Levels',
    mode: 'Live Online',
    status: 'published',
    featured: false
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        duration: course.duration || '8 Weeks',
        level: course.level || 'All Levels',
        mode: course.mode || 'Live Online',
        status: course.status || 'published',
        featured: course.featured || false
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        duration: '8 Weeks',
        level: 'All Levels',
        mode: 'Live Online',
        status: 'published',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, formData);
      } else {
        await createCourse(formData);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error('Save course error:', err);
      alert(err.response?.data?.message || 'Failed to save course.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course and all its modules/topics?')) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const toggleStatus = async (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await updateCourse(course._id, { status: newStatus });
      fetchCourses();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Course Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create, edit, and publish training tracks for the website.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2 transition-all"
        >
          <FaPlus />
          Add New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
              <th className="py-4 px-6">Course Name</th>
              <th className="py-4 px-6">Slug</th>
              <th className="py-4 px-6">Duration / Level</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading courses...</td></tr>
            ) : courses.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  <div>{c.title}</div>
                  <div className="text-[10px] text-slate-500 font-normal line-clamp-1">{c.shortDescription}</div>
                </td>
                <td className="py-4 px-6 text-teal-700 font-mono text-[11px] font-semibold">{c.slug}</td>
                <td className="py-4 px-6 text-slate-600">{c.duration} • {c.level}</td>
                <td className="py-4 px-6">
                  <button onClick={() => toggleStatus(c)} title="Click to toggle status">
                    <Badge status={c.status} />
                  </button>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(c)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-teal-700 border border-slate-200 transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200 transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl w-full shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Level</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoursesManager;
