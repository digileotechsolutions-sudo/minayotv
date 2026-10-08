@extends('layouts.admin')

@section('title', 'Categories')
@section('heading', 'Categories')

@section('content')
<div class="grid gap-6 xl:grid-cols-[380px_1fr]">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-black tracking-tight">Add category</h3>
        <form method="POST" action="{{ route('admin.categories.store') }}" class="mt-5 space-y-4">
            @csrf
            <div>
                <label class="text-sm font-medium text-slate-700">Name</label>
                <input type="text" name="name" required class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" rows="3" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></textarea>
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">SEO title</label>
                <input type="text" name="seo_title" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">SEO description</label>
                <textarea name="seo_description" rows="3" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></textarea>
            </div>
            <button class="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">Save category</button>
        </form>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full text-left">
                <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                        <th class="px-4 py-3">Name</th>
                        <th class="px-4 py-3">Slug</th>
                        <th class="px-4 py-3">Posts</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach ($categories as $category)
                        <tr>
                            <td class="px-4 py-4 font-bold text-slate-800">{{ $category->name }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $category->slug }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $category->posts()->count() }}</td>
                            <td class="px-4 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <form action="{{ route('admin.categories.destroy', $category) }}" method="POST">
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
            {{ $categories->links() }}
        </div>
    </div>
</div>
@endsection
