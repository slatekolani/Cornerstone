<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Message Received — CLA Tanzania</title>
<style>
  body { margin: 0; padding: 0; background: #f3f4f6; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0d2b6e, #1a4a9e); padding: 40px 40px 32px; text-align: center; }
  .header img { height: 56px; margin-bottom: 16px; }
  .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 6px; }
  .header p { color: #c7d8f8; font-size: 13px; margin: 0; letter-spacing: 0.05em; }
  .body { padding: 40px; }
  .greeting { font-size: 18px; font-weight: 700; color: #0d2b6e; margin-bottom: 12px; }
  .text { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 20px; }
  .card { background: #f8faff; border-left: 4px solid #1a4a9e; border-radius: 8px; padding: 20px 24px; margin: 28px 0; }
  .card-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .card-value { font-size: 14px; color: #1f2937; line-height: 1.6; }
  .card-value + .card-label { margin-top: 16px; }
  .message-box { background: #eef2ff; border-radius: 8px; padding: 16px 20px; margin-top: 8px; font-size: 14px; color: #374151; line-height: 1.7; font-style: italic; }
  .badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; margin-bottom: 28px; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 32px 0; }
  .footer { background: #0d2b6e; padding: 28px 40px; text-align: center; }
  .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; line-height: 1.6; }
  .footer a { color: #e8d5a8; text-decoration: none; }
  .footer .school { color: #e8d5a8; font-weight: 700; font-size: 13px; margin-bottom: 6px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Cornerstone Leadership Academy</h1>
    <p>Tanzania &nbsp;·&nbsp; Foothills of Mount Meru, Arusha</p>
  </div>
  <div class="body">
    <div class="badge">✅ Message Received</div>
    <div class="greeting">Dear {{ $data['name'] }},</div>
    <p class="text">
      Thank you for reaching out to <strong>Cornerstone Leadership Academy Tanzania</strong>.
      We have received your message and our team will review it shortly.
    </p>
    <p class="text">
      Please expect a response within <strong>2–3 working days</strong>. In the meantime,
      feel free to reach us directly at
      <a href="tel:+255767279550" style="color:#1a4a9e;">+255 767 279 550</a> or
      <a href="tel:+255620301954" style="color:#1a4a9e;">+255 620 301 954</a>.
    </p>

    <div class="card">
      <div class="card-label">Your Name</div>
      <div class="card-value">{{ $data['name'] }}</div>

      <div class="card-label">Your Email</div>
      <div class="card-value">{{ $data['email'] }}</div>

      <div class="card-label">Your Message</div>
      <div class="message-box">{{ $data['message'] }}</div>
    </div>

    <p class="text" style="font-size:13px; color:#9ca3af;">
      If you did not submit this message, please ignore this email.
    </p>

    <hr class="divider" />

    <p class="text" style="margin-bottom: 0;">
      Warm regards,<br />
      <strong style="color:#0d2b6e;">The CLA Tanzania Team</strong><br />
      <span style="font-size:13px; color:#9ca3af;">Cornerstone Leadership Academy — Transforming Tanzania's Future Leaders</span>
    </p>
  </div>
  <div class="footer">
    <p class="school">Cornerstone Leadership Academy Tanzania</p>
    <p>Foothills of Mount Meru, Arusha, Tanzania</p>
    <p><a href="mailto:cstonetz1@gmail.com">cstonetz1@gmail.com</a></p>
    <p style="margin-top:12px;">Part of the <strong style="color:#e8d5a8;">Cornerstone Development Africa (CDA)</strong> Network</p>
  </div>
</div>
</body>
</html>
