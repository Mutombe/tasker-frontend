// src/components/Layout.jsx
import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout, login, register } from "../../redux/slices/authSlice";
import {
  Home,
  User,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  X,
  Search,
  Menu,
  MapPin,
  AtSign,
  LayoutDashboard
} from "lucide-react";
import { Lock } from "lucide-react";
import {
  Dialog,
  Button,
  TextField,
  Divider,
  IconButton,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Chip,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthModals = ({ openType, onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [view, setView] = useState(openType);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const navigate = useNavigate()

  // Update view when openType changes
  useEffect(() => {
    setView(openType);
  }, [openType]);

  useEffect(() => {
    if (openType) {
      setFormData({
        email: "",
        password: "",
        username: "",
      });
    }
  }, [openType]);

  const handleSubmit = () => {
    if (view === "login") {
      dispatch(
        login({ username: formData.username, password: formData.password })
      )
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((err) => {
          console.error("Login Failed:", err);
        });
    } else {
      dispatch(register(formData))
        .unwrap()
        .then(() => {
          onClose();
          navigate("/email-verify");
        })
        .catch((err) => {
          console.error("Registration Failed:", err);
        });
    }
  };

  const getRegistrationError = () => {
    if (!error) return null;

    // Check for specific error messages
    if (typeof error === 'object') {
      if (error.username) return error.username[0];
      if (error.email) return error.email[0];
      if (error.detail) return error.detail;
    }

    // Fallback to generic error message
    return error.toString();
  };


  return (
    <Dialog open={!!openType} onClose={onClose} maxWidth="xs" fullWidth>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="p-6 space-y-6"
      >
        <div className="text-center">
          <div className="animate-bounce mx-auto w-fit p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
            <MapPin className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {view === "login" ? "Welcome Back!" : "Join Taskoba"}
          </h2>
          <p className="text-gray-600">
            {view === "login"
              ? "Sign in to continue"
              : "Create your free account"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 p-3 rounded-lg text-red-700 text-sm"
          >
            {view === 'register' ? getRegistrationError() : (
              typeof error === "object"
                ? error.detail || JSON.stringify(error)
                : error
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          {view === "register" && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              InputProps={{
                startAdornment: <AtSign className="text-gray-400 mr-2" />,
              }}
            />
          )}

          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            InputProps={{
              startAdornment: <User className="text-gray-400 mr-2" />,
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            InputProps={{
              startAdornment: <Lock className="text-gray-400 mr-2" />,
            }}
          />
        </div>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="!rounded-xl !py-3 !text-base !font-semibold !shadow-lg"
        >
          {status === "loading" ? (
            <span className="animate-pulse">Processing...</span>
          ) : view === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        <Divider className="!my-6">or</Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setView(view === "login" ? "register" : "login")}
          className="!rounded-xl !py-2.5 !text-gray-700"
        >
          {view === "login"
            ? "Create New Account"
            : "Already have an account? Sign In"}
        </Button>
      </motion.div>
    </Dialog>
  );
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Responsive Navigation Items
  const navItems = [
    { icon: <Home />, label: "Home", onClick: () => navigate("/") },
    ...(isAuthenticated
      ? [
        {
          icon: <LayoutDashboard />,
          label: "Dashboard",
          onClick: () => navigate("/dashboard")
        },
          {
            icon: <User />,
            label: "Profile",
            onClick: () => {
              /* Navigate */
            },
          },
          {
            icon: <Bell />,
            label: "Notifications",
            onClick: () => {
              /* Navigate */
            },
          },
        ]
      : [
          {
            icon: <LogIn />,
            label: "Login",
            onClick: () => setAuthModal("login"),
          },
          {
            icon: <UserPlus />,
            label: "Register",
            onClick: () => setAuthModal("register"),
          },
        ]),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      {isMobile && (
        <header className="fixed top-0 w-full bg-white shadow-sm z-50">
          <div className="flex items-center justify-between p-4">
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <Menu className="text-gray-700" />
            </IconButton>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <MapPin className="text-white" />
              </div>
              <span className="font-bold text-gray-800">Taskoba</span>
            </div>
            <IconButton>
              <Badge badgeContent={3} color="error">
                <Bell className="text-gray-700" />
              </Badge>
            </IconButton>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 w-full bg-white shadow-lg z-50">
          <div className="flex justify-around p-2">
            {navItems.map((item, i) => (
              <IconButton
                key={i}
                onClick={item.onClick}
                className="!rounded-xl"
              >
                <div className="text-gray-600">{item.icon}</div>
              </IconButton>
            ))}
          </div>
        </nav>
      )}

      {/* Desktop Floating Navigation */}
      {!isMobile && (
        <motion.nav
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-1/2 left-6 -translate-y-1/2 bg-white/90 backdrop-blur-lg p-3 rounded-2xl shadow-xl space-y-3 z-50"
        >
          {navItems.map((item, i) => (
            <IconButton
              key={i}
              onClick={item.onClick}
              className="!rounded-xl hover:!bg-indigo-50"
            >
              {item.icon}
            </IconButton>
          ))}
          {isAuthenticated && (
            <IconButton
              onClick={() => dispatch(logout())}
              className="!rounded-xl hover:!bg-red-50"
            >
              <LogOut className="text-red-600" />
            </IconButton>
          )}
        </motion.nav>
      )}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 p-4"
          >
            <div className="flex justify-end mb-6">
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <X className="text-gray-600" />
              </IconButton>
            </div>
            <div className="space-y-4">
              {navItems.map((item, i) => (
                <Button
                  key={i}
                  fullWidth
                  startIcon={item.icon}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="!justify-start !px-4 !py-3 !rounded-xl !text-gray-700"
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  fullWidth
                  startIcon={<LogOut />}
                  onClick={() => dispatch(logout())}
                  className="!justify-start !px-4 !py-3 !rounded-xl !text-red-600"
                >
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`${isMobile ? "pt-16 pb-20" : "ml-20"} p-4 md:p-8 pt-24`}
      >
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Find errands near you..."
            InputProps={{
              startAdornment: <Search className="text-gray-400 mr-2" />,
              className: "!rounded-2xl !bg-white",
              endAdornment: (
                <Button
                  variant="contained"
                  className="!rounded-xl !px-6 !py-3 !text-sm md:!text-base"
                >
                  Search
                </Button>
              ),
            }}
          />
        </motion.div>

        {children}
      </main>

      {/* Auth Modals */}
      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </div>
  );
};

export default Layout;
