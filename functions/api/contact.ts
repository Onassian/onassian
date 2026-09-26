// Pages Function: handles POST to /api/contact via Web3Forms

interface Env {
  WEB3FORMS_KEY: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// GET — liveness check; ?debug=1 inspects config (never exposes the key)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  if (url.searchParams.get('debug') === '1') {
    const key = context.env.WEB3FORMS_KEY;
    return new Response(JSON.stringify({
      version: 'web3forms',
      key_configured: typeof key === 'string' && key.length > 0,
      key_length: typeof key === 'string' ? key.length : 0
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ status: 'ok', hint: 'POST only' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { name, email, section, subject, message } = data;

    if (!email || !message || !subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const linkCount = (message.match(/https?:\/\//gi) || []).length;
    if (linkCount > 3) {
      return new Response(JSON.stringify({ error: 'Too many links' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Honeypot
    if (data.website && data.website !== '') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_KEY,
        subject: `[Digest ${section || 'General'}] ${subject}`,
        from_name: `${name || 'Anonymous'} (Onassian Digest)`,
        replyto: email,
        name: name || 'Anonymous',
        email: email,
        section: section || 'General',
        message: message
      })
    });

    const result = await res.json();

    if (res.ok && result.success) {
      return new Response(JSON.stringify({ success: true, message: 'Message sent to the desk' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      error: 'Mail service rejected the send',
      http_status: res.status,
      service: result
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Failed to send. Please email the desk directly.',
      detail: String(err)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
