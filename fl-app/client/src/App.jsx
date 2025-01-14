import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminUI from "./components/Admin";
import ClientUI from "./components/Client";
import Test from "./components/Test";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/admin" element={<AdminUI />} />
        <Route exact path="/test" element={<Test />} />
        <Route exact path="/client/:id" element={<ClientUI />} />
      </Routes>
    </Router>
  );
};
export default App;
