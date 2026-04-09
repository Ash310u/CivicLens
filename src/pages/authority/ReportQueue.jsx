import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import StatusChip from '@/components/common/StatusChip';
import { WASTE_CATEGORIES } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import { useGetReportsQuery } from '@/store/api/reportsApi';
import {
  Search, Filter, Clock, MapPin, CheckCircle,
  Layers, List, SlidersHorizontal, RefreshCw, Eye
} from 'lucide-react';

// ─── Time range config ────────────────────────────────────────────────
const TIME_RANGES = [
  { key: 'today', label: 'Today', days: 0, short: 'Today' },
  { key: 'week', label: 'This Week', days: 7, short: '7D' },
  { key: 'month', label: 'This Month', days: 30, short: '30D' },
  { key: '3months', label: 'Last 3 Months', days: 90, short: '3M' },
  { key: '6months', label: 'Last 6 Months', days: 180, short: '6M' },
  { key: 'all', label: 'All Time', days: Infinity, short: 'All' },
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
  const now = new Date();
  const diffMs = now - date;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffD === 0) return diffH === 0 ? 'Just now' : `${diffH}h ago`;
  if (diffD === 1) return '1 day ago';
  if (diffD < 30) return `${diffD}d ago`;
  const diffM = Math.floor(diffD / 30);
  return diffM === 1 ? '1 month ago' : `${diffM} months ago`;
}

// ─── UI ID formatter ─────────────────────────────────────────────────
function formatDisplayId(address, id) {
  // Strip non-alphanumeric, take first 3-5 uppercase chars from address
  const prefix = (address || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 4)
    .toUpperCase();
  // Take the last segment of the id (e.g. '021' from 'CLR-2026-021', or just the raw id)
  const suffix = String(id).split('-').pop();
  return prefix ? `${prefix}-${suffix}` : String(id);
}

// ─── Address resolver ─────────────────────────────────────────────────
function resolveAddress(report) {
  return (
    report.ward_name ||
    report.location?.address ||
    report.location?.ward ||
    report.address ||
    report.ward_id ||
    report.ward ||
    (report.city ? `${report.city}` : null) ||
    null
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ReportQueue() {
  const { theme } = useTheme();
  const { data: reportsResponse, isLoading, isFetching, isError, refetch } = useGetReportsQuery();
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const listRef = useRef(null);
  const reportRefs = useRef({});


  const reports = useMemo(() => {
    const raw = Array.isArray(reportsResponse)
      ? reportsResponse
      : Array.isArray(reportsResponse?.data)
        ? reportsResponse.data
        : Array.isArray(reportsResponse?.reports)
          ? reportsResponse.reports
          : [];

    return raw.map((report, index) => {
      const rawId = report.id || report._id || `report-${index}`;
      const address = resolveAddress(report) || 'Location N/A';
      return {
        ...report,
        id: rawId,
        address,
        category: report.category || 'mixed_waste',
        severity: report.severity || 'LOW',
        status: report.status || 'pending',
        description: report.description || 'No description provided',
        citizen_name: report.citizen_name || report.reporter_name || report.citizen?.name || 'Anonymous',
        gps_lat: Number(report.gps_lat ?? report.latitude ?? report.location?.lat ?? 12.965),
        gps_lng: Number(report.gps_lng ?? report.longitude ?? report.location?.lng ?? 77.6),
        created_at: report.created_at || report.createdAt || new Date().toISOString(),
        resolved_at: report.resolved_at || report.resolvedAt || null,
      };
    });
  }, [reportsResponse]);

  // ── Filter logic ──────────────────────────────────────────────────
  const filtered = reports.filter(r => {
    // Time range
    const range = TIME_RANGES.find(t => t.key === timeRange);
    if (range && range.days !== Infinity) {
      const age = (new Date() - new Date(r.created_at)) / 86400000;
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

  const pendingCount = filtered.filter(r => !isResolved(r)).length;
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
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

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
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-civic-500"
            >
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Time range tabs */}
        <div className="flex items-center gap-1.5">
          {TIME_RANGES.map(t => (
            <button
              key={t.key}
              onClick={() => setTimeRange(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${timeRange === t.key
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
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-ocean-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
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
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${severityFilter === sev ? 'text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
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
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${categoryFilter === 'all' ? 'bg-teal-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}>All</button>
                  {Object.entries(WASTE_CATEGORIES).map(([key, val]) => (
                    <button key={key}
                      onClick={() => setCategoryFilter(key)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${categoryFilter === key ? 'bg-teal-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
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
              key={theme}
              url={
                theme === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
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
              const categoryMeta = WASTE_CATEGORIES[report.category];

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
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>{resolved ? 'RESOLVED' : report.status.toUpperCase()}</span>
                      </div>
                      <p className="text-gray-700 mb-1 font-medium leading-tight">{report.description}</p>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span>{categoryMeta?.icon || '🗑️'}</span>
                        <span>{categoryMeta?.label || report.category}</span>
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                <RefreshCw size={20} className="text-[var(--text-tertiary)] animate-spin" />
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Loading reports</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Fetching latest queue data...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                <Filter size={20} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Failed to load reports</p>
              <button
                onClick={refetch}
                className="mt-2 px-3 py-1.5 text-xs rounded-lg bg-civic-500 text-white font-medium"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
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
                    className={`rounded-xl p-3 cursor-pointer transition-all border ${isSelected
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
                        <span
                          className="font-mono text-[10px] font-bold tracking-wide"
                          style={{ color: resolved ? '#22c55e' : '#f87171' }}
                          title={`Full ID: ${report.id}`}
                        >
                          {formatDisplayId(report.address, report.id)}
                        </span>
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
