import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Select } from '@/components/common/Input';
import { User, Mail, Lock, Phone, MapPin, UserPlus, Leaf, CheckCircle } from 'lucide-react';

const roles = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'authority', label: 'Municipal Authority' },
  { value: 'organization', label: 'Organization' },
];

const benefits = [
  'Report waste with AI-powered validation',
  'Track your civic impact and earn badges',
  'Join community cleanup campaigns',
  'Access real-time city cleanliness data',
  'Connect with municipal authorities directly',
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'citizen', city: 'Bangalore', ward: 'W-14' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.phone) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords don\'t match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    const result = await signup(form);
    setLoading(false);
    if (result.success) {
      const paths = { citizen: '/citizen', authority: '/authority', admin: '/admin', organization: '/organization' };
      navigate(paths[result.user.role] || '/citizen');
    }
  };

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-center p-10"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]">CivicLens</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Join the movement for <span className="text-gradient">civic accountability</span>
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          Create your free account and start making a difference in your city today.
        </p>
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <CheckCircle size={16} className="text-civic-500 flex-shrink-0" />
              <span className="text-sm text-[var(--text-secondary)]">{b}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right: Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <form onSubmit={handleSubmit} className="brutal-auth-form">
          <div className="brutal-auth-title" style={{ marginBottom: '15px' }}>
            Welcome,<br /><span>sign up to continue</span>
          </div>
          <p className="text-sm text-[#666] font-medium w-full text-left mb-2">Step {step} of 2</p>

          {step === 1 && (
            <>
              <input type="text" placeholder="Full Name" className="brutal-auth-input" value={form.name} onChange={e => update('name', e.target.value)} required />
              {errors.name && <p className="text-xs text-danger-500 font-medium">{errors.name}</p>}
              
              <input type="email" placeholder="Email" className="brutal-auth-input" value={form.email} onChange={e => update('email', e.target.value)} required />
              {errors.email && <p className="text-xs text-danger-500 font-medium">{errors.email}</p>}
              
              <input type="tel" placeholder="Phone" className="brutal-auth-input" value={form.phone} onChange={e => update('phone', e.target.value)} required />
              {errors.phone && <p className="text-xs text-danger-500 font-medium">{errors.phone}</p>}
              
              <select className="brutal-auth-input" value={form.role} onChange={e => update('role', e.target.value)}>
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              
              <button type="button" className="brutal-auth-button-confirm" onClick={handleNext}>
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input type="password" placeholder="Password" className="brutal-auth-input" value={form.password} onChange={e => update('password', e.target.value)} required />
              {errors.password && <p className="text-xs text-danger-500 font-medium">{errors.password}</p>}
              
              <input type="password" placeholder="Confirm Password" className="brutal-auth-input" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
              {errors.confirmPassword && <p className="text-xs text-danger-500 font-medium">{errors.confirmPassword}</p>}
              
              <input type="text" placeholder="City" className="brutal-auth-input" value={form.city} onChange={e => update('city', e.target.value)} />
              
              <label className="flex items-start gap-2 text-sm text-[#323232] font-semibold w-full mt-2">
                <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#323232]" />
                <span>I agree to Terms & Conditions</span>
              </label>

              <div className="flex w-full gap-4 mt-4">
                <button type="button" className="brutal-auth-button-confirm" style={{ margin: '0', background: 'transparent' }} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="brutal-auth-button-confirm" style={{ margin: '0' }} disabled={loading}>
                  {loading ? 'Wait...' : 'Create Account'}
                </button>
              </div>

              <div className="brutal-auth-login-with" style={{ marginTop: '20px' }}>
                <div className="brutal-auth-button-log"></div>
                <div className="brutal-auth-button-log">
                  <svg className="brutal-auth-icon" height="56.6934px" id="Layer_1" style={{ enableBackground: "new 0 0 56.6934 56.6934" }} version="1.1" viewBox="0 0 56.6934 56.6934" width="56.6934px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017 c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139 c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649 c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805 c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294 c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196 c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372 C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836 C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078 c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138 C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"></path>
                  </svg>
                </div>
                <div className="brutal-auth-button-log">
                  <svg className="brutal-auth-icon" height="56.693px" id="Layer_1" version="1.1" viewBox="0 0 56.693 56.693" width="56.693px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <path d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029 c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77 L40.43,21.739z"></path>
                  </svg>
                </div>
              </div>
            </>
          )}

          <div className="w-full text-center mt-4 border-t border-[#323232] pt-4">
            <p className="text-sm text-[#666] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#323232] underline hover:text-[#2d8cf0]">Sign in</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
