<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class UserNotification extends Notification
{
    use Queueable;

    protected $message;

    // Constructor untuk menerima pesan
    public function __construct($message)
    {
        $this->message = $message;
    }

    // Penentuan saluran notifikasi
    public function via($notifiable)
    {
        return ['mail'];
    }

    // Format email yang akan dikirim
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Notifikasi HaloSani')
                    ->greeting('Halo ' . $notifiable->name . ',')
                    ->line($this->message)
                    ->action('Kunjungi Dashboard', url('/dashboard'))
                    ->line('Terima kasih telah menggunakan aplikasi kami!');
    }

    // Format database notification jika diperlukan
    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->message
        ];
    }
}
