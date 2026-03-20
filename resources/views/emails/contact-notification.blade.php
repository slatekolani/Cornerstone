<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Contact Message — CLA Tanzania</title>
<style>
  body { margin: 0; padding: 0; background: #f3f4f6; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a1a2e, #0d2b6e); padding: 32px 40px; display: flex; align-items: center; gap: 16px; }
  .header-dot { width: 12px; height: 12px; background: #b8963c; border-radius: 50%; flex-shrink: 0; }
  .header h1 { color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 4px; }
  .header p { color: #c7d8f8; font-size: 12px; margin: 0; }
  .alert-bar { background: #fef3c7; border-bottom: 2px solid #fbbf24; padding: 12px 40px; font-size: 13px; font-weight: 600; color: #92400e; }
  .body { padding: 36px 40px; }
  .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; }
  .info-grid { display: grid; gap: 0; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 28px; }
  .info-row { display: flex; border-bottom: 1px solid #e5e7eb; }
  .info-row:last-child { border-bottom: none; }
  .info-key { width: 120px; flex-shrink: 0; background: #f8faff; padding: 14px 16px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-val { padding: 14px 16px; font-size: 14px; color: #1f2937; line-height: 1.5; word-break: break-word; }
  .info-val a { color: #1a4a9e; text-decoration: none; }
  .message-section { margin-bottom: 28px; }
  .message-box { background: #f8faff; border: 1px solid #e0e7ff; border-radius: 10px; padding: 20px 24px; font-size: 14px; color: #374151; line-height: 1.8; white-space: pre-wrap; }
  .reply-btn { display: inline-block; background: linear-gradient(135deg, #0d2b6e, #1a4a9e); color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; }
  .meta { font-size: 12px; color: #9ca3af; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  .footer { background: #0d2b6e; padding: 20px 40px; text-align: center; }
  .footer p { color: rgba(255,255,255,0.4); font-size: 11px; margin: 3px 0; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div>
      <h1>📬 New Contact Message</h1>
      <p>Cornerstone Leadership Academy — Website Contact Form</p>
    </div>
  </div>
  <div class="alert-bar">
    ⚡ A visitor just submitted the contact form on your website.
  </div>
  <div class="body">

    <div class="section-title">Sender Details</div>
    <div class="info-grid">
      <div class="info-row">
        <div class="info-key">Name</div>
        <div class="info-val">{{ $data['name'] }}</div>
      </div>
      <div class="info-row">
        <div class="info-key">Email</div>
        <div class="info-val"><a href="mailto:{{ $data['email'] }}">{{ $data['email'] }}</a></div>
      </div>
      <div class="info-row">
        <div class="info-key">Sent At</div>
        <div class="info-val">{{ now()->format('D, d M Y \a\t H:i') }} (EAT)</div>
      </div>
    </div>

    <div class="message-section">
      <div class="section-title">Their Message</div>
      <div class="message-box">{{ $data['message'] }}</div>
    </div>

    <a href="mailto:{{ $data['email'] }}?subject=Re: Your message to CLA Tanzania" class="reply-btn">
      Reply to {{ $data['name'] }} →
    </a>

    <div class="meta">
      This notification was automatically sent by the CLA Tanzania website contact form.<br />
      The sender's email is <strong>{{ $data['email'] }}</strong> — you can reply directly to this email.
    </div>
  </div>
  <div class="footer">
    <p>CLA Tanzania &nbsp;·&nbsp; cstonetz1@gmail.com &nbsp;·&nbsp; Arusha, Tanzania</p>
  </div>
</div>
</body>
</html>
