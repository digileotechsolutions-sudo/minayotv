<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-950 text-white">
<div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black">PD</div>
            <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-red-300">Pulse Daily</p>
            <h1 class="mt-3 text-3xl font-black tracking-tight">Admin access</h1>
        </div>

        <form method="POST" action="{{ route('login.submit') }}" class="space-y-5">
            @csrf
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none ring-0 transition focus:border-red-500" />
            </div>
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input type="password" name="password" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none ring-0 transition focus:border-red-500" />
            </div>
            <div class="flex items-center justify-between text-sm text-slate-300">
                <label class="flex items-center gap-2"><input type="checkbox" name="remember" value="1" class="accent-red-500"> Remember me</label>
                <a href="#" class="text-red-300">Forgot password?</a>
            </div>
            @if ($errors->any())
                <div class="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {{ $errors->first() }}
                </div>
            @endif
            <button type="submit" class="w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-500">Sign in</button>
        </form>

        <div class="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            Demo credentials: <span class="font-semibold text-white">admin@pulse.local / Password123!</span>
        </div>
    </div>
</div>
</body>
</html>
