/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  CheckCircle2, 
  Menu, 
  X,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Signup from './components/Signup';
import FaceRegistration from './components/FaceRegistration';
import Attendance from './components/Attendance';
import ChairmanLogin from './components/ChairmanLogin';
import ChairmanDashboard from './components/ChairmanDashboard';
import FeeApplication from './components/FeeApplication';
import CheckStatus from './components/CheckStatus';
import StudentAttendance from './components/StudentAttendance';
import ChangePassword from './components/ChangePassword';

import { supabase } from './supabaseClient';

const PSS_LOGO = "https://v0-ngo-app-for-studies.vercel.app/images/pss-logo.png";
const CHAIRMAN_PHOTO = "https://v0-ngo-app-for-studies.vercel.app/images/image.png";
const TEAM_PHOTO = "https://v0-ngo-app-for-studies.vercel.app/images/trustees-group.png";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [view, setView] = useState<'landing' | 'signup' | 'face-registration' | 'attendance' | 'chairman-login' | 'chairman-dashboard' | 'fee-application' | 'check-status' | 'student-attendance' | 'change-password'>('landing');
  const [registeredStudentId, setRegisteredStudentId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<'landing' | 'chairman-dashboard'>('landing');
  const [students, setStudents] = useState<any[]>([]);
  const chairmanEmail = "p89206022@gmail.com"; // Chairman's email for Supabase Auth

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStudents(data || []);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchStudents();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'impact', label: 'Our Impact' },
    { id: 'contact', label: 'Contact Us' },
    { 
      id: 'student', 
      label: 'Student', 
      hasDropdown: true,
      subItems: [
        { 
          label: 'Daily Attendance',
          onClick: () => setView('attendance')
        },
        { 
          label: 'Student Attendance',
          onClick: () => setView('student-attendance')
        },
        { 
          label: 'Fee Application', 
          onClick: () => setView('fee-application') 
        },
        { 
          label: 'Check Application Status', 
          onClick: () => setView('check-status') 
        }
      ]
    },
  ];

  const stats = [
    { number: '200+', label: 'Engineering Graduates and Employees in Reputed Organizations', color: 'text-emerald-600' },
    { number: '1,100+', label: 'Are Diploma Holders', color: 'text-emerald-600' },
    { number: '465+', label: 'Students studying Engineering and...', color: 'text-emerald-600' },
    { number: '14', label: 'We expanded to 7 branches', color: 'text-emerald-600' },
  ];

  const supportServices = [
    "Education till the Graduation and Post Graduation",
    "One time meal, College fees, Exam fees, and Study materials",
    "Transportation Facility",
    "Provide Online and Offline Classes"
  ];

  const branches = [
    "Hyderabad", "Rangareddy", "Sangareddy", "Karimnagar", "Medchel"
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setActiveSection(id);
  };

  if (view === 'signup') {
    return (
      <Signup 
        onBack={() => setView('landing')} 
        onSuccess={(id) => {
          setRegisteredStudentId(id);
          setView('face-registration');
        }}
      />
    );
  }

  if (view === 'face-registration' && registeredStudentId) {
    return (
      <FaceRegistration 
        studentId={registeredStudentId}
        onSuccess={() => {
          setRegisteredStudentId(null);
          setView('landing');
          alert('Registration complete! You can now mark your attendance.');
        }}
      />
    );
  }

  if (view === 'attendance') {
    return (
      <Attendance 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'chairman-login') {
    return (
      <ChairmanLogin 
        onBack={() => setView('landing')} 
        onLogin={() => setView('chairman-dashboard')} 
      />
    );
  }

  if (view === 'fee-application') {
    return (
      <FeeApplication 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'check-status') {
    return (
      <CheckStatus 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'student-attendance') {
    return (
      <StudentAttendance 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'chairman-dashboard') {
    return (
      <ChairmanDashboard 
        students={students} 
        onLogout={() => setView('landing')} 
        onChangePassword={() => setView('change-password')}
      />
    );
  }

  if (view === 'change-password') {
    return (
      <ChangePassword 
        chairmanEmail={chairmanEmail}
        onBack={() => setView('chairman-dashboard')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Top Header Info Bar */}
      <div className="hidden lg:flex justify-between items-center px-8 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={PSS_LOGO} alt="PSS Logo" className="w-12 h-12 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Potukuchi Somasundara</h1>
              <p className="text-xs font-medium text-slate-500">Social Welfare & Charitable Trust</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={CHAIRMAN_PHOTO} alt="Chairman" className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            <div>
              <p className="text-xs font-bold text-slate-800">Dr (H.C) P Srinivas</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">CHAIRMAN</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-200/50 px-4 py-2 rounded-lg">
            <Phone className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-bold text-slate-700">9346206332</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white px-4 lg:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Mobile Logo/Title */}
          <div className="lg:hidden flex items-center gap-2">
            <img src={PSS_LOGO} alt="PSS Logo" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            <span className="font-bold text-sm">PSS Trust</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => !item.hasDropdown && scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors flex items-center gap-1 hover:text-emerald-400 py-4 ${activeSection === item.id ? 'text-emerald-400' : 'text-slate-300'}`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                </button>

                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100 z-[100]">
                    {item.subItems?.map((sub, idx) => (
                      <React.Fragment key={idx}>
                        <button 
                          onClick={() => {
                            if (sub.onClick) {
                              sub.onClick();
                            } else {
                              !item.hasDropdown && scrollToSection(item.id);
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          {sub.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('chairman-login')}
              className="hidden sm:block px-4 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            >
              Chairman Login
            </button>
            <button 
              onClick={() => setView('signup')}
              className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors"
            >
              Sign Up
            </button>
            <button 
              className="lg:hidden p-1 text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900 z-[70] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img src={PSS_LOGO} alt="PSS Logo" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    <span className="font-bold text-white">PSS Trust</span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <div key={item.id}>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          onClick={() => {
                            if (!item.hasDropdown) {
                              scrollToSection(item.id);
                            } else {
                              // Toggle mobile dropdown logic could go here if needed
                              // For now we'll just show the items below it
                            }
                          }}
                          className={`text-left text-base font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-between group w-full ${
                            activeSection === item.id 
                              ? 'bg-emerald-600/10 text-emerald-400' 
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {item.label}
                          {item.hasDropdown ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
                          )}
                        </motion.button>
                        
                        {item.hasDropdown && (
                          <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-slate-800 pl-4">
                            {item.subItems?.map((sub, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => {
                                  if (sub.onClick) {
                                    sub.onClick();
                                    setIsMenuOpen(false);
                                  }
                                }}
                                className="text-left py-2 text-sm flex items-center gap-3 text-slate-400 hover:text-white"
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-800 space-y-4">
                  <button 
                    onClick={() => {
                      setView('chairman-login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 text-sm font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Chairman Login
                  </button>
                  <button 
                    onClick={() => {
                      setView('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 lg:pt-20 pb-20 lg:pb-32 px-6 lg:px-8 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] lg:text-xs font-bold text-emerald-600 uppercase tracking-[0.3em] mb-4 lg:mb-6"
          >
            Empowering Students Since 2003
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-7xl font-serif font-bold text-slate-900 mb-6 lg:mb-8 leading-[1.2] lg:leading-[1.1]"
          >
            Every Student Deserves <br className="hidden lg:block" /> Quality Education
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            PSS (Platform for Student Success) is an NGO dedicated to breaking financial barriers. 
            We connect aspiring scholars with scholarships, mentorship, and the guidance they need to pursue higher education.
          </motion.p>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-6 lg:mb-8">About Us</h2>
            <div className="space-y-4 lg:space-y-6 text-sm lg:text-base text-slate-600 leading-relaxed">
              <p>
                PSS Trust (NGO) <span className="font-bold text-slate-900">"POTUKUCHI SOMASUNDARA SOCIAL WELFARE AND CHARITABLE TRUST"</span> (Reg No: 95/2003) established in august 15, 2003. by Mr. Dr (H.C) P Srinivas on the name of his father P Somasundara Sastry( National award best Teacher awardee from AP)
              </p>
              <p>
                Children from many Below Poverty Line families, migrant workers and daily wagers who study in government schools face several challenges to continue their secondary school and college education. The growing economic and cultural gaps in the society do not allow them to rise above their conditions. Boys keep dropping off from schools and work on meagre wages and girls keep getting married at early ages. These conditions either continue or keep worsening for generations unless there is intervention by the Civil Societies.
              </p>
            </div>

            <div className="mt-8 lg:mt-12">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-4">Our Mission:</h3>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 lg:p-6 rounded-r-xl italic text-indigo-900 text-base lg:text-lg">
                "The Vision and the Mission of the PSS Trust is to transform the BPL families who remain as beneficiaries of the Government subsidies to dignified Tax paying civilians through education and employment."
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
              <img src={TEAM_PHOTO} alt="PSS Trust Team" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
              <div className="p-4 lg:p-6 text-center">
                <h4 className="text-lg lg:text-xl font-bold text-indigo-900">PSS Trust Team</h4>
                <p className="text-sm lg:text-base text-indigo-600 font-medium">(Trustees & Leadership)</p>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full -z-10"></div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 lg:py-24 bg-slate-50 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">Our Impact</h2>
            <p className="text-sm lg:text-base text-slate-500 font-medium">Let the Numbers Speak</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 lg:gap-6">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.color} block mb-3 lg:mb-4`}>{stat.number}</span>
                    <div className="w-10 lg:w-12 h-1 bg-orange-400 mb-4 lg:mb-6"></div>
                    <p className="text-sm lg:text-base text-slate-700 font-medium leading-snug">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg lg:text-xl font-bold text-indigo-900 mb-6 lg:mb-8">Our Support Services</h3>
              <ul className="space-y-4 lg:space-y-6">
                {supportServices.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-3 lg:gap-4">
                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600 shrink-0" />
                    <span className="text-sm lg:text-base text-slate-700 font-medium">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Student Prospects Section */}
      <section id="student" className="py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-8 lg:mb-12">Student Prospects at the Trust</h2>
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-6 lg:mb-8 text-center lg:text-left">
                8 Year Career Path for Technical Education
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-center lg:items-start">
                <div className="w-full sm:w-1/2 bg-slate-50 rounded-xl p-3 lg:p-4 border border-slate-200">
                  <img src="https://v0-ngo-app-for-studies.vercel.app/images/screenshot-202025-11-29-20163334.png" alt="Career Path Diagram" className="w-full rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                </div>
                <div className="w-full sm:w-1/2">
                  <ul className="space-y-3 lg:space-y-4 text-sm lg:text-base text-slate-700 font-medium">
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">9th Class</span> – Enrollment with Trust– Focus on Basics</span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">10th Class</span> – Board exams and Polytechnic Entrance.</span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span>Some students will also be selected for Vocational courses after the 10 class. These kids secure jobs after the completion of courses</span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">Diploma</span> – 3 years</span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">Placement</span></span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">Engineering</span> – 3 years</span>
                    </li>
                    <li className="flex items-start gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <span><span className="font-bold">Placement</span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-6 lg:mb-8 text-center lg:text-left">
                Skill Development path
              </h3>
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-3">1. Health Sector</h4>
                  <ul className="ml-5 lg:ml-6 space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-700 font-medium list-decimal">
                    <li>Multipurpose Health Workers</li>
                    <li>Medical Lab Technician</li>
                    <li>Pharmatech</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-3">2. Computer Courses</h4>
                  <ul className="ml-5 lg:ml-6 space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-700 font-medium list-decimal">
                    <li>Animation and multimedia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-3">3. Automobile</h4>
                  <ul className="ml-5 lg:ml-6 space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-700 font-medium list-decimal">
                    <li>Driver careers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-3">4. Technicians</h4>
                  <ul className="ml-5 lg:ml-6 space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-700 font-medium list-decimal">
                    <li>Plumbing</li>
                    <li>Electrical technicians</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 lg:py-24 bg-white px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-10 lg:mb-16">Contact Us</h2>
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-8 lg:space-y-12">
            <div className="flex gap-4 lg:gap-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">Phone:</h3>
                <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg">
                  <p>+91-9246106332</p>
                  <p>+91-9346206332</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">E-mail:</h3>
                <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg">
                  <p>chairman@psstrust.org</p>
                  <p>info@psstrust.org</p>
                  <p>potukuchitrust@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">Location (Office):</h3>
                <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg leading-relaxed">
                  <p className="font-bold text-slate-900">PSS Trust:</p>
                  <p>#2530/79, Watertank, Mathrusree Nagar,</p>
                  <p>Miyapur, Hyderabad, Telangana 500049</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group mt-8 lg:mt-0">
            <div className="bg-slate-200 rounded-3xl overflow-hidden aspect-video shadow-2xl border-4 lg:border-8 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.247194634567!2d78.3456789!3d17.4987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a2b1c2d3e4%3A0x5f6g7h8i9j0k1l2m!2sMiyapur%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-md flex items-center gap-2 text-xs lg:text-sm font-bold text-blue-600">
                Open in Maps <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                <p className="text-white font-bold text-sm lg:text-lg bg-black/40 px-4 lg:px-6 py-2 lg:py-3 rounded-full backdrop-blur-sm">Use ctrl + scroll to zoom the map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Bottom Info Section */}
      <footer className="bg-slate-50 py-12 lg:py-20 px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 lg:gap-12">
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 lg:mb-6">Focus</h3>
            <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Parent and student counseling
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Learning outcomes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Technical education
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Employment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Health and wellbeing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Underprivileged children and youth
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 lg:mb-6">Impact</h3>
            <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                1100+ children completed Secondary school
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                800+ Diploma Engineers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                180+ Graduate Engineers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                85% are Girls – Educated & Employed
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                No Girl child marriages
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                Ongoing counseling for students and parents
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 lg:mb-6">Our Branches</h3>
            <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-slate-600 font-medium">
              {branches.map((branch, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  {branch}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 lg:mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs lg:text-sm font-medium">
          © {new Date().getFullYear()} Potukuchi Somasundara Social Welfare & Charitable Trust. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
