import Header from './Header.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import '../styles/Landing.css'
import WebFont from 'webfontloader';
import { useEffect, useState } from 'react';
import Login from '../auth/Login.jsx';

export default function Landing(){

    //Toggle Login Modal
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const handleOpenModal = () => setIsLoginOpen(true);
    const handleCloseModal = () => setIsLoginOpen(false);

    useEffect(() => {
      if (isLoginOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isLoginOpen]);

    useEffect(() => {
      WebFont.load({
        google: { families: ['Poppins', 'Montserrat', 'Port Lligat Sans'] }
      });
    }, []);

    useEffect(() => {
      // Navbar scroll effect
      const handleScroll = () => {
        const header = document.querySelector('header');
        const home = document.querySelector('.home');

        if (header) {
          header.classList.toggle('scrolled', window.scrollY > 50);
        }
        if (home) {
          home.classList.toggle('scrolled', window.scrollY > 50);
        }
      };
    
      // Animate on scroll
      const animateOnScroll = () => {
        const elements = document.querySelectorAll('.course-card, .service-card, .contact-form');
        elements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (elementTop < windowHeight - 100) {
            element.classList.add('animate');
          }
        });
      };
    
      // Smooth scroll
      const anchors = document.querySelectorAll('a[href^="#"]');
      const smoothScrollHandler = e => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
        }
    
        const navLinks = document.querySelector('.nav-links');
        if (navLinks?.classList.contains('show')) {
          navLinks.classList.remove('show');
        }
      };
    
      anchors.forEach(anchor => anchor.addEventListener('click', smoothScrollHandler));
    
      // Mobile menu
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
    
      const toggleMenu = () => navLinks.classList.toggle('show');
      menuToggle?.addEventListener('click', toggleMenu);
    
      // Booking form
      const contactForm = document.getElementById('contactForm');
      const modal = document.getElementById('confirmationModal');
      const closeModal = document.querySelector('.close');
    
      const formSubmitHandler = e => {
        e.preventDefault();
        if (validateForm()) {
          modal.style.display = 'block';
        }
      };
    
      const closeModalHandler = () => {
        modal.style.display = 'none';
      };
    
      const windowClickHandler = e => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      };
    
      contactForm?.addEventListener('submit', formSubmitHandler);
      closeModal?.addEventListener('click', closeModalHandler);
      window.addEventListener('click', windowClickHandler);
    
      // Scroll listeners
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('scroll', animateOnScroll);
      window.addEventListener('load', animateOnScroll);
    
      // Dynamic copyright
      const yearEl = document.getElementById('currentYear');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    
      // Cleanup on unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', animateOnScroll);
        window.removeEventListener('load', animateOnScroll);
        contactForm?.removeEventListener('submit', formSubmitHandler);
        closeModal?.removeEventListener('click', closeModalHandler);
        window.removeEventListener('click', windowClickHandler);
        anchors.forEach(anchor => anchor.removeEventListener('click', smoothScrollHandler));
        menuToggle?.removeEventListener('click', toggleMenu);
      };
    }, []);


    return (
        <div className="landing">
          <Header />
          <Navbar handleOpenModal={handleOpenModal} />
          <Footer />
          <Login isOpen={isLoginOpen} onClose={handleCloseModal} />
        </div>
    );
}