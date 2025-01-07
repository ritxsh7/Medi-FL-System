import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import Client from "./components/Client";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Admin />} path="/admin"></Route>
          <Route element={<Client />} path="/client"></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
