const StatCard = ({ title, value, icon, subtitle }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-[11px] text-teal-700 font-semibold mt-1">{subtitle}</p>}
      </div>
      <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 text-teal-700 text-2xl">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
