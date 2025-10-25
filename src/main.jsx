import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import router from './router';
import AuthProvider from './Provider/AuthProvider';
import "aos/dist/aos.css";
import Aos from 'aos';


Aos.init({
  duration: 800,
});






createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
