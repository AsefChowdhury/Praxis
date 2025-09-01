import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import Dashboard from './dashboard/Dashboard';
import MainLayout from "./layouts/main-layout/MainLayout";
import AuthPage from './authentication/AuthPage'
import MyFlashcards from "./flashcards/MyFlashcards";
import MyQuizzes from "./quizzes/MyQuizzes";
import MyNotes from "./notes/MyNotes";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicRoute from "./authentication/PublicRoute";
import LandingPage from "./core-pages/LandingPage";
import AboutUs from "./core-pages/AboutUs";
import ContactUs from "./core-pages/ContactUs";
import CorePagesLayout from "./layouts/core-pages-layout/CorePagesLayout";
import ManageDeck from "./flashcards/ManageDeck";
import FlashcardTest from "./flashcards/FlashcardTest";
import { AuthProvider } from "./authentication/AuthProvider";
import ForgotPassword from "./authentication/ForgotPassword";
import ResetPassword from "./authentication/ResetPassword";
import ManageNotes from "./notes/ManageNotes";

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<CorePagesLayout/>}>
            <Route index element={<LandingPage/>}></Route>
            <Route path="about-us" element={<AboutUs/>}></Route>
            <Route path="contact-us" element={<ContactUs/>}></Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="flashcards">
                <Route index element={<MyFlashcards />} />
                <Route path="create" element={<ManageDeck mode="create" />} />
                <Route path="edit/:deckId" element={<ManageDeck mode="edit" />} />
              </Route>
              <Route path="quizzes" element={<MyQuizzes />} />
              <Route path="notes" element={<MyNotes />} />
            </Route>
            <Route path="flashcards/test/:deckId" element={<FlashcardTest />} />
          </Route>
          <Route path="auth" element={<PublicRoute/>}>
            <Route index element={<Navigate to="sign-in" replace/>}></Route>
            <Route path="sign-in" element={<AuthPage mode="sign-in"/>}></Route>
            <Route path="sign-up" element={<AuthPage mode="sign-up"/>}></Route>
            <Route path="forgot-password" element={<ForgotPassword/>}></Route>
          </Route>
          <Route path="reset-password/:uid/:token" element={<ResetPassword/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  ) 
}

export default App
