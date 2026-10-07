const Badge = ({ status }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status === 'published' || status === 'Converted') {
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (status === 'draft' || status === 'New') {
    style = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (status === 'Contacted' || status === 'Follow-up') {
    style = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (status === 'Closed') {
    style = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {status}
    </span>
  );
};

export default Badge;
