import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Select } from '@/components/common/Input';
import { Mail, Lock, LogIn, Leaf, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';

const roles = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'authority', label: 'Municipal Authority' },
  { value: 'organization', label: 'Organization' },
  { value: 'admin', label: 'Administrator' },
];

const features = [
  { icon: Shield, text: 'AI-verified waste reporting' },
  { icon: Users, text: 'Role-based civic dashboards' },
  { icon: BarChart3, text: 'Real-time analytics & heatmaps' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      const paths = { citizen: '/citizen', authority: '/authority', admin: '/admin', organization: '/organization' };
      navigate(paths[result.user.role] || '/citizen');
    } else {
      setError('Invalid credentials. Try: citizen@civic.lens / authority@civic.lens / admin@civic.lens / org@civic.lens');
    }
  };

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
      {/* Left: Feature Panel */}
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
          Welcome back to <span className="text-gradient">cleaner cities</span>
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          Log in to your dashboard. Report waste, track resolutions, check your impact score, and stay connected to your city's cleanliness.
        </p>
        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-civic-500/10 flex items-center justify-center">
                <f.icon size={16} className="text-civic-500" />
              </div>
              <span className="text-sm text-[var(--text-secondary)]">{f.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <form onSubmit={handleSubmit} className="brutal-auth-form">
          <div className="brutal-auth-title">
            Welcome,<br /><span>sign in to continue</span>
          </div>

          <input
            type="email"
            placeholder="Email (e.g. citizen@civic.lens)"
            name="email"
            className="brutal-auth-input"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="brutal-auth-input"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <p className="text-sm text-danger-500 w-full text-center font-medium bg-danger-50 p-2 rounded border border-danger-500">
              {error}
            </p>
          )}

          <div className="brutal-auth-login-with">
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

          <button type="submit" className="brutal-auth-button-confirm" disabled={loading}>
            {loading ? 'Wait...' : 'Let`s go →'}
          </button>
          
          <div className="w-full text-center mt-4 border-t border-[#323232] pt-4">
            <p className="text-sm text-[#666] font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#323232] underline hover:text-[#2d8cf0]">Sign up</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
