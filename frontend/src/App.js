import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import MySwaps from './pages/MySwaps';
import SwapDetail from './pages/SwapDetail';
import Chat from './pages/Chat';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ProfileItems from './pages/ProfileItems';
import ProfileSwaps from './pages/ProfileSwaps';
import Help from './pages/Help';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Guidelines from './pages/Guidelines';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfileSidebar from './components/ProfileSidebar';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarPaths = ['/profile', '/profile/dashboard', '/profile/items', '/profile/swaps', '/profile/help', '/profile/feedback', '/profile/settings'];
  const shouldHide = hideNavbarPaths.some(path => location.pathname.startsWith(path));
  return shouldHide ? null : <Navbar />;
}

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterPaths = ['/profile', '/profile/dashboard', '/profile/items', '/profile/swaps', '/profile/help', '/profile/feedback', '/profile/settings'];
  const shouldHide = hideFooterPaths.some(path => location.pathname.startsWith(path));
  return shouldHide ? null : <Footer />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route
              path="/items/create"
              element={
                <PrivateRoute>
                  <CreateItem />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/swaps"
              element={
                <PrivateRoute>
                  <MySwaps />
                </PrivateRoute>
              }
            />
            <Route
              path="/swaps/:id"
              element={
                <PrivateRoute>
                  <SwapDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/items"
              element={
                <PrivateRoute>
                  <ProfileItems />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/swaps"
              element={
                <PrivateRoute>
                  <ProfileSwaps />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/help"
              element={
                <PrivateRoute>
                  <Help />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/feedback"
              element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route path="/help" element={<Help />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/guidelines" element={<Guidelines />} />
          </Routes>
        </div>
        <ConditionalFooter />
      </Router>
    </AuthProvider>
  );
}

export default App;
