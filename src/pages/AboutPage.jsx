import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarPlus,
  Heart,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import { useAuth } from '../context/AuthContext';
import BecomeOrganizerPage from './BecomeOrganizerPage';
import CreateEventPage from './CreateEventPage';

const values = [
  {
    icon: Heart,
    title: 'People first',
    description: 'Every interaction should feel simple, welcoming, and made for the people attending or creating an event.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by design',
    description: 'Secure checkout, reliable QR validation, and clear information help every guest arrive with confidence.',
  },
  {
    icon: Sparkles,
    title: 'Better experiences',
    description: 'We remove the admin around events so organisers can focus on the moments people will remember.',
  },
];

const capabilities = [
  { icon: Ticket, title: 'Find your next moment', text: 'Explore experiences worth showing up for and keep every ticket in one place.' },
  { icon: CalendarPlus, title: 'Create without the chaos', text: 'Publish events, manage sales, and keep your guests informed from one workspace.' },
  { icon: ScanLine, title: 'Make entry effortless', text: 'Give every guest a secure QR ticket and make check-in fast at the door.' },
];

// Add an image path when each team member supplies a photo, e.g. '/team/ama.jpg'.
// Replace the placeholder social URLs before publishing.
const team = [
  {
    name: 'Arnold Agbenyo',
    role: 'Full Stack Developer',
    initial: 'AA',
    image: '',
    bio: 'A third year computer science student in KNUST and a Full Stack Developer thats crafts scalable, user-focused web solutions with React, Node.js, and modern cloud tools. Very passionate about clean code, intuitive design, and continuous learning.',
    links: { linkedin: 'https://www.linkedin.com/in/arnold-agbenyo-8074142b2?utm_source=share_via&utm_content=profile&utm_medium=member_ios', instagram: 'https://www.instagram.com/_blackace9?igsh=ZXJvbXI1MnlvdjBo&utm_source=qr', whatsapp: 'https://wa.me/233537015329?text=Hi%20Ama%2C%20I%20found%20you%20through%20Passify.' },
  },
  //   {
  //     name: 'Lawrencia Adu Nyarkoa',
  //     role: 'Backend & API',
  //     initial: 'LAN',
  //     image: '',
  //     bio: 'Building the systems that keep tickets, events, and check-ins moving reliably.',
  //     links: { linkedin: '#', instagram: '#', whatsapp: '#' },
  //   },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute -right-40 top-[32rem] h-[30rem] w-[30rem] rounded-full bg-fuchsia-700/15 blur-[150px]" />
      </div>

      <main>
        <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">
              <Sparkles size={15} />
              Built for every kind of gathering
            </div>
            <h1 className="text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Experiences bring us together. <span className="text-violet-400">Passify makes them easier.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              Passify is a modern event platform for discovering what is next, booking in seconds, and helping organisers create remarkable events from start to finish.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090912]"
              >
                Explore events <ArrowRight size={17} />
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(user?.role === 'organizer' ? '/create-event' : '/become-organizer')
                }
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3.5 font-semibold text-zinc-100 transition hover:border-violet-300/30 hover:bg-violet-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                Host an event
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-32">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Our purpose</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Make the path from idea to unforgettable event feel natural.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-zinc-400">
            <p>We believe event technology should stay out of the way. Guests should spend less time searching for confirmations and more time looking forward to the event.</p>
            <p>For organisers, the tools behind the scenes should be just as effortless: one place to publish, sell, communicate, and welcome people through the door.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="rounded-[2rem] border border-white/10 bg-[#11111f]/85 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">What Passify does</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">One pass, from planning to the door.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-400/10 text-violet-200 ring-1 ring-inset ring-violet-300/15">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 leading-6 text-zinc-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">The people behind Passify</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built by people who care about better events.</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-400">Select a team member to learn a little more or find their preferred way to connect.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <button
                key={member.name + member.role}
                type="button"
                onClick={() => setSelectedMember(member)}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 text-center transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-violet-400/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                {member.image ? (
                  <img src={member.image} alt={member.name} className="mx-auto h-20 w-20 rounded-2xl object-cover ring-1 ring-white/15" />
                ) : (
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-violet-300 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-violet-950/40">
                    {member.initial}
                  </div>
                )}
                <h3 className="mt-5 text-lg font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition group-hover:text-violet-200">
                  View profile <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="mb-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">What guides us</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Small details make a big difference.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-violet-400/[0.05]">
                <Icon className="text-violet-300" size={22} />
                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-950 px-6 py-12 text-center shadow-2xl shadow-violet-950/30 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <Users className="mx-auto text-violet-100" size={28} />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your next experience starts here.</h2>
              <p className="mt-4 text-lg leading-7 text-violet-100/75">Whether you are joining a crowd or bringing one together, Passify is ready when you are.</p>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-semibold text-violet-800 transition hover:bg-violet-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-700"
              >
                Discover events <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-member-name"
          onMouseDown={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#171725] p-6 text-center shadow-2xl shadow-black/50 sm:p-8"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              aria-label="Close profile"
            >
              <X size={19} />
            </button>
            {selectedMember.image ? (
              <img src={selectedMember.image} alt={selectedMember.name} className="mx-auto h-24 w-24 rounded-3xl object-cover ring-1 ring-white/15" />
            ) : (
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-violet-300 to-violet-600 text-3xl font-bold text-white shadow-lg shadow-violet-950/40">
                {selectedMember.initial}
              </div>
            )}
            <h2 id="team-member-name" className="mt-5 text-2xl font-semibold tracking-tight text-white">{selectedMember.name}</h2>
            <p className="mt-1 text-sm font-medium text-violet-300">{selectedMember.role}</p>
            <p className="mt-5 leading-7 text-zinc-400">{selectedMember.bio}</p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              <a href={selectedMember.links.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-xs font-medium text-zinc-300 transition hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white">
                <FaLinkedinIn className="text-[#7aa7ff]" size={19} /> LinkedIn
              </a>
              <a href={selectedMember.links.instagram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-xs font-medium text-zinc-300 transition hover:border-fuchsia-300/30 hover:bg-fuchsia-400/10 hover:text-white">
                <FaInstagram className="text-fuchsia-300" size={19} /> Instagram
              </a>
              <a href={selectedMember.links.whatsapp} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-xs font-medium text-zinc-300 transition hover:border-emerald-300/30 hover:bg-emerald-400/10 hover:text-white">
                <FaWhatsapp className="text-emerald-300" size={19} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
