import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminUI from "./components/Admin";
import ClientUI from "./components/Client";
import Test from "./components/Test";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/admin" element={<AdminUI />} />
        <Route exact path="/test" element={<Test />} />
        <Route exact path="/client/:id" element={<ClientUI />} />
      </Routes>
    </Router>
  );
};
export default App;
