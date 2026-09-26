import { useState } from 'react'
import { edition } from '../data/edition'

// Contact the desk — POSTs to the Pages Function which emails the desk
export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [section, setSection] = useState('Corrections')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, section, subject, message }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('sent')
        // Reset form
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Contact error:', err)
      setStatus('error')
    }
  }

  const field =
    'w-full border border-[#c9bfa9] bg-[#fbf8ef] px-3 py-2.5 font-body text-[15px] text-[#241f17] placeholder-[#a89e87] outline-none transition-colors focus:border-[#241f17] focus:bg-[#f6f1e4]'
  const label = 'mb-1 block font-mono text-[10px] uppercase tracking-widest text-[#7a7263]'

  return (
    <section id="contact" className="border-t border-[#c9bfa9]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-4xl text-[#241f17]">Contact the Desk</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
            {edition.contactEmail} · corrections & tips
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body text-[#3c362a]">
          Found an error in a rate, a date, or a fixture? Have a tip, a source, or a story we
          should be reading? The desk reads everything — corrections run at the top of the next
          edition.
        </p>

        <form onSubmit={send} className="mt-8 max-w-2xl border border-[#c9bfa9] bg-[#f6f1e4] p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className={label}>Name</label>
              <input
                id="ct-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="ct-email" className={label}>Email</label>
              <input
                id="ct-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={field}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label htmlFor="ct-section" className={label}>Section</label>
              <select
                id="ct-section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className={field}
              >
                <option>Corrections</option>
                <option>News tip</option>
                <option>Data question</option>
                <option>Advertising</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label htmlFor="ct-subject" className={label}>Subject</label>
              <input
                id="ct-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. TD3C figure in today's edition"
                className={field}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="ct-message" className={label}>Message</label>
            <textarea
              id="ct-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the desk…"
              className={`${field} resize-y`}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="border-2 border-[#241f17] bg-[#241f17] px-8 py-2.5 font-mono text-[12px] uppercase tracking-widest text-[#f6f1e4] transition-colors hover:bg-[#b03a2e] hover:border-[#b03a2e] disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
            <span className="font-mono text-[11px] text-[#a89e87]">
              {status === 'sent' && '✓ Sent to the desk'}
              {status === 'error' && '✗ Failed — try again or email the desk directly'}
              {status === 'idle' && 'sends directly to the desk — no mail app needed'}
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}
