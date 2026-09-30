import { Eye, EyeOff } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

// helper to resolve nested error messages without lodash
function getError(errors: any, name: string) {
  return name.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      if (!isNaN(Number(part))) {
        return acc[Number(part)];
      }
      return acc[part];
    }
    return undefined;
  }, errors);
}

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  prefix?: ReactNode; // optional static prefix (CAD, USD, etc.)
  readonly?: boolean;
}

const FormInput = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  errors,
  required = false,
  prefix,
  readonly = false,
}: FormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  const fieldError = getError(errors, name);

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex relative">
        {/* Prefix (if provided) */}
        {prefix && (
          <div className="flex items-center justify-center min-w-[80px] h-[42px] px-3 border-2 border-r-0 border-gray-100 rounded-l-lg bg-gray-50 text-gray-700 text-sm font-medium">
            {prefix}
          </div>
        )}

        {/* Input field */}
        <input
          type={isPasswordField && !showPassword ? 'password' : 'text'}
          id={name}
          {...register(name)}
          className={`w-full py-2 px-3 border-2 transition-shadow focus:outline-none focus:ring-2 text-black
            ${prefix ? 'rounded-r-lg' : 'rounded-lg'}
            ${
              fieldError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-100 focus-visible:ring-green-500'
            } ${readonly && 'focus-visible:ring-0'}`}
          placeholder={placeholder}
          readOnly={readonly}
        />

        {/* Password toggle */}
        {isPasswordField && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {fieldError && <p className="text-red-500 text-sm mt-1">{String(fieldError.message)}</p>}
    </div>
  );
};

export default FormInput;
