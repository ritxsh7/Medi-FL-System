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
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSessionPage from "./pages/AdminSessionPage";
import ClientSessionPage from "./pages/ClientSessionPage";

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
              <AdminDashboardPage />
            </ProtectedPage>
          }
        />
        <Route
          exact
          path="/client/:id"
          element={
            <ProtectedPage role="client">
              <ClientDashboardPage />
            </ProtectedPage>
          }
        />
        <Route exact path="/admin/session" element={<AdminSessionPage />} />
        <Route exact path="/client/session" element={<ClientSessionPage />} />
        <Route exact path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};
export default App;
