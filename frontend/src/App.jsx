import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Homepage from "./components/home/home";
import Layout from "./components/authmodals/authmodals";
import EmailVerification from "./components/email-verify/emailVerify";
import EmailVerificationNotice from "./components/email-verify/emailVerify";
import TaskDashboard from "./components/tasks/taskDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/verify-email/:uidb64/:token/" element={<EmailVerification />} />
            <Route path="/email-verify/" element={<EmailVerification />} />
            <Route path="/dashboard" element={<TaskDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
