"use client";

import { useState, useEffect, useCallback, useRef, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Footer } from '@/components/Footer';
import { HoverBorderGradient } from '@/components/HoverBorderGradient';
import BorderGlow from '@/components/BorderGlow';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Search, Filter, RefreshCcw, Loader2, ChevronLeft, ChevronRight, AlertCircle, TrendingUp, X } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [activeLead, setActiveLead] = useState<Lead | boolean | null>(null);
  const activeId = useId();
  const activeRef = useRef<HTMLDivElement>(null);

  useOutsideClick(filterRef, () => setFilterOpen(false));
  useOutsideClick(activeRef, () => setActiveLead(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveLead(null);
      }
    }
    if (activeLead && typeof activeLead === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeLead]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [newLeadsToday, setNewLeadsToday] = useState(0);

  // Errors
  const [errorMsg, setErrorMsg] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: statusFilter,
        page: page.toString(),
        limit: '10'
      });

      const res = await fetch(`${apiUrl}/api/leads?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
        setNewLeadsToday(data.stats.newLeadsToday);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Save original in case we need to rollback
    const originalLeads = [...leads];
    
    // Optimistic update
    setLeads((prev: Lead[]) =>
      prev.map((lead: Lead) => (lead.id === id ? { ...lead, status: newStatus as Lead['status'] } : lead))
    );
    if (activeLead && typeof activeLead === 'object' && activeLead.id === id) {
      setActiveLead({ ...activeLead, status: newStatus as Lead['status'] });
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Status update failed');
      
      setErrorMsg(''); // Clear error on success
    } catch (error) {
      console.error('Failed to update status:', error);
      // Rollback
      setLeads(originalLeads);
      setErrorMsg('Failed to update status. Please try again.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-800 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white flex items-center gap-4">
          <div>LeadDesk <span className="text-blue-400">Mini</span> Admin</div>
          <div className="hidden sm:flex items-center text-xs font-medium px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1.5" />
            {newLeadsToday} New Today
          </div>
        </h1>
        <HoverBorderGradient
          onClick={fetchLeads}
          containerClassName="rounded-full"
          className="bg-zinc-900 text-zinc-400 hover:text-white px-3 py-3"
          title="Refresh Data"
        >
          <RefreshCcw className="w-5 h-5" />
        </HoverBorderGradient>
      </header>

      <main className="flex-grow p-6 md:px-12 max-w-7xl mx-auto w-full relative">
        {/* Toast Error Message */}
        {errorMsg && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 px-4 py-3 bg-red-500/90 text-white rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Modal rendered outside of backdrop-blur containers */}
        <AnimatePresence>
          {activeLead && typeof activeLead === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-[100]"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeLead && typeof activeLead === "object" ? (
            <div className="fixed inset-0 grid place-items-center z-[110] p-4 pointer-events-auto">
              <motion.div
                layoutId={`card-${activeLead.id}-${activeId}`}
                ref={activeRef}
                className="w-full max-w-[500px] max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-700/50 rounded-3xl overflow-hidden shadow-2xl relative"
              >
                <motion.button
                  key={`button-${activeLead.id}-${activeId}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="absolute top-6 right-6 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors z-10"
                  onClick={() => setActiveLead(null)}
                >
                  <X className="w-4 h-4" />
                </motion.button>
                
                <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <motion.h3
                        layoutId={`title-${activeLead.id}-${activeId}`}
                        className="font-bold text-2xl text-white mb-1"
                      >
                        {activeLead.name}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${activeLead.id}-${activeId}`}
                        className="text-zinc-400"
                      >
                        {activeLead.email}
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.div layoutId={`status-${activeLead.id}-${activeId}`}>
                    <select
                      value={activeLead.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(activeLead.id, e.target.value)}
                      className={`
                        text-xs font-semibold px-3 py-1.5 rounded-full appearance-none outline-none cursor-pointer border text-center inline-block min-w-[110px]
                        ${activeLead.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${activeLead.status === 'CONTACTED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${activeLead.status === 'CLOSED' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' : ''}
                      `}
                    >
                      <option value="NEW" className="bg-zinc-900 text-white">NEW</option>
                      <option value="CONTACTED" className="bg-zinc-900 text-white">CONTACTED</option>
                      <option value="CLOSED" className="bg-zinc-900 text-white">CLOSED</option>
                    </select>
                  </motion.div>
                  
                  <div className="pt-4 border-t border-zinc-800 flex flex-col gap-4 text-sm text-zinc-300">
                    <div>
                      <strong className="block text-zinc-500 mb-1">Budget Range</strong>
                      <span className="text-white font-medium">{activeLead.budgetRange}</span>
                    </div>
                    <div>
                      <strong className="block text-zinc-500 mb-1">Submitted On</strong>
                      <span className="text-white font-medium">{new Date(activeLead.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <strong className="block text-zinc-500 mb-1">Message</strong>
                      <div className="p-4 bg-zinc-800/50 rounded-xl leading-relaxed whitespace-pre-wrap border border-zinc-800">
                        {activeLead.message}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="rgba(24, 24, 27, 0.4)" // Match bg-zinc-900/40
          borderRadius={12}
          glowRadius={100}
          glowIntensity={1}
          className="mb-6 shadow-xl backdrop-blur-sm"
        >
          {/* Card Header with Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-zinc-800/50 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="relative w-full md:w-auto" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-between w-full md:w-48 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <span>
                    {statusFilter === 'ALL' ? 'All Statuses' : statusFilter === 'NEW' ? 'New' : statusFilter === 'CONTACTED' ? 'Contacted' : 'Closed'}
                  </span>
                </div>
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-full md:w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 overflow-hidden py-1">
                  {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(1);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors ${statusFilter === status ? 'text-white bg-zinc-800/50' : 'text-zinc-400'}`}
                    >
                      {status === 'ALL' ? 'All Statuses' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 relative">

            <ul className="flex flex-col gap-2 w-full">
              {loading ? (
                <div className="py-12 text-center text-zinc-500 w-full">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading leads...
                </div>
              ) : leads.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 w-full">
                  No leads found.
                </div>
              ) : (
                leads.map((lead) => (
                  <motion.li
                    layoutId={`card-${lead.id}-${activeId}`}
                    key={`card-${lead.id}-${activeId}`}
                    onClick={() => setActiveLead(lead)}
                    className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-zinc-800/40 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-zinc-700/50 gap-4"
                  >
                    <div className="flex flex-col">
                      <motion.h3
                        layoutId={`title-${lead.id}-${activeId}`}
                        className="font-medium text-zinc-100"
                      >
                        {lead.name}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${lead.id}-${activeId}`}
                        className="text-zinc-500 text-sm mt-1"
                      >
                        {lead.email}
                      </motion.p>
                    </div>
                    
                    <div className="flex flex-row items-center gap-6 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-sm font-medium text-zinc-300 hidden sm:block">{lead.budgetRange}</span>
                      <span className="text-sm text-zinc-500 hidden sm:block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      
                      <motion.div layoutId={`status-${lead.id}-${activeId}`}>
                        <span
                          className={`
                            text-xs font-semibold px-3 py-1.5 rounded-full border text-center inline-block min-w-[100px]
                            ${lead.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                            ${lead.status === 'CONTACTED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                            ${lead.status === 'CLOSED' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' : ''}
                          `}
                        >
                          {lead.status}
                        </span>
                      </motion.div>
                    </div>
                  </motion.li>
                ))
              )}
            </ul>
          </div>
        </BorderGlow>

        {/* Pagination Controls */}
        {!loading && totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-400 gap-4">
            <div>
              Showing <span className="font-medium text-zinc-100">{(page - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium text-zinc-100">{Math.min(page * 10, totalCount)}</span> of{' '}
              <span className="font-medium text-zinc-100">{totalCount}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-2 font-medium">
                Page {page} of {totalPages}
              </div>
              
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
