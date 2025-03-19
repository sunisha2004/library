import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./scss/Login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Fields cannot be empty");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3002/api/login", {
                email,
                pass: password,
            });
            
            localStorage.setItem("token", response.data.token);
            navigate("/"); 
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="login-options">
                    <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                    <p>Don't have an account? <Link to="/emailverify" className="register-link">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
