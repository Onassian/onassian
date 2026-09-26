// Contact form handler — receives POST, sends email via SMTP relay
// Since Cloudflare Workers can't do raw SMTP (TCP), we use a simple HTTP bridge
// The bridge is a tiny endpoint you run on any server, or use a service

export default {
  async fetch(request, env, ctx) {
    // CORS headers for the form
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      const data = await request.json();
      const { name, email, section, subject, message } = data;

      // Validation
      if (!email || !message || !subject) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Spam checks
      const linkCount = (message.match(/https?:\/\//gi) || []).length;
      if (linkCount > 3) {
        return new Response(JSON.stringify({ error: 'Too many links' }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Honeypot check (if you add a hidden field to the form)
      if (data.website && data.website !== '') {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }); // Silently discard
      }

      // Format the email
      const emailBody = `New message from The Onassian Digest
================================

From: ${name || 'Anonymous'} <${email}>
Section: ${section || 'General'}
Subject: ${subject}
Date: ${new Date().toISOString()}

Message:
${message}

---
Reply directly to this email to respond to the sender.
      `.trim();

      // Send via SMTP2GO API (free tier: 100 emails/day)
      // Sign up at smtp2go.com, get API key, add as secret
      const smtpResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: env.SMTP2GO_API_KEY || '',
          to: ['stavrovagliano@onassian.com'],
          sender: 'contact@onassian.com',
          subject: `[Digest ${section || 'General'}] ${subject}`,
          text_body: emailBody,
          reply_to: email
        })
      });

      const result = await smtpResponse.json();

      if (smtpResponse.ok && result.data && result.data.error_code === 'SUCCESS') {
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Message sent to the desk'
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        console.error('SMTP2GO error:', result);
        throw new Error(result.data?.error || 'Failed to send');
      }

    } catch (err) {
      console.error('Contact form error:', err);
      return new Response(JSON.stringify({ 
        error: 'Failed to send. Please email desk@onassian.com directly.' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
