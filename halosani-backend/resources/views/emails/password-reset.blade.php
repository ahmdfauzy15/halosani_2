<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Kata Sandi</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .lock-icon {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            position: relative;
            z-index: 1;
        }
        
        .lock-icon::before {
            content: '🔒';
            font-size: 24px;
        }
        
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .message {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg,rgb(68, 235, 110) 0%,rgb(68, 235, 110) 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(230, 230, 231, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .reset-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .reset-button:hover::before {
            left: 100%;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .warning-box {
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #e17055;
        }
        
        .warning-box p {
            color: #2d3436;
            font-weight: 500;
            margin: 0;
        }
        
        .info-box {
            background: linear-gradient(135deg, #a8e6cf 0%, #74b9ff 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #0984e3;
        }
        
        .info-box p {
            color: #2d3436;
            margin: 0;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .company-name {
            font-weight: 600;
            color: #495057;
            font-size: 16px;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 30px 0;
            border-radius: 1px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .reset-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <!-- <div class="lock-icon"></div> -->
            <h1>Reset Kata Sandi</h1>
            <p>Keamanan akun Anda adalah prioritas kami</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Halo, Pengguna yang terhormat!
            </div>
            
            <p class="message">
                Kami menerima permintaan untuk mereset kata sandi akun Anda. Jika Anda yang melakukan permintaan ini, silakan klik tombol di bawah untuk melanjutkan proses reset kata sandi.
            </p>
            
            <div class="button-container">
                <a href="{{ $resetLink }}" class="reset-button">
                    🔑 Reset Kata Sandi Sekarang
                </a>
            </div>
            
            <div class="warning-box">
                <p>⏰ <strong>Penting:</strong> Link reset kata sandi ini akan kedaluwarsa dalam 60 menit untuk menjaga keamanan akun Anda.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="info-box">
                <p>🛡️ <strong>Tidak meminta reset kata sandi?</strong><br>
                Jika Anda tidak melakukan permintaan ini, abaikan email ini. Kata sandi Anda akan tetap aman dan tidak akan berubah.</p>
            </div>
            
            <p class="message">
                Untuk keamanan tambahan, pastikan untuk:
            </p>
            <ul style="color: #666; margin-left: 20px; margin-bottom: 20px;">
                <li>Menggunakan kata sandi yang kuat dan unik</li>
                <li>Tidak membagikan informasi login Anda</li>
                <li>Mengaktifkan verifikasi dua langkah jika tersedia</li>
            </ul>
        </div>
        
        <div class="footer">
            <p class="company-name">Tim Keamanan Aplikasi</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>© 2025 - Semua hak dilindungi</p>
        </div>
    </div>
</body>
</html>