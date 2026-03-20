<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactConfirmation;
use App\Mail\ContactNotification;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'message' => 'required|string|max:3000',
        ]);

        // Email to the school (notification)
        Mail::to('cstonetz1@gmail.com')->send(new ContactNotification($validated));

        // Auto-reply to the sender (confirmation)
        Mail::to($validated['email'])->send(new ContactConfirmation($validated));

        return response()->json(['success' => true]);
    }
}
