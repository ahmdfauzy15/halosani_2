<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 4px;
            display: inline-block;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your OTP Code</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Please use the following OTP code to verify your account:</p>
            
            <div class="otp-code">{{ $otp }}</div>
            
            <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
            
            <p>Thank you,<br>
            {{ config('app.name') }}</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>