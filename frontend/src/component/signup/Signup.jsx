import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // same css file use kar sakte ho

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // ✅ Apna backend ka signup endpoint
      const res = await fetch("https://live-chat-x7h2.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Signup ke turant baad login ki tarah localStorage me save
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userId", data.userId); // ✅ userId bhi save

        alert("Signup successful! Welcome, " + data.name);

        console.log("userdata", data);

        // ✅ Signup ke baad home par redirect
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div style={{ height: "90vh" }}>
      <div className="loginpage-main-div-ex">
        <div className="loginpage-main-main">
          <div className="loginpage-form-div">
            <form onSubmit={handleSubmit} className="loginpage-form">
              <strong className="loginpage-text">Let’s Get You Started 🚀</strong>

              <input
                className="loginpage-input"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                className="loginpage-input"
                type="email"
                placeholder="Genuine Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="loginpage-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                className="loginpage-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <input className="loginpage-btn" type="submit" value="Signup" />

              <Link to="/login" style={{ textDecoration: "overline" }}>
                Already Registered? Login Here
              </Link>
            </form>

            <div className="distance-logibpage-div"></div>

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

export default Signup;
