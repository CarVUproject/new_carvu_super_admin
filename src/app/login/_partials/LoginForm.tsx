'use client';

import { CustomButton } from '@/components/ui/Button';
import CustomAlert from '@/components/ui/CustomAlert';
import FormInput from '@/components/ui/Input';
import { useLoginMutation } from '@/features/auth/authSlice';
import { LoginSchema } from '@/schemas/authSchema';
import { LoginFormType } from '@/types/auth.types';
import { useRouter } from '@bprogress/next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const LoginForm = () => {
  /**-Next Hooks-**/
  const router = useRouter();

  /**-RTK-**/
  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();

  /**-Hook Form-**/
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    mode: 'onChange',
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const userData = await login(data).unwrap();
      if (userData.access) {
        console.log('loggedIn');
        router.push('/dashboard');
        reset();
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast('Invalid Email Or Password', { type: 'error', position: 'top-right' });
      } else {
        toast('Something went wrong!', { type: 'error', position: 'top-right' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CustomAlert
        open={loginError && 'status' in loginError && loginError.status === 401 ? true : false}
        variant="outlined"
        severity="error"
        text="Invalid Credentials!"
        crossNeeded={true}
      />
      <FormInput
        register={register}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        errors={errors}
        required
      />

      <FormInput
        register={register}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        errors={errors}
        required
      />

      <CustomButton type="submit" variant="primary" size="lg" fullWidth loading={loginLoading}>
        Log in
      </CustomButton>
    </form>
  );
};

export default LoginForm;
