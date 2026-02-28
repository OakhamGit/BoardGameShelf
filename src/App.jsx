import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Menu from './pages/Menu'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminGames from './pages/admin/AdminGames'
import AdminEvents from './pages/admin/AdminEvents'
import AdminStaffPicks from './pages/admin/AdminStaffPicks'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/games" replace />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="picks" element={<AdminStaffPicks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
