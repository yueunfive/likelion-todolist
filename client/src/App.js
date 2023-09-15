import "./App.css";
import TodoPage from "./pages/TodoPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/todoPage/:dateId" element={<TodoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
