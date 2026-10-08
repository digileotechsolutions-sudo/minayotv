@extends('layouts.admin')

@section('title', 'Posts')
@section('heading', 'Posts')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Content</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight">Blog posts</h2>
        </div>
        <a href="{{ route('admin.posts.create') }}" class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">New post</a>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form method="GET" class="flex flex-col gap-3 md:flex-row">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search posts..." class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500" />
            <select name="status" class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500">
                <option value="">All statuses</option>
                <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draft</option>
                <option value="published" {{ request('status') === 'published' ? 'selected' : '' }}>Published</option>
                <option value="scheduled" {{ request('status') === 'scheduled' ? 'selected' : '' }}>Scheduled</option>
            </select>
            <button class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white">Filter</button>
        </form>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left">
                <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                        <th class="px-4 py-3">Title</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3">Category</th>
                        <th class="px-4 py-3">Author</th>
                        <th class="px-4 py-3">Views</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach ($posts as $post)
                        <tr class="hover:bg-slate-50">
                            <td class="px-4 py-4">
                                <div class="font-bold text-slate-900">{{ $post->title }}</div>
                                <div class="mt-1 text-xs text-slate-500">{{ $post->slug }}</div>
                            </td>
                            <td class="px-4 py-4"><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{{ $post->status }}</span></td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $post->category?->name ?? '-' }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $post->author->name ?? '-' }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ number_format($post->views) }}</td>
                            <td class="px-4 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.posts.edit', $post) }}" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Edit</a>
                                    <form action="{{ route('admin.posts.destroy', $post) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button class="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="border-t border-slate-200 px-4 py-3">
            {{ $posts->links() }}
        </div>
    </div>
</div>
@endsection
