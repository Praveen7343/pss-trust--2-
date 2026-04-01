import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, 
  Users, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  FileText,
  Check,
  X as CloseIcon,
  Eye,
  Receipt,
  Loader2,
  Lock
} from 'lucide-react';

const PSS_LOGO = "https://v0-ngo-app-for-studies.vercel.app/images/pss-logo.png";

interface Student {
  id: string;
  trust_id: string;
  full_name: string;
  father_name: string;
  email: string;
  mobile_number: string;
  college_name: string;
  branch: string;
  status?: string;
  photo_url?: string;
  created_at?: string;
}

interface FeeApplication {
  id: string;
  student_id: string;
  full_name: string;
  college_name: string;
  pin_number?: string;
  phone_number?: string;
  email?: string;
  requesting_for: string;
  academic_records?: any[];
  contribution: string;
  file_url: string;
  status: string;
  created_at: string;
}

interface ChairmanDashboardProps {
  students: Student[];
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function ChairmanDashboard({ students, onLogout, onChangePassword }: ChairmanDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'students' | 'applications' | 'attendance'>('students');
  const [applications, setApplications] = useState<FeeApplication[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedApp, setSelectedApp] = useState<FeeApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchApplications();
    fetchAttendanceLogs();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudentsList(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, students(full_name, trust_id, college_name)')
        .gte('created_at', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendanceLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch attendance logs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fixLegacyUrls = async () => {
    setIsFixing(true);
    try {
      const { data: apps, error: fetchError } = await supabase
        .from('applications')
        .select('id, file_url')
        .is('file_url', null);

      if (fetchError) throw fetchError;
      alert(`Found ${apps?.length || 0} applications to fix.`);
    } catch (error: any) {
      console.error('Fix URLs error:', error);
      alert('Error fixing URLs: ' + error.message);
    } finally {
      setIsFixing(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      alert(`Application ${status}!`);
    } catch (error: any) {
      console.error('Update status error:', error);
      alert('Error updating status: ' + error.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.trust_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || (filter === 'Logged In' && s.status === 'Active') || (filter === 'Not Logged In' && s.status === 'Pending');
    return matchesSearch && matchesFilter;
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS Admin Dashboard</h1>
            <p className="text-xs font-medium text-slate-500">Chairman: Dr (H.C) P Srinivas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fixLegacyUrls}
            disabled={isFixing}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            title="Fix Legacy URLs"
          >
            {isFixing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          </button>
          <button 
            onClick={onChangePassword}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Change Password"
          >
            <Lock className="w-5 h-5" />
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <span className="text-xl font-bold">{studentsList.length}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-lg font-bold text-slate-900">Registered</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'pending').length} Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'approved').length} Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <CloseIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'rejected').length} Applications</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'students' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Students ({studentsList.length})
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Fee Applications ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'attendance' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Today's Attendance ({attendanceLogs.length})
          </button>
        </div>

        {/* Table Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'students' && (
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {['All', 'Logged In', 'Not Logged In'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'students' ? (
            <div className="overflow-x-auto">
              {/* ... existing students table ... */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trust Branch</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Signup Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                          {student.trust_id}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            {student.photo_url ? (
                              <img 
                                src={student.photo_url} 
                                alt={student.full_name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}&background=random`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Users className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{student.full_name}</p>
                            <p className="text-xs text-slate-500">{student.mobile_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-700">{student.father_name}</span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-slate-700">
                          {student.college_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.branch}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'applications' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Request For</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div>
                          <p className="font-bold text-slate-900">{app.full_name}</p>
                          <p className="text-xs text-slate-500">{app.student_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-slate-700">{app.college_name}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-slate-700">{app.requesting_for}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className="font-bold text-slate-900">N/A</span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                          app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'approved')}
                                disabled={isUpdating === app.id}
                                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                disabled={isUpdating === app.id}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <CloseIcon className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        No attendance marked for today yet.
                      </td>
                    </tr>
                  ) : (
                    attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <p className="font-bold text-slate-900">{(log.students as any)?.full_name || 'Unknown'}</p>
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                            {(log.students as any)?.trust_id || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-sm text-slate-600">{(log.students as any)?.college_name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-6 text-sm text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Present
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">Application Details</h2>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Request Form Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Student Request Form</span>
                  </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</p>
                        <p className="font-bold text-slate-900">{selectedApp.full_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">SID</p>
                        <p className="font-bold text-slate-900">{selectedApp.student_id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">College</p>
                        <p className="font-bold text-slate-900">{selectedApp.college_name}</p>
                      </div>
                      {selectedApp.phone_number && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</p>
                          <p className="font-bold text-slate-900">{selectedApp.phone_number}</p>
                        </div>
                      )}
                      {selectedApp.email && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                          <p className="font-bold text-slate-900">{selectedApp.email}</p>
                        </div>
                      )}
                    </div>

                    {selectedApp.academic_records && selectedApp.academic_records.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Academic Records</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedApp.academic_records.map((rec, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{rec.semester}</p>
                              <div className="flex justify-between items-end mt-1">
                                <span className="text-sm font-bold text-slate-900">GPA: {rec.gpa}</span>
                                <span className="text-[10px] text-red-500 font-bold">BK: {rec.backlogs}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Contribution towards Trust</h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                      "{selectedApp.contribution}"
                    </div>
                  </div>

                  {selectedApp.file_url && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-emerald-900">Attached Document</p>
                          <p className="text-xs text-emerald-600">View student's request letter</p>
                        </div>
                        <a 
                          href={selectedApp.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all"
                        >
                          View File
                        </a>
                      </div>
                      
                      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                        <iframe 
                          src={selectedApp.file_url} 
                          className="w-full h-[400px] border-none"
                          title="Document Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'rejected');
                      setSelectedApp(null);
                    }}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-white transition-all"
                  >
                    Reject Application
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'approved');
                      setSelectedApp(null);
                    }}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Accept & Notify Student
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
