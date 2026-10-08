@extends('layouts.admin')

@section('title', 'Tags')
@section('heading', 'Tags')

@section('content')
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
            <h3 class="text-xl font-black tracking-tight">Tag library</h3>
            <p class="text-sm text-slate-500">Manage labels for blog content and SEO discovery.</p>
        </div>
        <form method="POST" action="{{ route('admin.tags.store') }}" class="flex w-full max-w-xl gap-3">
            @csrf
            <input type="text" name="name" placeholder="Create a tag" required class="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            <button class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white">Add tag</button>
        </form>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @foreach ($tags as $tag)
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <div class="font-bold text-slate-900">#{{ $tag->name }}</div>
                        <div class="mt-1 text-xs text-slate-500">{{ $tag->slug }}</div>
                    </div>
                    <span class="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">{{ $tag->posts()->count() }} posts</span>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                    <form action="{{ route('admin.tags.destroy', $tag) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button class="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Delete</button>
                    </form>
                </div>
            </div>
        @endforeach
    </div>

    <div class="mt-5">
        {{ $tags->links() }}
    </div>
</div>
@endsection
