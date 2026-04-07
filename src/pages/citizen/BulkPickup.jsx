import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Select } from '@/components/common/Input';
import { Truck, Calendar, Package, CheckCircle, MapPin } from 'lucide-react';

const wasteTypes = [
  { value: 'furniture', label: '🪑 Furniture & Large Items' },
  { value: 'construction', label: '🧱 Construction Debris' },
  { value: 'medical', label: '🏥 Home Medical Waste' },
  { value: 'garden', label: '🌳 Garden Waste (Large)' },
  { value: 'appliances', label: '🔌 Old Appliances' },
];

export default function BulkPickup() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ type: 'furniture', quantity: '', date: '', time: '09:00-12:00', location: 'Koramangala 4th Block, Bangalore' });

  if (submitted) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto mt-12">
          <Card className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
              <div className="w-16 h-16 rounded-full bg-civic-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-civic-500" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Pickup Scheduled!</h2>
            <p className="text-[var(--text-secondary)] mb-6">Your bulk waste pickup has been confirmed. Our team will arrive on the scheduled date.</p>
            <Button variant="primary" onClick={() => setSubmitted(false)}>Schedule Another</Button>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-ocean-500 flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Schedule Bulk Pickup</h1>
            <p className="text-[var(--text-secondary)]">Request pickup for large waste items</p>
          </div>
        </div>
        <Card className="p-6">
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            <Select label="Waste Type" options={wasteTypes} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} icon={Package} />
            <Input label="Quantity Estimate" placeholder="e.g., 2 sofas, 5 boxes of debris" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <Input label="Preferred Pickup Date" type="date" icon={Calendar} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <Select label="Time Slot" options={[{ value: '09:00-12:00', label: '9:00 AM - 12:00 PM' }, { value: '14:00-17:00', label: '2:00 PM - 5:00 PM' }]} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            <Input label="Pickup Location" icon={MapPin} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <Button type="submit" variant="primary" size="lg" className="w-full" icon={Truck}>Schedule Pickup</Button>
          </form>
        </Card>
      </div>
    </PageWrapper>
  );
}
