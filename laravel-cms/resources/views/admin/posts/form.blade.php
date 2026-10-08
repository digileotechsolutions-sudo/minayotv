@extends('layouts.admin')

@section('title', isset($post->id) ? 'Edit post' : 'Create post')
@section('heading', isset($post->id) ? 'Edit post' : 'Create post')

@section('content')
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <form method="POST" action="{{ isset($post->id) ? route('admin.posts.update', $post) : route('admin.posts.store') }}" class="space-y-6">
        @csrf
        @if (isset($post->id))
            @method('PUT')
        @endif

        <div class="grid gap-5 lg:grid-cols-2">
            <div class="space-y-2 lg:col-span-2">
                <label class="text-sm font-medium text-slate-700">Title</label>
                <input type="text" name="title" value="{{ old('title', $post->title) }}" required class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Slug</label>
                <input type="text" name="slug" value="{{ old('slug', $post->slug) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Category</label>
                <select name="category_id" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">
                    <option value="">Select category</option>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" {{ old('category_id', $post->category_id) == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="space-y-2 lg:col-span-2">
                <label class="text-sm font-medium text-slate-700">Excerpt</label>
                <textarea name="excerpt" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">{{ old('excerpt', $post->excerpt) }}</textarea>
            </div>
            <div class="space-y-2 lg:col-span-2">
                <label class="text-sm font-medium text-slate-700">Content</label>
                <textarea name="content" rows="12" required class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">{{ old('content', $post->content) }}</textarea>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Status</label>
                <select name="status" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">
                    @foreach (['draft','published','scheduled','archived','trash'] as $status)
                        <option value="{{ $status }}" {{ old('status', $post->status) == $status ? 'selected' : '' }}>{{ ucfirst($status) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Schedule date</label>
                <input type="datetime-local" name="scheduled_at" value="{{ old('scheduled_at', optional($post->scheduled_at)->format('Y-m-d\TH:i')) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Featured image</label>
                <input type="text" name="featured_image" value="{{ old('featured_image', $post->featured_image) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Social image</label>
                <input type="text" name="social_image" value="{{ old('social_image', $post->social_image) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2 lg:col-span-2">
                <label class="text-sm font-medium text-slate-700">Tags</label>
                <select name="tags[]" multiple class="h-32 w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">
                    @foreach ($tags as $tag)
                        <option value="{{ $tag->id }}" {{ in_array($tag->id, old('tags', $post->tags->pluck('id')->all()), true) ? 'selected' : '' }}>{{ $tag->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">SEO title</label>
                <input type="text" name="seo_title" value="{{ old('seo_title', $post->seo_title) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">SEO keywords</label>
                <input type="text" name="seo_keywords" value="{{ old('seo_keywords', $post->seo_keywords) }}" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500" />
            </div>
            <div class="space-y-2 lg:col-span-2">
                <label class="text-sm font-medium text-slate-700">SEO description</label>
                <textarea name="seo_description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-red-500">{{ old('seo_description', $post->seo_description) }}</textarea>
            </div>
        </div>

        <div class="flex items-center justify-end gap-3">
            <a href="{{ route('admin.posts.index') }}" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</a>
            <button type="submit" class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white">{{ isset($post->id) ? 'Update post' : 'Create post' }}</button>
        </div>
    </form>
</div>
@endsection
