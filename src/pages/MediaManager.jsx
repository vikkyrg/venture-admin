import { useState, useEffect } from 'react';
import { getMediaFiles, uploadMediaFile, deleteMediaFile } from '../services/api';
import { FaCloudUploadAlt, FaTrash, FaCopy } from 'react-icons/fa';

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await getMediaFiles();
      setMediaFiles(res.data || []);
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await uploadMediaFile(formData);
      fetchMedia();
    } catch (err) {
      console.error('Media upload error:', err);
      alert(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this media file?')) {
      try {
        await deleteMediaFile(id);
        fetchMedia();
      } catch (err) {
        console.error('Delete media error:', err);
      }
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('Media URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Media Asset Library</h1>
          <p className="text-xs text-slate-500 mt-1">Upload images, PDFs, and assets for course topics.</p>
        </div>

        <label className="px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow transition-all">
          <FaCloudUploadAlt className="text-base" />
          {uploading ? 'Uploading...' : 'Upload Media Asset'}
          <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-xs text-slate-500 col-span-full py-8 text-center">Loading media library...</p>
        ) : mediaFiles.length > 0 ? (
          mediaFiles.map((m) => (
            <div key={m._id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 relative">
                {m.mimeType.startsWith('image') ? (
                  <img src={m.url} alt={m.originalName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-mono font-bold text-blue-700">PDF Asset</span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate">{m.originalName}</p>
                <p className="text-[10px] text-slate-500">{Math.round(m.size / 1024)} KB • {m.mimeType}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => copyUrl(m.url)} className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold text-[10px] flex items-center justify-center gap-1">
                  <FaCopy /> Copy URL
                </button>
                <button onClick={() => handleDelete(m._id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 col-span-full py-8 text-center">No media assets uploaded yet.</p>
        )}
      </div>

    </div>
  );
};

export default MediaManager;
