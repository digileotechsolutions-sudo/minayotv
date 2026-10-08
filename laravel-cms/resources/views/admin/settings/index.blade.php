@extends('layouts.admin')

@section('title', 'Settings')
@section('heading', 'Settings')

@section('content')
<div class="grid gap-6 xl:grid-cols-2">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-black tracking-tight">General settings</h3>
        <form method="POST" action="{{ route('admin.settings.update') }}" class="mt-5 space-y-4">
            @csrf
            @method('PUT')
            <div>
                <label class="text-sm font-medium text-slate-700">Website name</label>
                <input type="text" name="site_name" value="{{ old('site_name', $settings['site_name'] ?? '') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Website email</label>
                <input type="email" name="site_email" value="{{ old('site_email', $settings['site_email'] ?? '') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Contact number</label>
                <input type="text" name="contact_number" value="{{ old('contact_number', $settings['contact_number'] ?? '') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Time zone</label>
                <input type="text" name="timezone" value="{{ old('timezone', $settings['timezone'] ?? 'UTC') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <button class="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">Save settings</button>
        </form>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-black tracking-tight">SEO settings</h3>
        <form method="POST" action="{{ route('admin.settings.update') }}" class="mt-5 space-y-4">
            @csrf
            @method('PUT')
            <div>
                <label class="text-sm font-medium text-slate-700">Meta title</label>
                <input type="text" name="seo_title" value="{{ old('seo_title', $settings['seo_title'] ?? '') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Meta description</label>
                <textarea name="seo_description" rows="3" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">{{ old('seo_description', $settings['seo_description'] ?? '') }}</textarea>
            </div>
            <div>
                <label class="text-sm font-medium text-slate-700">Canonical URL</label>
                <input type="url" name="canonical_url" value="{{ old('canonical_url', $settings['canonical_url'] ?? '') }}" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </div>
            <button class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Update SEO</button>
        </form>
    </div>
</div>
@endsection
