import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminUI from "./components/Admin";
import ClientUI from "./components/Client";
import Test from "./components/Test";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import ProtectedPage from "./pages/ProtectedPage";
import RedirectPage from "./pages/RedirectPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RedirectPage>
              <LoginPage />
            </RedirectPage>
          }
        />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route
          exact
          path="/admin"
          element={
            <ProtectedPage role="admin">
              <AdminUI />
            </ProtectedPage>
          }
        />
        <Route exact path="/test" element={<Test />} />
        <Route
          exact
          path="/client/:id"
          element={
            <ProtectedPage role="client">
              <ClientDashboardPage />
            </ProtectedPage>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
