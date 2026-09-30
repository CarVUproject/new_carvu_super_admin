'use client';

import Select, { type MultiValue, type StylesConfig } from 'react-select';

type AdminMultiSelectOption = {
  label: string;
  value: string;
};

type AdminMultiSelectProps = {
  label?: string;
  placeholder?: string;
  options: AdminMultiSelectOption[];
  value: AdminMultiSelectOption[];
  onChange: (value: string[]) => void;
};

const selectStyles: StylesConfig<AdminMultiSelectOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 12,
    borderColor: state.isFocused ? '#98A2B3' : '#D5D7DA',
    boxShadow: 'none',
    paddingLeft: 6,
    paddingRight: 6,
    '&:hover': {
      borderColor: '#98A2B3',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingTop: 4,
    paddingBottom: 4,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#667085',
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: 999,
    backgroundColor: '#F2F4F7',
    border: '1px solid #EAECF0',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#344054',
    fontWeight: 600,
  }),
  multiValueRemove: (base) => ({
    ...base,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    ':hover': {
      backgroundColor: '#E4E7EC',
      color: '#101828',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #EAECF0',
    boxShadow: '0 24px 48px -12px rgba(16, 24, 40, 0.18)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#F9FAFB' : '#FFFFFF',
    color: '#344054',
    fontWeight: 500,
  }),
};

export function AdminMultiSelect({
  label,
  placeholder = 'Select options',
  options,
  value,
  onChange,
}: AdminMultiSelectProps) {
  return (
    <div className="grid gap-2">
      {label ? <label className="font-semibold text-cv-gray-500">{label}</label> : null}
      <Select
        isMulti
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={(nextValue: MultiValue<AdminMultiSelectOption>) =>
          onChange(nextValue.map((item) => item.value))
        }
        styles={selectStyles}
        classNamePrefix="cv-admin-select"
      />
    </div>
  );
}
