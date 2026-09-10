import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GuestLayout from './components/common/GuestLayout'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App