import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import StatusChip from '@/components/common/StatusChip';
import { MOCK_REPORTS, WASTE_CATEGORIES } from '@/data/mockData';
import {
  Search, Filter, Clock, MapPin, AlertTriangle, CheckCircle,
  Calendar, ChevronDown, X, Layers, List, SlidersHorizontal,
  RefreshCw, TrendingUp, Eye
} from 'lucide-react';

// ─── Extended mock data with date-spread ─────────────────────────────
const TODAY = new Date('2026-04-09T00:00:00Z');

function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const ALL_REPORTS = [
  ...MOCK_REPORTS,
  // Reports spread across time windows for filter demo
  { id: 'CLR-2026-021', citizen_id: '22', citizen_name: 'Kavya S.', address: 'W-14', city: 'Bangalore', image_url: '', category: 'plastic_waste', severity: 'HIGH', status: 'pending', description: 'Plastic heap near school gate', gps_lat: 12.9701, gps_lng: 77.5914, created_at: daysAgo(1), resolved_at: null },
  { id: 'CLR-2026-022', citizen_id: '23', citizen_name: 'Manoj K.', address: 'W-16', city: 'Bangalore', image_url: '', category: 'wet_waste', severity: 'MEDIUM', status: 'resolved', description: 'Food waste behind market stalls', gps_lat: 12.9672, gps_lng: 77.6035, created_at: daysAgo(2), resolved_at: daysAgo(1) },
  { id: 'CLR-2026-023', citizen_id: '24', citizen_name: 'Sheela R.', address: 'W-18', city: 'Bangalore', image_url: '', category: 'e_waste', severity: 'LOW', status: 'pending', description: 'Broken electronics near compound wall', gps_lat: 12.9525, gps_lng: 77.5845, created_at: daysAgo(3), resolved_at: null },
  { id: 'CLR-2026-024', citizen_id: '25', citizen_name: 'Rajan V.', address: 'W-22', city: 'Bangalore', image_url: '', category: 'construction_debris', severity: 'HIGH', status: 'overdue', description: 'Construction rubble blocking road', gps_lat: 12.9462, gps_lng: 77.6195, created_at: daysAgo(10), resolved_at: null },
  { id: 'CLR-2026-025', citizen_id: '26', citizen_name: 'Asha M.', address: 'W-14', city: 'Bangalore', image_url: '', category: 'mixed_waste', severity: 'MEDIUM', status: 'resolved', description: 'Mixed household garbage at lane end', gps_lat: 12.9718, gps_lng: 77.5952, created_at: daysAgo(15), resolved_at: daysAgo(14) },
  { id: 'CLR-2026-026', citizen_id: '27', citizen_name: 'Farhan A.', address: 'W-12', city: 'Bangalore', image_url: '', category: 'hazardous_waste', severity: 'CRITICAL', status: 'escalated', description: 'Chemical barrels dumped near water source', gps_lat: 12.9595, gps_lng: 77.6075, created_at: daysAgo(20), resolved_at: null },
  { id: 'CLR-2026-027', citizen_id: '28', citizen_name: 'Bhavna T.', address: 'W-16', city: 'Bangalore', image_url: '', category: 'plastic_waste', severity: 'LOW', status: 'resolved', description: 'Plastic bottles scattered near park', gps_lat: 12.9655, gps_lng: 77.6012, created_at: daysAgo(45), resolved_at: daysAgo(44) },
  { id: 'CLR-2026-028', citizen_id: '29', citizen_name: 'Srinath G.', address: 'W-18', city: 'Bangalore', image_url: '', category: 'biomedical_waste', severity: 'CRITICAL', status: 'pending', description: 'Medical sharps near footpath', gps_lat: 12.9535, gps_lng: 77.5835, created_at: daysAgo(60), resolved_at: null },
  { id: 'CLR-2026-029', citizen_id: '30', citizen_name: 'Padma S.', address: 'W-22', city: 'Bangalore', image_url: '', category: 'dry_waste', severity: 'LOW', status: 'resolved', description: 'Paper and cardboard waste at corner', gps_lat: 12.9478, gps_lng: 77.6172, created_at: daysAgo(75), resolved_at: daysAgo(74) },
  { id: 'CLR-2026-030', citizen_id: '31', citizen_name: 'Gopal N.', address: 'W-14', city: 'Bangalore', image_url: '', category: 'wet_waste', severity: 'HIGH', status: 'pending', description: 'Rotting vegetables near market lane', gps_lat: 12.9708, gps_lng: 77.5924, created_at: daysAgo(0), resolved_at: null },
];

// ─── Time range config ────────────────────────────────────────────────
const TIME_RANGES = [
  { key: 'today',    label: 'Today',         days: 0,   short: 'Today' },
  { key: 'week',     label: 'This Week',     days: 7,   short: '7D' },
  { key: 'month',    label: 'This Month',    days: 30,  short: '30D' },
  { key: '3months',  label: 'Last 3 Months', days: 90,  short: '3M' },
  { key: '6months',  label: 'Last 6 Months', days: 180, short: '6M' },
  { key: 'all',      label: 'All Time',      days: Infinity, short: 'All' },
];

const STATUS_FILTERS = ['all', 'pending', 'in-progress', 'overdue', 'escalated', 'resolved'];

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
};

// ─── Map auto-fit helper ──────────────────────────────────────────────
function MapFit({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length === 0) return;
    const bounds = reports.map(r => [r.gps_lat, r.gps_lng]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [reports, map]);
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function isResolved(report) {
  return report.status === 'resolved';
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = TODAY;
  const diffMs = now - date;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffD === 0) return diffH === 0 ? 'Just now' : `${diffH}h ago`;
  if (diffD === 1) return '1 day ago';
  if (diffD < 30) return `${diffD}d ago`;
  const diffM = Math.floor(diffD / 30);
  return diffM === 1 ? '1 month ago' : `${diffM} months ago`;
}

function getStatusColor(status) {
  const map = {
    pending: '#f59e0b',
    'in-progress': '#3b82f6',
    overdue: '#ef4444',
    escalated: '#ec4899',
    resolved: '#22c55e',
  };
  return map[status] || '#94a3b8';
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ReportQueue() {
  const [timeRange, setTimeRange]       = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters]   = useState(false);
  const listRef = useRef(null);
  const reportRefs = useRef({});

  // ── Filter logic ──────────────────────────────────────────────────
  const filtered = ALL_REPORTS.filter(r => {
    // Time range
    const range = TIME_RANGES.find(t => t.key === timeRange);
    if (range && range.days !== Infinity) {
      const age = (TODAY - new Date(r.created_at)) / 86400000;
      if (range.key === 'today') {
        if (Math.floor(age) > 0) return false;
      } else {
        if (age > range.days) return false;
      }
    }
    // Status
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    // Category
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    // Severity
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.id.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q) &&
          !r.citizen_name.toLowerCase().includes(q) &&
          !r.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const pendingCount  = filtered.filter(r => !isResolved(r)).length;
  const resolvedCount = filtered.filter(r => isResolved(r)).length;

  // ── Map marker click → scroll list ───────────────────────────────
  const handleMarkerClick = useCallback((report) => {
    setSelectedReport(report.id);
    setTimeout(() => {
      const el = reportRefs.current[report.id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-[var(--border-subtle)]"
           style={{ background: 'var(--bg-glass-strong)', backdropFilter: 'blur(16px)' }}>

        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Layers size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)] leading-tight">Report Queue</h1>
              <p className="text-xs text-[var(--text-tertiary)]">
                <span className="text-red-400 font-semibold">{pendingCount} pending</span>
                <span className="mx-1.5 text-[var(--border-subtle)]">·</span>
                <span className="text-green-500 font-semibold">{resolvedCount} resolved</span>
                <span className="mx-1.5 text-[var(--border-subtle)]">·</span>
                {filtered.length} total
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports…"
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)]
                           bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                           focus:outline-none focus:border-civic-500 w-48 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                         border ${showFilters
                           ? 'bg-civic-500 text-white border-civic-500'
                           : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-civic-500'}`}
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>
        </div>

        {/* Time range tabs */}
        <div className="flex items-center gap-1.5">
          {TIME_RANGES.map(t => (
            <button
              key={t.key}
              onClick={() => setTimeRange(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                timeRange === t.key
                  ? 'bg-civic-500 text-white shadow-md shadow-civic-500/30'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 flex flex-wrap gap-4">
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">Status:</span>
                  {STATUS_FILTERS.map(s => (
                    <button key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-all ${
                        statusFilter === s ? 'bg-ocean-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}>
                      {s === 'all' ? 'All' : s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                {/* Severity */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">Severity:</span>
                  {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                    <button key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                        severityFilter === sev ? 'text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                      style={severityFilter === sev && sev !== 'all' ? { background: SEVERITY_COLORS[sev] } : severityFilter === sev ? { background: '#64748b', color: '#fff' } : {}}
                    >
                      {sev === 'all' ? 'All' : sev}
                    </button>
                  ))}
                </div>
                {/* Category */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">Category:</span>
                  <button onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === 'all' ? 'bg-teal-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}>All</button>
                  {Object.entries(WASTE_CATEGORIES).map(([key, val]) => (
                    <button key={key}
                      onClick={() => setCategoryFilter(key)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                        categoryFilter === key ? 'bg-teal-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}>
                      <span>{val.icon}</span>{val.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body: Map (3/4) + List (1/4) ────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── MAP (75%) ─────────────────────────────────────────── */}
        <div className="relative" style={{ width: '75%', flexShrink: 0 }}>
          <MapContainer
            center={[12.9650, 77.6000]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />
            <MapFit reports={filtered} />

            {filtered.map(report => {
              const resolved = isResolved(report);
              const isSelected = selectedReport === report.id;
              const color = resolved ? '#22c55e' : '#ef4444';
              const radius = isSelected ? 14 : report.severity === 'CRITICAL' ? 11 : report.severity === 'HIGH' ? 9 : 7;

              return (
                <CircleMarker
                  key={report.id}
                  center={[report.gps_lat, report.gps_lng]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: resolved ? 0.7 : 0.9,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{ click: () => handleMarkerClick(report) }}
                >
                  <Popup className="leaflet-custom-popup">
                    <div className="text-xs min-w-[200px]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-semibold text-gray-400 text-[10px]">{report.id}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{resolved ? 'RESOLVED' : report.status.toUpperCase()}</span>
                      </div>
                      <p className="text-gray-700 mb-1 font-medium leading-tight">{report.description}</p>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span>{WASTE_CATEGORIES[report.category]?.icon}</span>
                        <span>{WASTE_CATEGORIES[report.category]?.label}</span>
                        <span>·</span>
                        <span className="font-bold" style={{ color: SEVERITY_COLORS[report.severity] }}>{report.severity}</span>
                      </div>
                      <p className="text-gray-400 mt-1">{report.citizen_name} · {report.address}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Map legend overlay */}
          <div className="absolute bottom-6 left-4 z-[1000] glass-card p-3 rounded-xl text-xs space-y-1.5">
            <p className="font-semibold text-[var(--text-secondary)] mb-2 text-[11px] uppercase tracking-wider">Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
              <span className="text-[var(--text-secondary)]">Pending / Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-md shadow-green-500/50" />
              <span className="text-[var(--text-secondary)]">Resolved</span>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-1.5 mt-1.5 space-y-1">
              <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Dot size = severity</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <span className="text-[var(--text-tertiary)]">Critical / High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400 opacity-60" />
                <span className="text-[var(--text-tertiary)]">Medium / Low</span>
              </div>
            </div>
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            <div className="glass-card px-3 py-2 rounded-xl text-center">
              <div className="text-lg font-bold text-red-400 leading-none">{pendingCount}</div>
              <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Pending</div>
            </div>
            <div className="glass-card px-3 py-2 rounded-xl text-center">
              <div className="text-lg font-bold text-green-400 leading-none">{resolvedCount}</div>
              <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Resolved</div>
            </div>
          </div>
        </div>

        {/* ── REPORT LIST (25%) ─────────────────────────────────── */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto border-l border-[var(--border-subtle)]"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* List header */}
          <div className="sticky top-0 z-10 px-3 py-2.5 border-b border-[var(--border-subtle)]"
               style={{ background: 'var(--bg-glass-strong)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2">
              <List size={14} className="text-[var(--text-tertiary)]" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">Reports</span>
              <span className="ml-auto text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                <Filter size={20} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">No reports found</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filtered.map((report) => {
                const resolved = isResolved(report);
                const isSelected = selectedReport === report.id;
                const cat = WASTE_CATEGORIES[report.category];

                return (
                  <motion.div
                    key={report.id}
                    ref={el => { reportRefs.current[report.id] = el; }}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedReport(isSelected ? null : report.id)}
                    className={`rounded-xl p-3 cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-civic-500 bg-civic-500/5 shadow-md shadow-civic-500/10'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--text-tertiary)]'
                    }`}
                  >
                    {/* Report header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        {/* Status indicator dot */}
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                          style={{
                            background: resolved ? '#22c55e' : '#ef4444',
                            boxShadow: `0 0 6px ${resolved ? '#22c55e80' : '#ef444480'}`
                          }}
                        />
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] font-semibold">{report.id}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${SEVERITY_COLORS[report.severity]}20`,
                          color: SEVERITY_COLORS[report.severity]
                        }}
                      >
                        {report.severity}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-primary)] font-medium leading-snug mb-2 line-clamp-2">
                      {report.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <span className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>{cat?.icon}</span>{cat?.label}
                      </span>
                      <span className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin size={9} />{report.address}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <StatusChip status={report.status} size="sm" />
                      <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                        <Clock size={9} />
                        {formatRelativeTime(report.created_at)}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                              <Eye size={10} />
                              <span className="font-medium">Reporter:</span>
                              <span>{report.citizen_name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                              <MapPin size={10} />
                              <span className="font-medium">GPS:</span>
                              <span>{report.gps_lat.toFixed(4)}, {report.gps_lng.toFixed(4)}</span>
                            </div>
                            {report.resolved_at && (
                              <div className="flex items-center gap-1 text-[10px] text-green-500">
                                <CheckCircle size={10} />
                                <span className="font-medium">Resolved:</span>
                                <span>{formatRelativeTime(report.resolved_at)}</span>
                              </div>
                            )}
                            <div className="flex gap-1.5 mt-2">
                              <button className="flex-1 py-1 text-[10px] font-semibold rounded-lg bg-civic-500 text-white">
                                Assign
                              </button>
                              {!resolved && (
                                <button className="flex-1 py-1 text-[10px] font-semibold rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                                  Resolve
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
