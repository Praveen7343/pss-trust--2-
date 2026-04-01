import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, GraduationCap, Building2, Calendar, Hash, Percent, School, Phone, Mail, MapPin, BookOpen, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SignupProps {
  onBack: () => void;
  onSuccess: (studentId: string) => void;
}

const TRUST_BRANCHES = ['BHEL', 'Bollaram', 'myp', 'MKR', 'ECEL'];

export default function Signup({ onBack, onSuccess }: SignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'male',
    mobileNumber: '',
    email: '',
    password: '',
    address: '',
    trustBranch: 'BHEL',
    // SSC Details
    sscSchool: '',
    sscBoard: 'SSC',
    sscYear: new Date().getFullYear() - 3,
    sscPercentage: '',
    // Course Info
    courseType: 'diploma' as 'diploma' | 'btech',
    collegeName: '',
    branch: '',
    yearOfJoining: new Date().getFullYear(),
    // Diploma specific
    pinNumber: '',
    diplomaPercentage: '',
    // B.Tech specific
    btechCollege: '',
    btechYear: '1st',
    btechBranch: '',
    universityName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed - no user data returned');

      // 2. Generate Trust ID (Year-Branch-Serial)
      const year = parseInt(formData.yearOfJoining.toString()) || new Date().getFullYear();
      const branch = formData.trustBranch;
      const serialNumber = Math.floor(Math.random() * 1000) + 1;
      const formattedSerial = serialNumber.toString().padStart(3, '0');
      const generatedTrustId = `${year}-${branch}-${formattedSerial}`;

      // 3. Insert additional details into "students" table
      // Note: Ensure RLS allows inserts for authenticated users or public if needed.
      // Usually, we want "authenticated" users to be able to insert their own profile.
    const { error: dbError } = await supabase
      .from('students')
      .insert([{
        id: authData.user.id,
        sid: generatedTrustId,      // ← was trust_id, must be sid
        full_name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        dob: formData.dob,
        gender: formData.gender,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        trust_branch: formData.trustBranch,
        ssc_school: formData.sscSchool,
        ssc_board: formData.sscBoard,
        ssc_year: formData.sscYear,
        ssc_percentage: formData.sscPercentage,
        course_type: formData.courseType,
        college_name: formData.collegeName,
        branch: formData.branch,
        year_of_joining: formData.yearOfJoining,
        pin_number: formData.pinNumber,
        diploma_percentage: formData.diplomaPercentage,
        btech_college: formData.btechCollege,
        btech_year: formData.btechYear,
        btech_branch: formData.btechBranch,
        university_name: formData.universityName,
      }]
    );

      if (dbError) {
        console.error('Database insertion error:', dbError);
        // If DB insert fails, we might want to delete the auth user or handle it
        throw new Error('Auth successful but failed to save profile details. Please contact support.');
      }

      console.log('Registration Success:', { authData, trustId: generatedTrustId });
      onSuccess(authData.user.id);
    } catch (error: any) {
      console.error('Signup error:', error);
      alert('Error during signup: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Student Registration</h1>
            <p className="text-slate-400 text-sm">Join the PSS Trust community</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Personal Details Section */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Father's Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Father's name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother's Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      placeholder="Mother's name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all appearance-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="tel" 
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 6 characters"
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea 
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PSS Trust Branch</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      name="trustBranch"
                      value={formData.trustBranch}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all appearance-none"
                    >
                      {TRUST_BRANCHES.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* SSC Details Section */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                SSC Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School Name</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="sscSchool"
                      value={formData.sscSchool}
                      onChange={handleInputChange}
                      placeholder="Enter school name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Board</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="sscBoard"
                      value={formData.sscBoard}
                      onChange={handleInputChange}
                      placeholder="e.g., SSC, CBSE"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Year of Passing</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="number" 
                      name="sscYear"
                      value={formData.sscYear}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SSC Percentage</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      name="sscPercentage"
                      value={formData.sscPercentage}
                      onChange={handleInputChange}
                      placeholder="e.g., 90.0"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Info Section */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Course Type</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      name="courseType"
                      value={formData.courseType}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all appearance-none"
                    >
                      <option value="diploma">Diploma</option>
                      <option value="btech">B.Tech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      placeholder="Enter college name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Branch</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g., CSE, ECE"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Year of Joining</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="number" 
                      name="yearOfJoining"
                      value={formData.yearOfJoining}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                {formData.courseType === 'diploma' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PIN Number</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          name="pinNumber"
                          value={formData.pinNumber}
                          onChange={handleInputChange}
                          placeholder="Enter PIN number"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diploma Percentage</label>
                      <div className="relative">
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="number" 
                          step="0.01"
                          name="diplomaPercentage"
                          value={formData.diplomaPercentage}
                          onChange={handleInputChange}
                          placeholder="e.g., 85.5"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">B.Tech Details</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">B.Tech College</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          name="btechCollege"
                          value={formData.btechCollege}
                          onChange={handleInputChange}
                          placeholder="B.Tech college name"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Year</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select 
                          name="btechYear"
                          value={formData.btechYear}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all appearance-none"
                        >
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">B.Tech Branch</label>
                      <div className="relative">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          name="btechBranch"
                          value={formData.btechBranch}
                          onChange={handleInputChange}
                          placeholder="e.g., CSE, IT"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">University Name (Optional)</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          name="universityName"
                          value={formData.universityName}
                          onChange={handleInputChange}
                          placeholder="Enter university name"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Register & Continue to Face Setup</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
