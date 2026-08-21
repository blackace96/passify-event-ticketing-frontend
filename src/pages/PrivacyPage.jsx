import { Cookie, Eye, FileLock2, Mail, ShieldCheck, UserRoundCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Information we collect',
    content: (
      <ul>
        <li><strong>Account information:</strong> your name, email address, role, and any organisation details you provide.</li>
        <li><strong>Event and ticket information:</strong> events you view or manage, tickets you purchase, QR ticket identifiers, and relevant booking details.</li>
        <li><strong>Support messages:</strong> the information you send when contacting the Passify team.</li>
        <li><strong>Technical information:</strong> basic device, browser, and usage information needed to secure and improve the platform.</li>
      </ul>
    ),
  },
  {
    title: '2. How we use your information',
    content: (
      <ul>
        <li>Create and secure your account.</li>
        <li>Process bookings, issue tickets, and validate entry at events.</li>
        <li>Send important booking, event, and account messages.</li>
        <li>Help organisers manage their events and communicate with their attendees.</li>
        <li>Respond to support requests, prevent fraud, and improve Passify.</li>
      </ul>
    ),
  },
  {
    title: '3. When we share information',
    content: (
      <p>We share the information needed to operate an event with its organiser, such as attendee name, ticket type, and check-in status. We may also use trusted service providers for payments, email delivery, hosting, analytics, or security. We do not sell your personal information.</p>
    ),
  },
  {
    title: '4. Payments',
    content: (
      <p>Payments are handled by our payment providers. Passify does not intentionally store full payment-card details on its own systems. Your payment provider may process data according to its own privacy policy.</p>
    ),
  },
  {
    title: '5. Cookies and similar technology',
    content: (
      <p>We may use essential cookies or similar technology to keep you signed in, remember preferences, protect the platform, and understand how Passify is used. Where required, we will ask for your consent before using non-essential cookies.</p>
    ),
  },
  {
    title: '6. Data retention and security',
    content: (
      <p>We retain personal information only for as long as needed to provide Passify, comply with legal obligations, resolve disputes, and enforce our agreements. We use reasonable technical and organisational safeguards, but no online service can guarantee absolute security.</p>
    ),
  },
  {
    title: '7. Your choices and rights',
    content: (
      <p>Depending on where you live, you may have rights to access, correct, delete, or receive a copy of your personal information, or to object to certain processing. You can also update some account information through your profile. To make a privacy request, contact us using the details below.</p>
    ),
  },
  {
    title: '8. Changes to this policy',
    content: (
      <p>We may update this policy as Passify changes. We will post the updated version here and revise the effective date. Please check this page occasionally for updates.</p>
    ),
  },
  {
    title: '9. Contact us',
    content: (
     <p>
  For privacy questions or requests, please{' '}
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-8 h-[30rem] w-[30rem] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -right-40 top-[34rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-700/10 blur-[150px]" />
      </div>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8 lg:pt-44">
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">
            <FileLock2 size={15} />
            Passify privacy
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-400">This policy explains what information Passify collects, why we use it, and the choices you have over your data.</p>
          <p className="mt-5 text-sm text-white">Effective date: August 14, 2026</p>
        </header>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[#11111f]/85 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-4 border-b border-white/[0.08] bg-white/[0.025] p-6 sm:grid-cols-3 sm:p-8">
            {[
              [UserRoundCheck, 'Your account', 'The details needed to provide Passify'],
              [Eye, 'Clear purpose', 'How your data supports tickets and events'],
              [ShieldCheck, 'Your control', 'Choices over your personal information'],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-white/[0.07] bg-[#0d0d18]/60 p-4">
                <Icon size={19} className="text-violet-300" />
                <p className="mt-3 font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-5 text-white">{text}</p>
              </div>
            ))}
          </div>

          <article className="space-y-10 p-6 text-base leading-7 text-zinc-300 sm:p-10">
            <p className="rounded-2xl border border-violet-300/10 bg-violet-400/[0.06] p-5 text-zinc-300">This is a project-ready privacy-policy template. Before public launch, have it reviewed and tailored to your location, payment provider, analytics tools, data storage, and applicable privacy laws.</p>
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight text-white">{section.title}</h2>
                <div className="mt-3 text-zinc-400 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-violet-300 [&_strong]:font-medium [&_strong]:text-zinc-200">
                  {section.content}
                </div>
              </section>
            ))}
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm leading-6 text-zinc-400">
              <Cookie size={19} className="mt-0.5 shrink-0 text-violet-300" />
              Cookie controls will only be needed once you add non-essential analytics, marketing, or tracking services to Passify.
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
