'use client';

export function TeacherNote({
  title,
  value,
  placeholder,
  onChange,
  onBlur,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-200/80 bg-[#FFF9C4] p-4 shadow-sm">
      <p className="text-xs font-semibold text-amber-900/80 mb-2">{title}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none bg-transparent text-sm leading-relaxed text-amber-950/80 placeholder:text-amber-800/40 focus:outline-none font-[Georgia,serif]"
      />
      <p className="mt-2 text-[10px] text-amber-800/50">22/07/2025</p>
    </div>
  );
}
