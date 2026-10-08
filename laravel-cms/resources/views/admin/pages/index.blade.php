@extends('layouts.admin')

@section('title', 'Pages')
@section('heading', 'Pages')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Content</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight">Pages</h2>
        </div>
        <a href="{{ route('admin.pages.create') }}" class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">New page</a>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left">
                <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                        <th class="px-4 py-3">Title</th>
                        <th class="px-4 py-3">Slug</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach ($pages as $page)
                        <tr>
                            <td class="px-4 py-4 font-bold text-slate-900">{{ $page->title }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $page->slug }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $page->status }}</td>
                            <td class="px-4 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.pages.edit', $page) }}" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Edit</a>
                                    <form action="{{ route('admin.pages.destroy', $page) }}" method="POST">
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
            {{ $pages->links() }}
        </div>
    </div>
</div>
@endsection
