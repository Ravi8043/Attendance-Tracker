import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const tokens = await loginAPI({
      username: "Surya",
      password: "Surya@8043",
    }); 
    // Call the login method from AuthContext to store tokens in localStorage

    login(tokens);
    navigate("/");
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default Login;

