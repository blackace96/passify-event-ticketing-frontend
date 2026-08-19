import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Mail,
  MessageCircle,
  ScanLine,
  Search,
  Send,
  Ticket,
  X,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';

const categories = [
  { id: 'all', label: 'All topics', icon: HelpCircle },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'entry', label: 'Entry & QR', icon: ScanLine },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const faqs = [
  { category: 'tickets', question: 'Where can I find my ticket?', answer: 'After signing in, open your dashboard and select “My tickets”. Your ticket and QR code will be ready there. We also send a confirmation to the email address connected to your account.' },
  { category: 'tickets', question: 'Can I transfer a ticket to someone else?', answer: 'Ticket transfer depends on the organiser’s policy. Check the event details first. If transfers are enabled, follow the option shown in your ticket details.' },
  { category: 'events', question: 'How do I create an event?', answer: 'Use the “Host an event” option from the landing page and complete organiser onboarding. Once approved, your organiser workspace lets you create, publish, and manage events.' },
  { category: 'events', question: 'What happens if an event is cancelled or postponed?', answer: 'The organiser will update the event details and communicate next steps. Refunds, credits, or rescheduling are handled according to the event’s stated policy.' },
  { category: 'entry', question: 'My QR code will not scan. What should I do?', answer: 'Make sure your screen brightness is up and the QR code is fully visible. If it still does not scan, show the ticket confirmation to the event staff so they can help verify your booking.' },
  { category: 'payments', question: 'I was charged but did not receive a ticket.', answer: 'First, refresh your dashboard and check your confirmation email. If the ticket is still missing after a few minutes, send us the payment reference through the contact form below.' },
  { category: 'payments', question: 'How do refunds work?', answer: 'Refund eligibility is set by the event organiser and shown on the event page. Contact the organiser first, or send us a request if you need help understanding the policy.' },
];

export default function SupportPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [form, setForm] = useState({ subject: 'Ticket issue', message: '' });

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === 'all' || faq.category === category;
      const matchesQuery = !normalizedQuery || `${faq.question} ${faq.answer}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const submitRequest = (event) => {
    event.preventDefault();
    if (!form.message.trim()) {
      return;
    }
    // Replace this with your support API call when the backend is ready.
    setForm({ subject: 'Ticket issue', message: '' });
    setRequestSent(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-8 h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[145px]" />
        <div className="absolute -right-40 top-[28rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/15 blur-[155px]" />
      </div>

      <main>
        <section className="mx-auto max-w-5xl px-5 pb-16 pt-36 text-center sm:px-8 lg:pt-44">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">
            <HelpCircle size={15} />
            Passify Help Centre
          </div>
          <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">How can we help?</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">Search for a quick answer, browse common topics, or send the team a message when you need a hand.</p>

          <div className="relative mx-auto mt-10 max-w-2xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setOpenQuestion(null); }}
              placeholder="Search tickets, payments, QR codes..."
              className="w-full rounded-2xl border border-white/10 bg-[#12121f]/90 py-4 pl-14 pr-5 text-base text-white outline-none placeholder:text-zinc-500 shadow-xl shadow-black/20 transition focus:border-violet-300/50 focus:ring-4 focus:ring-violet-400/10"
              aria-label="Search support articles"
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="h-fit rounded-3xl border border-white/10 bg-[#11111f]/85 p-4 shadow-xl shadow-black/15 backdrop-blur-xl">
              <p className="px-3 pb-3 pt-2 text-sm font-semibold text-zinc-400">Browse by topic</p>
              <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                {categories.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setCategory(id); setOpenQuestion(null); }}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${category === id ? 'bg-violet-400/15 text-violet-100' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'}`}
                  >
                    <Icon size={18} className={category === id ? 'text-violet-300' : 'text-zinc-500'} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-violet-300/15 bg-violet-400/[0.07] p-4">
                <MessageCircle size={19} className="text-violet-300" />
                <p className="mt-3 font-semibold text-white">Still need help?</p>
                <p className="mt-1 text-sm leading-5 text-zinc-400">Send the support team the details and we’ll guide you.</p>
                <button type="button" onClick={() => { setRequestSent(false); setShowForm(true); }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 transition hover:text-white">
                  Contact support <ArrowRight size={15} />
                </button>
              </div>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-[#11111f]/85 p-5 shadow-xl shadow-black/15 backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Helpful answers</h2>
                  <p className="mt-1 text-sm text-zinc-500">{results.length} {results.length === 1 ? 'article' : 'articles'} found</p>
                </div>
                {category !== 'all' && <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">{categories.find((item) => item.id === category)?.label}</span>}
              </div>

              <div className="space-y-3">
                {results.map((faq) => {
                  const isOpen = openQuestion === faq.question;
                  return (
                    <article key={faq.question} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                      <button
                        type="button"
                        onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                        className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left font-semibold text-zinc-100 transition hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300"
                        aria-expanded={isOpen}
                      >
                        {faq.question}
                        <ChevronDown size={18} className={`shrink-0 text-violet-300 transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <p className="border-t border-white/[0.07] px-5 py-4 leading-7 text-zinc-400">{faq.answer}</p>}
                    </article>
                  );
                })}
                {!results.length && (
                  <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
                    <Search className="mx-auto text-zinc-600" size={24} />
                    <p className="mt-4 font-semibold text-zinc-200">No answers matched that search.</p>
                    <button type="button" onClick={() => { setRequestSent(false); setShowForm(true); }} className="mt-3 text-sm font-semibold text-violet-300 hover:text-violet-200">Ask the support team instead</button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="support-form-title" onMouseDown={() => setShowForm(false)}>
          <div onMouseDown={(event) => event.stopPropagation()} className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#171725] p-6 shadow-2xl shadow-black/50 sm:p-8">
            <button type="button" onClick={() => setShowForm(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300" aria-label="Close support form">
              <X size={19} />
            </button>
            {requestSent ? (
              <div className="py-8 text-center sm:py-10">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-950/20">
                  <CheckCircle2 size={38} />
                </div>
                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Request received</p>
                <h2 id="support-form-title" className="mt-3 text-3xl font-semibold tracking-tight text-white">We’ve got your message.</h2>
                <p className="mx-auto mt-4 max-w-sm leading-7 text-zinc-400">Thanks for reaching out. A member of the Passify team will get back to you as soon as possible.</p>
                <button type="button" onClick={() => setShowForm(false)} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                  Done <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <form onSubmit={submitRequest}>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-400/15 text-violet-200"><Mail size={20} /></div>
                <h2 id="support-form-title" className="mt-5 text-2xl font-semibold tracking-tight text-white">Contact support</h2>
                <p className="mt-2 leading-6 text-zinc-400">Tell us what happened. Include an event name or payment reference when relevant.</p>
                <label className="mt-6 block text-sm font-medium text-zinc-200">
                  What can we help with?
                  <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e0e19] px-4 py-3 text-white outline-none focus:border-violet-300/50 focus:ring-4 focus:ring-violet-400/10">
                    <option>Ticket issue</option>
                    <option>Payment or refund</option>
                    <option>Event or organiser question</option>
                    <option>Account help</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label className="mt-5 block text-sm font-medium text-zinc-200">
                  Message
                  <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={5} placeholder="Describe the issue and include any useful details..." className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0e0e19] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-400/10" />
                  {!form.message.trim() && <span className="mt-2 block text-xs text-zinc-500">Please add a message before sending.</span>}
                </label>
                <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171725]">
                  Send request <Send size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
