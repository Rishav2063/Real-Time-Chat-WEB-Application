import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Apna backend ka URL lagao
      const res = await fetch("https://live-chat-x7h2.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Token & user info save
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
         localStorage.setItem("userId", data.userId); 
        alert("Login successful! Welcome, " + data.name);

        navigate("/"); // ✅ home page par bhejo
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div style={{ height: "90vh" }}>
      <div className="loginpage-main-div-ex">
        <div className="loginpage-main-main">
          <div className="loginpage-form-div">
            <form onSubmit={handleSubmit} className="loginpage-form">
              <strong className="loginpage-text">
                Can I know Your Valid Email🕵️‍♀️
              </strong>

              <input
                className="loginpage-input"
                type="email"
                name="email"
                placeholder="Genuine Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="loginpage-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                className="loginpage-btn"
                type="submit"
                value="Login"
              />

              <Link to="/signup" style={{ textDecoration: "overline" }}>
                New User! Signup Here
              </Link>
            </form>

            <div className="distance-loginpage-div"></div>

            <p className="terms-loginpage">
              By proceeding, you consent to get calls, WhatsApp or <br />
              SMS/RCS messages, including by automated means, <br />
              from बात चीत and its affiliates to the number provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
