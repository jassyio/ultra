import AuthForm from "./AuthForm";

const Register = () => {
  const handleRegister = (data) => {
    console.log("Registering with:", data);
    // TODO: Implement actual register logic
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
