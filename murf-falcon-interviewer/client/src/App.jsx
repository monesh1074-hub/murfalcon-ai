import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomeScreen from './components/screens/HomeScreen';
import SelectionScreen from './components/screens/SelectionScreen';
import InterviewScreen from './components/screens/InterviewScreen';
import ScorecardScreen from './components/screens/ScorecardScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';

export default function App() {
  const { screen, setScreen } = useApp();
  const { isAuthenticated, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-5xl mb-4 mx-auto animate-pulse">
            🎙️
          </div>
          <div className="text-zinc-400 text-sm">Loading Murf Falcon...</div>
        </div>
      </div>
    );
  }

  // If trying to access protected screen without login
  const protectedScreens = ['selection', 'interview', 'scorecard'];
  const needsAuth = protectedScreens.includes(screen) && !isAuthenticated;

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* Public Screens */}
        {screen === 'home' && <HomeScreen />}

        {screen === 'login' && (
          <LoginScreen onSwitchToSignup={() => setScreen('signup')} />
        )}

        {screen === 'signup' && (
          <SignupScreen onSwitchToLogin={() => setScreen('login')} />
        )}

        {/* Redirect to login if not authenticated */}
        {needsAuth && (
          <LoginScreen onSwitchToSignup={() => setScreen('signup')} />
        )}

        {/* Protected Screens */}
        {screen === 'selection' && isAuthenticated && <SelectionScreen />}
        {screen === 'interview' && isAuthenticated && <InterviewScreen />}
        {screen === 'scorecard' && isAuthenticated && <ScorecardScreen />}
      </div>

      <Footer />
      <Toast />
    </div>
  );
}