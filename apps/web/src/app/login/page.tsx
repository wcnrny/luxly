import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  return (
    <div>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full">
        <LoginForm />
      </div>
    </div>
  );
}
