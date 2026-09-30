import { LoginLayout } from './_components/AuthContainer';
import LoginForm from './_partials/LoginForm';

function LoginPage() {
  return (
    <LoginLayout title="Welcome Back" subtitle="Super Admin Login">
      <div className="space-y-5">
        <LoginForm />
      </div>
    </LoginLayout>
  );
}

export default LoginPage;
