import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Mail, ArrowLeft, Send, CheckCircle, Leaf } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="glass-strong rounded-2xl p-8 shadow-elevated">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
            {sent ? <CheckCircle size={24} className="text-white" /> : <Leaf size={24} className="text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {sent ? 'Check Your Email' : 'Reset Password'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {sent
              ? `We've sent a reset link to ${email}`
              : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} icon={Send}>
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 text-sm text-center">
              A password reset link has been sent. Please check your inbox and spam folder.
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setSent(false)}>
              Resend Email
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-civic-500 hover:text-civic-600 font-medium">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
