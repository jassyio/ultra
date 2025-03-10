import AuthForm from "./AuthForm";

const Login = () => {
  const handleLogin = (data) => {
    console.log("Logging in with:", data);
    // TODO: Implement actual login logic
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
