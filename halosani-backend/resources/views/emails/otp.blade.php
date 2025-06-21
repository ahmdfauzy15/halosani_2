<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi OTP - Halosani</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .header::after {
            content: "";
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 20px;
            background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg"><path d="M0,70 C250,0 500,100 750,50 C1000,0 1250,100 1440,30 L1440,100 L0,100 Z" fill="%23ffffff"/></svg>') no-repeat;
            background-size: cover;
        }
        
        .content {
            padding: 40px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #4b5563;
        }
        
        .message {
            margin-bottom: 30px;
            color: #4b5563;
        }
        
        .otp-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 5px;
            padding: 15px 25px;
            background-color: #f9fafb;
            border-radius: 8px;
            color: #4f46e5;
            border: 1px dashed #d1d5db;
            margin: 15px 0;
        }
        
        .expiry-notice {
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            margin: 20px 0;
        }
        
        .warning {
            background-color: #fef2f2;
            color: #b91c1c;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            margin: 25px 0;
            border-left: 4px solid #dc2626;
        }
        
        .footer {
            padding: 20px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }
        
        .logo {
            color: #4f46e5;
            font-weight: 700;
            font-size: 18px;
        }
        
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background-color: #4338ca;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
        }
        
        .social-links {
            margin: 20px 0;
            text-align: center;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #4f46e5;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Kode Verifikasi Halosani</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Halo,</div>
            
            <div class="message">
                Terima kasih telah bergabung dengan Halosani. Gunakan kode OTP berikut untuk memverifikasi akun Anda:
            </div>
            
            <div class="otp-container">
                <div class="otp-code">{{ $otp }}</div>
            </div>
            
            <div class="expiry-notice">
                Kode ini akan kadaluarsa dalam <strong>10 menit</strong>. Jangan berikan kode ini kepada siapapun.
            </div>
            
            <div class="warning">
                <strong>Peringatan:</strong> Jika Anda tidak meminta kode ini, mohon abaikan email ini atau hubungi tim dukungan kami segera.
            </div>
            
            <p style="margin-top: 30px; color: #4b5563;">
                Salam hangat,<br>
                <span class="logo">Tim Halosani</span>
            </p>
            
            <div class="social-links">
                <a href="#" target="_blank">Facebook</a>
                <a href="#" target="_blank">Instagram</a>
                <a href="#" target="_blank">Twitter</a>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Halosani. All rights reserved.</p>
            <p>Jakarta, Indonesia</p>
            <p>
                <a href="#" style="color: #4f46e5; text-decoration: none;">Kebijakan Privasi</a> | 
                <a href="#" style="color: #4f46e5; text-decoration: none;">Syarat & Ketentuan</a>
            </p>
        </div>
    </div>
</body>
</html>