import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { TextArea, Select } from '@/components/common/Input';
import Card from '@/components/common/Card';
import { WASTE_CATEGORIES } from '@/data/mockData';
import {
  Camera, Upload, MapPin, Scan, CheckCircle, AlertCircle,
  Loader2, X, Image as ImageIcon, ArrowRight, ArrowLeft
} from 'lucide-react';

const severityOptions = [
  { value: 'LOW', label: 'Low — Small isolated item' },
  { value: 'MEDIUM', label: 'Medium — Pile or accumulation' },
  { value: 'HIGH', label: 'High — Large dumping, drain blockage' },
  { value: 'CRITICAL', label: 'Critical — Hazardous, biomedical, fire risk' },
];

const categoryOptions = Object.entries(WASTE_CATEGORIES).map(([key, val]) => ({ value: key, label: `${val.icon} ${val.label}` }));

export default function ReportWaste() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = upload, 2 = AI validation, 3 = details, 4 = confirm
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [form, setForm] = useState({ category: 'plastic_waste', severity: 'MEDIUM', description: '', location: 'Koramangala 4th Block, Bangalore' });
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setStep(2);
      simulateValidation();
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setStep(2);
      simulateValidation();
    }
  }, []);

  const simulateValidation = () => {
    setValidating(true);
    setTimeout(() => {
      setValidation({
        waste_detected: true,
        valid: true,
        category: 'plastic_waste',
        object: 'Plastic bags and PET bottles',
        severity: 'MEDIUM',
        confidence: 'High',
        reason: 'Clear presence of plastic waste including bags and bottles accumulated near a public area.',
        department: 'Solid Waste Management',
      });
      setValidating(false);
      setForm(prev => ({ ...prev, category: 'plastic_waste', severity: 'MEDIUM' }));
    }, 3000);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setStep(4);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Report Waste</h1>
        <p className="text-[var(--text-secondary)]">Upload a photo, let AI validate it, and file your report</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 max-w-lg">
        {['Upload', 'Validate', 'Details', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step > i + 1 ? 'bg-civic-500 text-white' :
              step === i + 1 ? 'bg-civic-500 text-white' :
              'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
            }`}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= i + 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 rounded-full ${step > i + 1 ? 'bg-civic-500' : 'bg-[var(--bg-tertiary)]'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="p-8 max-w-2xl">
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[var(--border-subtle)] hover:border-civic-500/50 rounded-2xl p-12 text-center transition-colors cursor-pointer"
              >
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" id="waste-image" />
                <label htmlFor="waste-image" className="cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-civic-500/10 flex items-center justify-center mx-auto mb-4">
                    <Camera size={28} className="text-civic-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Upload Waste Photo</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Take a photo or drag and drop an image of the waste
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="primary" size="md" icon={Camera}>Take Photo</Button>
                    <Button variant="outline" size="md" icon={Upload}>Upload File</Button>
                  </div>
                </label>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-4 text-center">
                Supported formats: JPG, PNG, HEIF · Max size: 10MB · GPS location will be auto-tagged
              </p>
            </Card>
          </motion.div>
        )}

        {/* Step 2: AI Validation */}
        {step === 2 && (
          <motion.div key="validate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {/* Image Preview */}
              <Card className="p-4 overflow-hidden">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[var(--bg-tertiary)]">
                    <img src={imagePreview} alt="Uploaded waste" className="w-full h-full object-cover" />
                    <button onClick={() => { setStep(1); setImage(null); setImagePreview(null); setValidation(null); }} className="absolute top-2 right-2 w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-danger-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center">
                    <ImageIcon size={48} className="text-[var(--text-tertiary)]" />
                  </div>
                )}
              </Card>

              {/* Validation Result */}
              <Card className="p-6">
                {validating ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-civic-500/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-civic-500 animate-spin" />
                      <div className="absolute inset-2 rounded-full bg-civic-500/10 flex items-center justify-center">
                        <Scan size={20} className="text-civic-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">AI Analyzing Image</h3>
                    <p className="text-sm text-[var(--text-secondary)] text-center">Detecting waste, classifying type, and assessing severity...</p>
                  </div>
                ) : validation ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle size={20} className="text-civic-500" />
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Waste Detected</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        ['Category', WASTE_CATEGORIES[validation.category]?.label],
                        ['Object', validation.object],
                        ['Severity', validation.severity],
                        ['Confidence', validation.confidence],
                        ['Department', validation.department],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                          <span className="text-[var(--text-secondary)]">{label}</span>
                          <span className="font-medium text-[var(--text-primary)]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] italic bg-[var(--bg-tertiary)] p-3 rounded-xl">
                      "{validation.reason}"
                    </p>
                    <Button variant="primary" size="lg" className="w-full mt-4" onClick={() => setStep(3)} iconRight={ArrowRight}>
                      Continue to Report Details
                    </Button>
                  </div>
                ) : null}
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="p-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Report Details</h3>
              <div className="space-y-5">
                <Select label="Waste Category" options={categoryOptions} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                <Select label="Severity" options={severityOptions} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} />
                <Input label="Location" icon={MapPin} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                <TextArea label="Description (Optional)" placeholder="Add any additional details about the waste..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" size="lg" onClick={() => setStep(2)} icon={ArrowLeft}>Back</Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit} loading={submitting} icon={CheckCircle}>
                    Submit Report
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-8 max-w-lg mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 rounded-full bg-civic-500/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-civic-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Report Submitted!</h2>
              <p className="text-[var(--text-secondary)] mb-4">Your waste report has been filed and sent to the responsible authority.</p>
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Report ID</span><span className="font-mono font-semibold text-civic-600 dark:text-civic-400">CLR-2024-009</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Category</span><span className="font-medium">{WASTE_CATEGORIES[form.category]?.label}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Status</span><span className="font-medium text-warning-500">Pending</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" className="flex-1" onClick={() => navigate('/citizen/reports')}>
                  View My Reports
                </Button>
                <Button variant="primary" size="md" className="flex-1" onClick={() => { setStep(1); setImage(null); setImagePreview(null); setValidation(null); }}>
                  Report Another
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
