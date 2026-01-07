import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireAdmin } from './routes/RequireAdmin'
import { RequireAuth } from './routes/RequireAuth'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { ItemDetailPage } from './pages/ItemDetailPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { SubmitPage } from './pages/SubmitPage'
import { MySubmissionsPage } from './pages/MySubmissionsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage'
import { AdminSubmissionDetailPage } from './pages/admin/AdminSubmissionDetailPage'
import { AdminLibraryPage } from './pages/admin/AdminLibraryPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/item/:slug" element={<ItemDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/my-submissions" element={<MySubmissionsPage />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />
          <Route path="/admin/submissions/:id" element={<AdminSubmissionDetailPage />} />
          <Route path="/admin/library" element={<AdminLibraryPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
