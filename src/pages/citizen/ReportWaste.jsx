import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { geocode } from 'opencage-api-client';
import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { TextArea, Select } from '@/components/common/Input';
import Card from '@/components/common/Card';
import { WASTE_CATEGORIES } from '@/data/mockData';
import { ROUTES } from '@/lib/routes';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import { useAuth } from '@/context/AuthContext';
import { useCreateReportMutation } from '@/store/api/reportsApi';

const MotionDiv = motion.div;
import {
  Camera, Upload, MapPin, Scan, CheckCircle, AlertCircle,
  X, Image as ImageIcon, ArrowRight, ArrowLeft,
} from 'lucide-react';

const severityOptions = [
  { value: 'LOW', label: 'Low — Small isolated item' },
  { value: 'MEDIUM', label: 'Medium — Pile or accumulation' },
  { value: 'HIGH', label: 'High — Large dumping, drain blockage' },
  { value: 'CRITICAL', label: 'Critical — Hazardous, biomedical, fire risk' },
];

const categoryOptions = Object.entries(WASTE_CATEGORIES).map(([key, val]) => ({ value: key, label: `${val.icon} ${val.label}` }));

/** Maps UI category keys to POST /api/reports `category` (see API_REPORT_README.md). */
const CATEGORY_TO_API = {
  plastic_waste: 'plastic',
  dry_waste: 'dry',
  wet_waste: 'wet',
  construction_debris: 'construction',
  biomedical_waste: 'biomedical',
  hazardous_waste: 'hazardous',
  e_waste: 'electronic',
  mixed_waste: 'mixed',
  domestic_waste: 'domestic',
};

const OPENCAGE_API_KEY = (import.meta.env.VITE_OPENCAGE_API_KEY || '').trim();

function apiErrorMessage(error, fallback) {
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.error ||
    fallback
  );
}

function mockAiConfidence(validationResult) {
  if (!validationResult?.confidence) return 0.85;
  const c = String(validationResult.confidence).toLowerCase();
  if (c.includes('high')) return 0.91;
  if (c.includes('medium')) return 0.75;
  return 0.65;
}

export default function ReportWaste({ embedded = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createReport] = useCreateReportMutation();
  const [step, setStep] = useState(1); // 1 = upload, 2 = AI validation, 3 = details, 4 = confirm
  const [imagePreview, setImagePreview] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [form, setForm] = useState({ category: 'plastic_waste', severity: 'MEDIUM', description: '', location: 'Koramangala 4th Block, Bangalore' });
  const [submitting, setSubmitting] = useState(false);
  /** Full Cloudinary upload JSON (secure_url, public_id, asset_id, …). */
  const [cloudinaryAsset, setCloudinaryAsset] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [createdReport, setCreatedReport] = useState(null);
  const [validationPhase, setValidationPhase] = useState('idle'); // 'upload' | 'analyze' | 'idle'
  const [locationCoords, setLocationCoords] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const resolveLocationCoordinates = useCallback(
    async (locationText) => {
      const query = (locationText || '').trim();

      if (!query) {
        setLocationCoords(null);
        setLocationError('Location is required.');
        return null;
      }

      if (!OPENCAGE_API_KEY) {
        setLocationError('Geocoding is not configured. Set VITE_OPENCAGE_API_KEY in .env.');
        return null;
      }

      setIsGeocoding(true);
      setLocationError(null);

      try {
        const result = await geocode({
          q: query,
          key: OPENCAGE_API_KEY,
          no_annotations: 1,
          limit: 1,
        });

        const geometry = result?.results?.[0]?.geometry;
        if (!geometry || typeof geometry.lat !== 'number' || typeof geometry.lng !== 'number') {
          setLocationCoords(null);
          setLocationError('Could not find coordinates for this location.');
          return null;
        }

        const coords = { lat: geometry.lat, lng: geometry.lng };
        setLocationCoords(coords);
        return coords;
      } catch (error) {
        setLocationCoords(null);
        setLocationError(error?.message || 'Unable to geocode this location right now.');
        return null;
      } finally {
        setIsGeocoding(false);
      }
    },
    [],
  );

  const runMockValidation = useCallback(() => {
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
    setForm((prev) => ({ ...prev, category: 'plastic_waste', severity: 'MEDIUM' }));
  }, []);

  const processImageFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) return;

      setImagePreview(URL.createObjectURL(file));
      setCloudinaryAsset(null);
      setUploadError(null);
      setSubmitError(null);
      setCreatedReport(null);
      setValidation(null);
      setStep(2);
      setValidating(true);
      setValidationPhase('upload');

      try {
        if (!isCloudinaryConfigured()) {
          throw new Error(
            'Image upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME (and optional VITE_CLOUDINARY_UPLOAD_PRESET) in .env.',
          );
        }
        const asset = await uploadImageToCloudinary(file);
        setCloudinaryAsset(asset);

        setValidationPhase('analyze');
        await new Promise((r) => setTimeout(r, 2500));
        runMockValidation();
      } catch (err) {
        setUploadError(err?.message || 'Could not upload image. Try again.');
      } finally {
        setValidating(false);
        setValidationPhase('idle');
      }
    },
    [runMockValidation],
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
      e.target.value = '';
    },
    [processImageFile],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) processImageFile(file);
    },
    [processImageFile],
  );

  const resetFlow = useCallback(() => {
    setStep(1);
    setImagePreview(null);
    setValidation(null);
    setCloudinaryAsset(null);
    setUploadError(null);
    setSubmitError(null);
    setCreatedReport(null);
    setValidationPhase('idle');
  }, []);

  const handleSubmit = async () => {
    setSubmitError(null);
    const imageUrl = cloudinaryAsset?.secure_url || cloudinaryAsset?.url;
    if (!imageUrl) {
      setSubmitError('Image is missing. Please upload a photo again.');
      return;
    }
    const userId = user?.id != null ? Number(user.id) : NaN;
    if (!Number.isFinite(userId)) {
      setSubmitError('You must be signed in to submit a report.');
      return;
    }

    const coords = locationCoords || (await resolveLocationCoordinates(form.location));
    if (!coords) {
      setSubmitError('Please enter a valid location so we can detect latitude and longitude.');
      return;
    }

    const apiCategory = CATEGORY_TO_API[form.category] || 'mixed';

    const payload = {
      userId,
      imageUrl: String(imageUrl),
      latitude: coords.lat,
      longitude: coords.lng,
      addressText: (form.location || '').trim(),
      description: (form.description || '').trim(),
      category: apiCategory,
      severity: (form.severity || 'MEDIUM').toLowerCase(),
      status: 'pending',
      aiConfidenceScore: mockAiConfidence(validation),
    };

    setSubmitting(true);
    try {
      const result = await createReport(payload).unwrap();
      const saved = result?.data != null && typeof result.data === 'object' ? result.data : result;
      setCreatedReport(saved);
      setStep(4);
    } catch (err) {
      setSubmitError(apiErrorMessage(err, 'Could not submit report. Try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const inner = (
    <>
      {/* Header */}
      <div className={embedded ? 'mb-3' : 'mb-8'}>
        <h1 className={`font-bold text-[var(--text-primary)] mb-0.5 ${embedded ? 'text-lg sm:text-xl' : 'text-2xl'}`}>
          Report Waste
        </h1>
        <p className={`text-[var(--text-secondary)] ${embedded ? 'text-xs sm:text-sm' : ''}`}>
          Upload a photo, let AI validate it, and file your report
        </p>
      </div>

      {/* Progress Steps */}
      <div className={`flex items-center gap-1 sm:gap-2 max-w-lg ${embedded ? 'mb-4' : 'mb-8'}`}>
        {['Upload', 'Validate', 'Details', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step > i + 1 ? 'bg-civic-500 text-white' :
              step === i + 1 ? 'bg-civic-500 text-white' :
              'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
            }`}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-[10px] sm:text-xs font-medium ${embedded ? '' : 'hidden sm:block'} ${step >= i + 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 rounded-full ${step > i + 1 ? 'bg-civic-500' : 'bg-[var(--bg-tertiary)]'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === 1 && (
          <MotionDiv key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className={`max-w-2xl ${embedded ? 'p-4 sm:p-5' : 'p-8'}`}>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed border-[var(--border-subtle)] hover:border-civic-500/50 rounded-2xl text-center transition-colors cursor-pointer ${embedded ? 'p-6 sm:p-8' : 'p-12'}`}
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
          </MotionDiv>
        )}

        {/* Step 2: AI Validation */}
        {step === 2 && (
          <MotionDiv key="validate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={`grid md:grid-cols-2 max-w-4xl ${embedded ? 'gap-3 sm:gap-4' : 'gap-6'}`}>
              {/* Image Preview */}
              <Card className="p-4 overflow-hidden">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[var(--bg-tertiary)]">
                    <img src={imagePreview} alt="Uploaded waste" className="w-full h-full object-cover" />
                    <button onClick={() => { setStep(1); setImagePreview(null); setValidation(null); setCloudinaryAsset(null); setUploadError(null); setSubmitError(null); setCreatedReport(null); setValidationPhase('idle'); }} className="absolute top-2 right-2 w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-danger-500 transition-colors">
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
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {validationPhase === 'upload' ? 'Uploading photo…' : 'AI Analyzing Image'}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] text-center px-2">
                      {validationPhase === 'upload'
                        ? 'Sending your image securely to Cloudinary…'
                        : 'Detecting waste, classifying type, and assessing severity…'}
                    </p>
                  </div>
                ) : uploadError ? (
                  <div className="flex flex-col items-stretch justify-center h-full py-8 px-1">
                    <div className="flex items-center gap-2 mb-3 text-danger-600 dark:text-danger-400">
                      <AlertCircle size={22} className="shrink-0" />
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Upload failed</h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">{uploadError}</p>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setStep(1);
                        setImagePreview(null);
                        setValidation(null);
                        setCloudinaryAsset(null);
                        setUploadError(null);
                        setSubmitError(null);
                        setCreatedReport(null);
                        setValidationPhase('idle');
                      }}
                    >
                      Choose another photo
                    </Button>
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
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full mt-4"
                      onClick={() => {
                        if (!cloudinaryAsset?.secure_url && !cloudinaryAsset?.url) return;
                        setSubmitError(null);
                        setStep(3);
                      }}
                      iconRight={ArrowRight}
                    >
                      Continue to Report Details
                    </Button>
                  </div>
                ) : null}
              </Card>
            </div>
          </MotionDiv>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <MotionDiv key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className={`max-w-2xl ${embedded ? 'p-4 sm:p-5' : 'p-6'}`}>
              <h3 className={`font-semibold text-[var(--text-primary)] ${embedded ? 'text-base mb-4' : 'text-lg mb-6'}`}>Report Details</h3>
              <div className="space-y-5">
                {submitError ? (
                  <p className="text-sm text-danger-600 dark:text-danger-400 font-medium bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 rounded-xl px-3 py-2">
                    {submitError}
                  </p>
                ) : null}
                <Select label="Waste Category" options={categoryOptions} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                <Select label="Severity" options={severityOptions} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} />
                <Input
                  label="Location"
                  icon={MapPin}
                  value={form.location}
                  onChange={e => {
                    setForm({ ...form, location: e.target.value });
                    setLocationCoords(null);
                    setLocationError(null);
                  }}
                  onBlur={e => {
                    void resolveLocationCoordinates(e.target.value);
                  }}
                  helper={
                    locationError
                      ? locationError
                      : isGeocoding
                        ? 'Resolving location coordinates...'
                        : locationCoords
                          ? `Coordinates: ${locationCoords.lat.toFixed(5)}, ${locationCoords.lng.toFixed(5)}`
                          : 'Enter an address/place name and click outside to fetch lat/lng.'
                  }
                  error={locationError || undefined}
                />
                <TextArea label="Description (Optional)" placeholder="Add any additional details about the waste..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" size="lg" onClick={() => { setSubmitError(null); setStep(2); }} icon={ArrowLeft}>Back</Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit} loading={submitting} icon={CheckCircle}>
                    Submit Report
                  </Button>
                </div>
              </div>
            </Card>
          </MotionDiv>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <MotionDiv key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-8 max-w-lg mx-auto text-center">
              <MotionDiv
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 rounded-full bg-civic-500/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-civic-500" />
              </MotionDiv>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Report Submitted!</h2>
              <p className="text-[var(--text-secondary)] mb-4">Your waste report has been filed and sent to the responsible authority.</p>
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-secondary)] shrink-0">Report ID</span>
                  <span className="font-mono font-semibold text-civic-600 dark:text-civic-400 text-right break-all">
                    {createdReport?.id != null
                      ? String(createdReport.id)
                      : createdReport?.reportId != null
                        ? String(createdReport.reportId)
                        : '—'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Category</span><span className="font-medium">{WASTE_CATEGORIES[form.category]?.label}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Status</span><span className="font-medium text-warning-500">Pending</span></div>
                {cloudinaryAsset?.secure_url || cloudinaryAsset?.url ? (
                  <div className="flex justify-between gap-2 items-start pt-1 border-t border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)] shrink-0">Photo</span>
                    <span className="font-medium text-civic-600 dark:text-civic-400 text-right break-all text-xs line-clamp-2" title={cloudinaryAsset.secure_url || cloudinaryAsset.url}>
                      Saved
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => navigate(`${ROUTES.citizen.home}#my-reports`)}
                >
                  View My Reports
                </Button>
                <Button variant="primary" size="md" className="flex-1" onClick={resetFlow}>
                  Report Another
                </Button>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );

  return embedded ? inner : <PageWrapper>{inner}</PageWrapper>;
}
