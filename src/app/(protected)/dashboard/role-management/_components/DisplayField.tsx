interface DisplayFieldProps {
  label: string;
  value: string;
  required?: boolean;
}

export const DisplayField: React.FC<DisplayFieldProps> = ({ label, value, required }) => {
  return (
    <div className="mt-6 select-none">
      <div>
        <label className="text-base text-[#2B3545] font-semibold">
          {label} {required && <span className="text-[#019935]">*</span>}
        </label>
        <div className="w-full py-2.5 px-3.5 mt-1.5 rounded-md bg-white border border-[#EAEBEC] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
          <h1 className="text-[#2B3545] text-base">{value}</h1>
        </div>
      </div>
    </div>
  );
};

DisplayField.displayName = 'DisplayField';
