import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestLayout from './components/common/GuestLayout'
import AdminPrivateRoute from './components/admin/AdminPrivateRoute'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminLogin from './pages/Admin/Login'
import AdminServices from './pages/Admin/Services'
import About from './pages/About/About'
import Blog from './pages/Blog/Blog'
import Cooperation from './pages/Cooperation/Cooperation'
import Download from './pages/Download/Download'
import Home from './pages/Home/Home'
import Promotions from './pages/Promotions/Promotions'
import Services from './pages/Services/Services'
import ServiceDetail from './pages/Services/ServiceDetail'
import AddOnServices from './pages/Services/AddOnServices'
import Contact from './pages/Support/Contact'
import FAQ from './pages/Support/FAQ'
import Terms from './pages/Support/Terms'
import AdminStaff from './pages/Admin/Staff'
import AdminCandidates from './pages/Admin/Candidates'
import AdminBookings from './pages/Admin/Bookings'
import AdminCustomers from './pages/Admin/Customers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/download" element={<Download />} />
          <Route path="/cooperation" element={<Cooperation />} />
          <Route path="/cooperation/staff" element={<Cooperation />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/add-ons" element={<AddOnServices />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Terms />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App