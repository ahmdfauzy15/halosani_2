<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h2>Password Reset Request</h2>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    
    <p>Click the button below to reset your password:</p>
    <a href="{{ $resetLink }}" 
       style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; 
              text-align: center; text-decoration: none; display: inline-block; font-size: 16px; 
              margin: 4px 2px; cursor: pointer;">
        Reset Password
    </a>

    <p>This password reset link will expire in 60 minutes.</p>
    
    <p>If you did not request a password reset, no further action is required.</p>
</body>
</html>