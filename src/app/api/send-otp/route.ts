import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, otp, name } = await request.json()

    console.log('Send OTP API called:', { email, otpLength: otp?.length, name })

    if (!email || !otp) {
      console.error('Missing email or OTP')
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { 
          success: true,
          message: 'OTP generated (email service not configured)',
          otp, // Return OTP for development
          email 
        },
        { status: 200 }
      )
    }

    // Custom email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Chameleon</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
        <img src="https://chameleon-nu.vercel.app/images/1212.jpg" alt="Chameleon" style="width: 100px; height: 90px; object-fit: contain; display: block;" />
      </div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Chameleon</h1>
      <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Educational Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%); border-radius: 16px; padding: 40px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); border: 1px solid rgba(139, 92, 246, 0.2);">
      <!-- Greeting -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #ffffff; margin: 0 0 12px; font-size: 24px; font-weight: 600;">Welcome, ${name}! 👋</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 16px; line-height: 1.6;">
          Thank you for signing up with Chameleon. To complete your registration and secure your account, please verify your email address.
        </p>
      </div>

      <!-- OTP Code Box -->
      <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid #8b5cf6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
        <p style="color: #a78bfa; margin: 0 0 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
          ${otp}
        </div>
        <p style="color: #64748b; margin: 16px 0 0; font-size: 13px;">This code will expire in 10 minutes</p>
      </div>

      <!-- Instructions -->
      <div style="background: rgba(236, 72, 153, 0.05); border-left: 3px solid #ec4899; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="color: #e2e8f0; margin: 0 0 12px; font-size: 15px; font-weight: 600;">📝 How to verify:</p>
        <ol style="color: #94a3b8; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>Return to the Chameleon signup page</li>
          <li>Enter the 6-digit code above</li>
          <li>Complete your profile setup</li>
        </ol>
      </div>

      <!-- Security Notice -->
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(148, 163, 184, 0.1);">
        <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
          🔒 <strong style="color: #94a3b8;">Security tip:</strong> If you didn't request this verification code, please ignore this email. Your account remains secure.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">
        This email was sent by <strong style="color: #8b5cf6;">Chameleon Team</strong>
      </p>
      <p style="color: #475569; margin: 0; font-size: 12px;">
        © 2026 Chameleon Educational Platform. All rights reserved.
      </p>
      <div style="margin-top: 20px;">
        <a href="https://chameleon-nu.vercel.app" style="color: #8b5cf6; text-decoration: none; font-size: 13px; margin: 0 10px;">Visit Website</a>
        <span style="color: #475569;">•</span>
        <a href="https://chameleon-nu.vercel.app/privacy" style="color: #8b5cf6; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy Policy</a>
        <span style="color: #475569;">•</span>
        <a href="https://chameleon-nu.vercel.app/terms" style="color: #8b5cf6; text-decoration: none; font-size: 13px; margin: 0 10px;">Terms</a>
      </div>
    </div>
  </div>
</body>
</html>
    `

    // Send email using Resend
    console.log('Attempting to send email via Resend...')
    const { data, error } = await resend.emails.send({
      from: 'Chameleon Team <noreply@chameleon-nu.tech>',
      to: [email], // Send to user's email
      subject: `${otp} is your Chameleon verification code`,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send OTP email',
          details: error
        },
        { status: 500 }
      )
    }

    console.log('✅ OTP email sent successfully:', { email, messageId: data?.id })

    return NextResponse.json(
      { 
        success: true,
        message: 'OTP sent successfully',
        messageId: data?.id
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send OTP',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
