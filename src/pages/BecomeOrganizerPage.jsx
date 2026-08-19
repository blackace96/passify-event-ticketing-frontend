import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Ticket,
  Users,
  BarChart3,
  Sparkles,
  Zap,
  LoaderCircle,
  Building2,
} from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BecomeOrganizerPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const benefits = [
    {
      icon: CalendarPlus,
      title: 'Create & Manage Events',
      description:
        'Create professional event pages, set your venue, date, capacity, ticket types, and everything your attendees need to know.',
    },
    {
      icon: Ticket,
      title: 'Sell Tickets Easily',
      description:
        'Create multiple ticket categories and give attendees a simple and secure way to book their spots.',
    },
    {
      icon: QrCode,
      title: 'QR Code Validation',
      description:
        'Every ticket comes with a unique QR code that can be scanned and validated at your event entrance.',
    },
    {
      icon: BarChart3,
      title: 'Track Your Performance',
      description:
        'Keep an eye on ticket sales, attendance, capacity, and your event performance from one place.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose your organizer name',
      description:
        'Tell attendees what organization, brand, or event company you represent.',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Create your event',
      description:
        'Add your event details, ticket categories, pricing, venue, date, and capacity.',
      icon: CalendarPlus,
    },
    {
      number: '03',
      title: 'Sell your tickets',
      description:
        'Publish your event and let attendees discover and book tickets through PASSIFY.',
      icon: Ticket,
    },
    {
      number: '04',
      title: 'Welcome your attendees',
      description:
        'Scan QR tickets at the entrance and validate attendees quickly and securely.',
      icon: QrCode,
    },
  ];

  const handleBecomeOrganizer = async (e) => {
    e.preventDefault();

    const trimmedName = orgName.trim();

    if (!trimmedName) {
      toast.error('Please enter an organizer name.');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Organizer name must be at least 2 characters.');
      return;
    }

    try {
      setLoading(true);

      /*
       * STEP 1
       * Change the user's role from ATTENDEE -> ORGANISER.
       */
      const roleResponse = await api.patch('/auth/role', {
        role: 'ORGANISER',
      });

      /*
       * STEP 2
       * Save the organizer name.
       */
      const orgResponse = await api.patch('/auth/org-name', {
        orgName: trimmedName,
      });

      /*
       * STEP 3
       * Use the latest user/token information.
       *
       * If /org-name returns a user/token, use it.
       * Otherwise keep the token from the role response and
       * merge the returned organizer information.
       */
      const token =
        orgResponse.data?.token ||
        roleResponse.data?.token;

      const updatedUser = {
        ...(roleResponse.data?.user || user),
        ...(orgResponse.data?.user || {}),
        role: 'ORGANISER',
        orgName: trimmedName,
      };

      if (token) {
        login(token, updatedUser);
      }

      toast.success(`Welcome, ${trimmedName}!`);

      navigate('/org/dashboard');
    } catch (error) {
      console.error('Become organizer failed:', error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'We could not create your organizer profile. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-[-180px] top-24 h-[420px] w-[420px] rounded-full bg-[#6c47ff]/15 blur-[140px]" />
        <div className="absolute right-[-180px] top-1/3 h-[420px] w-[420px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:pb-24 sm:pt-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6c47ff]/25 bg-[#6c47ff]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd]">
                <Sparkles size={15} />
                Become a PASSIFY Organizer
              </div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-7xl">
                Turn your
                <br />
                <span className="bg-gradient-to-r from-[#c4b5fd] via-[#6c47ff] to-fuchsia-400 bg-clip-text text-transparent">
                  event idea
                </span>
                <br />
                into reality.
              </h1>

              <p className="mt-7 max-w-xl text-base font-medium leading-relaxed text-zinc-400 sm:text-lg">
                Create events, sell tickets, manage attendees, and validate
                entry with PASSIFY. Everything you need to run your event is
                in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#a78bfa]" />
                  Easy event creation
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#a78bfa]" />
                  Secure ticketing
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#a78bfa]" />
                  QR validation
                </span>
              </div>
            </div>

            {/* ORGANIZER FORM */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[#6c47ff]/15 blur-[70px]" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111122]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c47ff]/15 text-[#a78bfa]">
                    <Building2 size={22} />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Set up your organizer profile
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    You're already a PASSIFY user. We only need your organizer
                    name to get you started.
                  </p>
                </div>

                <form onSubmit={handleBecomeOrganizer}>
                  <label
                    htmlFor="orgName"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    Organizer name
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      id="orgName"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Pulse Events"
                      maxLength={100}
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-[#090912] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#6c47ff]/60 focus:ring-2 focus:ring-[#6c47ff]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs text-zinc-600">
                    This name will appear on your events and organizer
                    dashboard.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !orgName.trim()}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6c47ff] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6c47ff]/20 transition hover:bg-[#7c57ff] hover:shadow-[#6c47ff]/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" />
                        Setting up your organizer account...
                      </>
                    ) : (
                      <>
                        Become an Organizer
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-600">
                    <ShieldCheck size={14} />
                    Your existing PASSIFY account will be upgraded
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-y border-white/5 bg-[#111122]/40 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a78bfa]">
              <Sparkles size={15} />
              Everything you need
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              More than just ticket sales.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              PASSIFY gives organizers the tools to manage the complete event
              journey.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/5 bg-[#090912] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#6c47ff]/40"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6c47ff]/25 bg-[#6c47ff]/10 text-[#a78bfa] transition group-hover:bg-[#6c47ff]/20">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-bold">{title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a78bfa]">
              Simple setup
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              From idea to event in four steps.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <div
                key={number}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#111122] p-6"
              >
                <span className="absolute right-4 top-1 text-7xl font-black text-white/[0.025]">
                  {number}
                </span>

                <div className="relative">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6c47ff]/15 text-[#a78bfa]">
                    <Icon size={20} />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-[#6c47ff]">
                    STEP {number}
                  </span>

                  <h3 className="mt-2 text-lg font-bold">{title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#6c47ff]/20 bg-gradient-to-br from-[#6c47ff]/15 via-[#111122] to-[#111122]">
          <div className="grid items-center gap-10 px-7 py-12 sm:px-12 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c47ff]/15 text-[#a78bfa]">
                <ShieldCheck size={23} />
              </div>

              <h2 className="text-3xl font-black tracking-[-0.04em]">
                Your events. Your control.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                Manage your tickets and attendees from your organizer
                dashboard while keeping event entry fast and secure with QR
                validation.
              </p>
            </div>

            <div className="hidden md:flex h-32 w-32 items-center justify-center rounded-3xl border border-[#6c47ff]/30 bg-[#090912]">
              <QrCode size={72} strokeWidth={1.2} className="text-[#a78bfa]" />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#6c47ff]/30 bg-gradient-to-br from-[#6c47ff]/30 via-[#241d50] to-[#111122] px-7 py-14 text-center sm:px-12">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#a855f7]/25 blur-[110px]" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#6c47ff]/25 blur-[110px]" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#c4b5fd]">
              <Zap size={22} />
            </div>

            <h2 className="text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              Ready to host your next event?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60">
              Enter your organizer name above and start building your event
              experience with PASSIFY.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('orgName')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-[#171126] transition hover:-translate-y-0.5 hover:bg-zinc-100"
            >
              Get started
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}