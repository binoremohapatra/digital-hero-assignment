"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Footer } from '@/components/Footer';
import { MagneticButton } from '@/components/MagneticButton';
import TextType from '@/components/TextType';
import StarBorder from '@/components/StarBorder';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  budgetRange: z.enum(["<$5k", "$5k-$15k", "$15k-$50k", "$50k+"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setStatus('error');
        setErrorMessage('Vercel Config Error: NEXT_PUBLIC_API_URL is missing. Please add it to Vercel and REDEPLOY.');
        return;
      }
      
      const res = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to submit form.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('A network error occurred.');
    }
  };

  return (
    <>
      <header className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-sm">LD</span>
          </div>
          <span>LeadDesk</span>
        </div>
        <StarBorder
          as="a"
          href="/admin/login"
          color="cyan"
          speed="4s"
          className="hover:scale-105 transition-transform"
        >
          <span className="font-medium">Admin Login</span>
        </StarBorder>
      </header>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden pt-24">
        {/* Background Ambient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-16 items-center z-10">

          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Capture leads <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">
                <TextType
                  text={["like a pro.", "instantly.", "at scale.", "effortlessly."]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg">
              Join elite teams using LeadDesk to intercept, qualify, and convert traffic into revenue with our hyper-optimized capture system.
            </p>
            <div className="flex items-center space-x-6 text-sm text-zinc-400 font-medium pt-4">
              <div className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" /> Fast Setup</div>
              <div className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-blue-400" /> Bank-grade Security</div>
            </div>
          </div>

          <div className="relative group perspective-1000">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Let's talk growth.</h2>

              {status === 'success' && (
                <div className="mb-8 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-500">
                  <CheckCircle2 className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">Incoming! Your transmission was a success. We're analyzing your details and will connect shortly.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-8 p-5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start text-red-400 animate-in fade-in slide-in-from-top-4 duration-500">
                  <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-zinc-900"
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-2 font-medium">{errors.name.message}</p>}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Work Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-zinc-900"
                      placeholder="jane@company.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-2 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Monthly Budget</label>
                  <div className="relative">
                    <select
                      {...register("budgetRange")}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none hover:bg-zinc-900 cursor-pointer"
                    >
                      <option value="">Select a range</option>
                      <option value="<$5k">&lt;$5k</option>
                      <option value="$5k-$15k">$5k-$15k</option>
                      <option value="$15k-$50k">$15k-$50k</option>
                      <option value="$50k+">$50k+</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                      ▼
                    </div>
                  </div>
                  {errors.budgetRange && <p className="text-red-400 text-xs mt-2 font-medium">{errors.budgetRange.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Project Details</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none hover:bg-zinc-900"
                    placeholder="Tell us about your goals..."
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs mt-2 font-medium">{errors.message.message}</p>}
                </div>

                <MagneticButton>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group relative w-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold tracking-wide py-4 px-6 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 overflow-hidden mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Initialize Mission'
                      )}
                    </span>
                  </button>
                </MagneticButton>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
