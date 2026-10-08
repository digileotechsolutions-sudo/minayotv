<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pulse Daily Admin')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-100 text-slate-900 antialiased">
<div class="min-h-screen">
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto border-r border-slate-200 bg-slate-950 text-slate-100 lg:block">
        <div class="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-sm font-black">PD</div>
            <div>
                <div class="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">Pulse Daily</div>
                <div class="text-lg font-bold">Admin</div>
            </div>
        </div>

        <nav class="space-y-1 px-4 py-5">
            <a href="{{ route('admin.dashboard') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.dashboard') ? 'bg-slate-800' : '' }}">Dashboard</a>
            <a href="{{ route('admin.posts.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.posts.*') ? 'bg-slate-800' : '' }}">Posts</a>
            <a href="{{ route('admin.categories.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.categories.*') ? 'bg-slate-800' : '' }}">Categories</a>
            <a href="{{ route('admin.tags.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.tags.*') ? 'bg-slate-800' : '' }}">Tags</a>
            <a href="{{ route('admin.comments.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.comments.*') ? 'bg-slate-800' : '' }}">Comments</a>
            <a href="{{ route('admin.pages.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.pages.*') ? 'bg-slate-800' : '' }}">Pages</a>
            <a href="{{ route('admin.media.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.media.*') ? 'bg-slate-800' : '' }}">Media Library</a>
            <a href="{{ route('admin.users.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.users.*') ? 'bg-slate-800' : '' }}">Users</a>
            <a href="{{ route('admin.settings.index') }}" class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 {{ request()->routeIs('admin.settings.*') ? 'bg-slate-800' : '' }}">Settings</a>
        </nav>
    </aside>

    <div class="lg:ml-72">
        <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Admin</p>
                    <h1 class="text-xl font-black tracking-tight text-slate-900">@yield('heading', 'Dashboard')</h1>
                </div>
                <div class="flex items-center gap-3">
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{{ auth()->user()->role->slug ?? 'Editor' }}</span>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Logout</button>
                    </form>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {{ session('success') }}
                </div>
            @endif
            @if ($errors->any())
                <div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ul class="list-disc pl-5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>
</body>
</html>
