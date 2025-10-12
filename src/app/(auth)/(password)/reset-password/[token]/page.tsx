import { validateResetPasswordToken } from "../../action";
import { FormResetPassword } from "./form-reset-password";

interface Params {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ params }: Params) {
  const { token } = await params;
  const { email, name, error } = await validateResetPasswordToken(token);
  return (
    <div className="flex min-h-screen justify-center w-full items-center px-4 py-10">
      <FormResetPassword
        token={token}
        email={email}
        name={name}
        error={error}
      />
    </div>
  );
}
