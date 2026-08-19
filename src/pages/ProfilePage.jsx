import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, ChevronRight, CircleUserRound, LoaderCircle, LogOut, Mail, ShieldCheck, Ticket, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ROLES = {
  ATTENDEE: { label: 'Attendee', icon: Ticket, targetRole: 'ORGANISER', targetLabel: 'Organiser', targetDescription: 'Create, publish, and manage your own events.', targetPath: '/org/dashboard' },
  ORGANISER: { label: 'Organiser', icon: BriefcaseBusiness, targetRole: 'ATTENDEE', targetLabel: 'Attendee', targetDescription: 'Discover and book memorable events.', targetPath: '/dashboard' },
};

function DetailRow({ icon: Icon, label, value, last }) {
  return (
    <div className={`flex items-center gap-4 py-4 ${last ? '' : 'border-b border-white/[0.06]'}`}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-300/10">
        <Icon size={17} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">{label}</p>
        <p className="mt-1 truncate text-sm sm:text-base font-medium text-zinc-100">{value || 'Not available'}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const currentRole = ROLES[user?.role] || ROLES.ATTENDEE;
  const CurrentRoleIcon = currentRole.icon;
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || 'U';

  const accountDetails = [
    { key: 'name', label: 'Full name', icon: CircleUserRound, value: user?.name },
    { key: 'email', label: 'Email address', icon: Mail, value: user?.email },
    { key: 'role', label: 'Account role', icon: ShieldCheck, value: currentRole.label },
    ...(user?.orgName ? [{ key: 'organisation', label: 'Organisation', icon: BriefcaseBusiness, value: user.orgName }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = async () => {
    try {
      setUpgrading(true);
      const res = await api.patch('/auth/role', { role: currentRole.targetRole });
      login(res.data.token, res.data.user);
      toast.success(`You are now an ${currentRole.targetLabel}!`);
      navigate(currentRole.targetPath);
    } catch (error) {
      console.error('Role switch failed:', error);
      toast.error('We could not update your role. Please try again.');
    } finally {
      setUpgrading(false);
      setShowRoleDialog(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[150px]" />
      </div>

      <main className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group mb-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090912]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Profile & settings</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Manage your account information and workspace preferences.
          </p>
        </div>

        {/* Account Details Card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#11111f]/85 shadow-xl shadow-black/10 backdrop-blur-xl">
          <div className="relative overflow-hidden px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 opacity-90" />
            <div className="absolute -right-12 top-4 h-36 w-36 rounded-full bg-white/20 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-[#11111f] bg-gradient-to-br from-violet-300 to-violet-600 text-3xl font-bold text-white shadow-lg shadow-violet-950/50">
                {initial}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-semibold tracking-tight text-white">
                  {user?.role === 'ORGANISER' ? user?.orgName || user?.name : user?.name}
                </h2>
                <p className="mt-1 truncate text-sm text-zinc-300">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-200">
                  <CurrentRoleIcon size={13} />
                  {currentRole.label}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] px-5 sm:px-7">
            <div className="py-2">
              {accountDetails.map((item, index) => (
                <DetailRow key={item.key} {...item} last={index === accountDetails.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Workspace Switch Card */}
        <section className="relative mt-5 overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 via-[#171528] to-[#11111f] p-5 shadow-xl shadow-violet-950/10 sm:mt-6 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-400/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-violet-200">
                <CurrentRoleIcon size={17} />
                {currentRole.label} workspace
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">Switch workspace</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                {currentRole.targetDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRoleDialog(true)}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#171528] transition hover:bg-violet-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900 sm:w-auto"
            >
              Switch to {currentRole.targetLabel}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Sign Out Card */}
        <section className="mt-5 flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 sm:text-base">Sign out</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">End your current session on this device.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-400/35 hover:bg-red-400/[0.13] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:w-auto"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </section>
      </main>

      {/* Switch Workspace Modal */}
      {showRoleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="switch-role-title">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#171725] p-5 shadow-2xl shadow-black/50 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-400/15 text-violet-200">
                <CurrentRoleIcon size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowRoleDialog(false)}
                disabled={upgrading}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <h2 id="switch-role-title" className="mt-5 text-xl font-semibold text-white">
              Switch to {currentRole.targetLabel}?
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-base">
              Your account will switch to the {currentRole.targetLabel.toLowerCase()} workspace and you&apos;ll be redirected to the appropriate dashboard.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowRoleDialog(false)}
                disabled={upgrading}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleSwitch}
                disabled={upgrading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {upgrading ? <LoaderCircle size={17} className="animate-spin" /> : <ChevronRight size={17} />}
                {upgrading ? 'Switching…' : `Switch to ${currentRole.targetLabel}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}