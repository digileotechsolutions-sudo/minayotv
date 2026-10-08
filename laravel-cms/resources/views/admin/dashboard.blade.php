@extends('layouts.admin')

@section('title', 'Dashboard')
@section('heading', 'Dashboard')

@section('content')
<div class="space-y-8">
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @php($cards = [
            ['label' => 'Total posts', 'value' => $stats['posts_total'], 'tone' => 'bg-slate-900 text-white'],
            ['label' => 'Published', 'value' => $stats['posts_published'], 'tone' => 'bg-emerald-500 text-white'],
            ['label' => 'Drafts', 'value' => $stats['posts_draft'], 'tone' => 'bg-amber-500 text-white'],
            ['label' => 'Views', 'value' => number_format($stats['views']), 'tone' => 'bg-red-600 text-white'],
        ])
        @foreach ($cards as $card)
            <div class="rounded-2xl p-5 shadow-sm ring-1 ring-slate-200 {{ $card['tone'] }}">
                <p class="text-xs font-bold uppercase tracking-[0.22em] opacity-80">{{ $card['label'] }}</p>
                <div class="mt-4 text-3xl font-black">{{ $card['value'] }}</div>
            </div>
        @endforeach
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Performance</p>
                    <h2 class="mt-2 text-2xl font-black tracking-tight">Article views</h2>
                </div>
            </div>
            <div class="flex h-48 items-end gap-3">
                @foreach ($viewTrend as $point)
                    <div class="flex flex-1 flex-col items-center">
                        <div class="w-full rounded-t-xl bg-red-500/80" style="height: {{ max(20, (int) (($point->total / max(1, $viewTrend->max('total')) * 100))) }}%;"></div>
                        <div class="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">{{ \Illuminate\Support\Carbon::parse($point->day)->format('d') }}</div>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Publishing</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight">Publishing activity</h2>
            <div class="mt-6 space-y-4">
                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Published</span><strong>{{ $stats['posts_published'] }}</strong></div>
                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Draft</span><strong>{{ $stats['posts_draft'] }}</strong></div>
                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Scheduled</span><strong>{{ $stats['posts_scheduled'] }}</strong></div>
                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Comments</span><strong>{{ $stats['comments'] }}</strong></div>
            </div>
        </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Content</p>
                    <h2 class="mt-2 text-2xl font-black tracking-tight">Recent posts</h2>
                </div>
                <a href="{{ route('admin.posts.index') }}" class="text-sm font-bold text-red-600">View all</a>
            </div>
            <div class="space-y-4">
                @foreach ($recentPosts as $post)
                    <div class="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                        <div>
                            <h3 class="font-bold text-slate-900">{{ $post->title }}</h3>
                            <p class="mt-1 text-xs text-slate-500">{{ $post->author->name ?? 'Unknown author' }} · {{ $post->status }}</p>
                        </div>
                        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{{ number_format($post->views) }} views</span>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Activity</p>
                    <h2 class="mt-2 text-2xl font-black tracking-tight">Recent activity</h2>
                </div>
            </div>
            <div class="space-y-4">
                @foreach ($recentActivity as $activity)
                    <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                        <div class="mt-0.5 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                        <div>
                            <p class="font-semibold text-slate-800">{{ $activity->user->name ?? 'System' }}</p>
                            <p class="text-sm text-slate-600">{{ $activity->action }} · {{ $activity->description }}</p>
                            <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{{ $activity->created_at->diffForHumans() }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Top content</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight">Popular articles</h2>
            <div class="mt-5 space-y-4">
                @foreach ($popularArticles as $article)
                    <div class="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                        <div>
                            <p class="text-sm font-bold text-slate-800">{{ $article->title }}</p>
                            <p class="text-xs text-slate-500">{{ $article->category?->name ?? 'General' }}</p>
                        </div>
                        <span class="text-sm font-bold text-red-600">{{ number_format($article->views) }}</span>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight">Shortcuts</h2>
            <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <a href="{{ route('admin.posts.create') }}" class="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">Create post</a>
                <a href="{{ route('admin.categories.index') }}" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-800">Manage categories</a>
                <a href="{{ route('admin.users.index') }}" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-800">Add user</a>
                <a href="{{ route('admin.settings.index') }}" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-800">Update settings</a>
            </div>
        </div>
    </section>
</div>
@endsection
