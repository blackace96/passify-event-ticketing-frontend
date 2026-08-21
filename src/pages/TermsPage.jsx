import { FileText, ShieldCheck, Ticket, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import { Link } from 'react-router-dom';


const sections = [
  {
    title: '1. Accepting these terms',
    body: (
      <p>By creating an account, browsing events, buying a ticket, or using Passify as an organiser, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
    ),
  },
  {
    title: '2. Your Passify account',
    body: (
      <ul>
        <li>Keep your sign-in method and account details secure.</li>
        <li>Provide accurate information and use an account only for yourself or an organisation you are authorised to represent.</li>
        <li>Contact us promptly if you believe someone has accessed your account without permission.</li>
      </ul>
    ),
  },
  {
    title: '3. Tickets and attendance',
    body: (
      <ul>
        <li>A ticket gives its holder entry only to the event, date, and ticket type shown at purchase.</li>
        <li>Tickets may not be copied, resold, or used fraudulently. A QR code can be scanned only once unless an organiser clearly states otherwise.</li>
        <li>Event organisers may set additional venue, age, safety, and conduct requirements. Attendees must follow them.</li>
      </ul>
    ),
  },
  {
    title: '4. Payments, cancellations, and refunds',
    body: (
      <p>Prices, availability, refund rules, and cancellation decisions are set by the relevant event organiser unless Passify states otherwise. Before paying, review the event details and refund policy. If an event is cancelled, postponed, or materially changed, the organiser’s stated policy applies, subject to applicable law.</p>
    ),
  },
  {
    title: '5. Rules for organisers',
    body: (
      <ul>
        <li>Only publish events that are lawful, accurate, and genuinely available to attendees.</li>
        <li>Keep event descriptions, pricing, venue information, and refund terms clear and up to date.</li>
        <li>You are responsible for obtaining the licences, permissions, insurance, and approvals needed for your event.</li>
        <li>Do not misuse attendee data. Use it only to deliver and manage the event, and handle it in line with applicable privacy laws.</li>
      </ul>
    ),
  },
  {
    title: '6. Acceptable use',
    body: (
      <p>You must not interfere with the platform, attempt unauthorised access, upload harmful content, impersonate another person, use Passify for fraud, or violate another person’s rights. We may suspend or remove accounts that breach these terms or put the platform or community at risk.</p>
    ),
  },
  {
    title: '7. Platform availability',
    body: (
      <p>We work to keep Passify reliable, but the service may occasionally be unavailable for maintenance, updates, or reasons outside our control. We may change, improve, or discontinue features where reasonably necessary.</p>
    ),
  },
  {
    title: '8. Changes to these terms',
    body: (
      <p>We may update these terms as Passify evolves. When we make material changes, we will post the new version here and update the effective date. Continuing to use Passify after the update means you accept the revised terms.</p>
    ),
  },
  {
    title: '9. Contact us',
    body: (
      <p>
  Questions about these terms? Please{' '}
  <Link
    to="/support"
    className="font-medium text-violet-300 underline decoration-violet-300/40 underline-offset-4 transition hover:text-violet-200"
  >
    contact Passify Support
  </Link>
  .
</p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -right-40 top-[30rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-700/10 blur-[150px]" />
      </div>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8 lg:pt-44">
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">
            <FileText size={15} />
            Passify legal
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Terms of Service</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-400">These terms explain the rules for using Passify, whether you are discovering an event, buying a ticket, or hosting one.</p>
          <p className="mt-5 text-sm text-white">Effective date: August 14, 2026</p>
        </header>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[#11111f]/85 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-4 border-b border-white/[0.08] bg-white/[0.025] p-6 sm:grid-cols-3 sm:p-8">
            {[
              [Ticket, 'For attendees', 'How tickets and event entry work'],
              [Users, 'For organisers', 'Your responsibilities when hosting'],
              [ShieldCheck, 'For everyone', 'Safe and fair use of Passify'],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-white/[0.07] bg-[#0d0d18]/60 p-4">
                <Icon size={19} className="text-violet-300" />
                <p className="mt-3 font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-5 text-white">{text}</p>
              </div>
            ))}
          </div>

          <article className="space-y-10 p-6 text-base leading-7 text-zinc-300 sm:p-10">
            <p className="rounded-2xl border border-violet-300/10 bg-violet-400/[0.06] p-5 text-zinc-300">Please read these terms carefully. This template should be reviewed and adapted by a qualified legal professional before a public launch, particularly for your business location, payment provider, and refund process.</p>
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight text-white">{section.title}</h2>
                <div className="mt-3 text-zinc-400 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-violet-300">
                  {section.body}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
