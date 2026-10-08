<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureAdminAccess
{
    public function handle(Request $request, Closure $next)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $allowedRoles = ['super-admin', 'admin', 'editor', 'author'];

        if (! in_array(strtolower((string) Auth::user()->role?->slug), $allowedRoles, true)) {
            abort(403, 'You do not have access to the admin dashboard.');
        }

        return $next($request);
    }
}
