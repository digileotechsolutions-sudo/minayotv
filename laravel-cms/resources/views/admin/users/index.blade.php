@extends('layouts.admin')

@section('title', 'Users')
@section('heading', 'Users')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Members</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight">User management</h2>
        </div>
        <a href="{{ route('admin.users.create') }}" class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Add user</a>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left">
                <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                        <th class="px-4 py-3">Name</th>
                        <th class="px-4 py-3">Role</th>
                        <th class="px-4 py-3">Email</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach ($users as $user)
                        <tr>
                            <td class="px-4 py-4 font-bold text-slate-900">{{ $user->name }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $user->role->name ?? 'Unknown' }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $user->email }}</td>
                            <td class="px-4 py-4 text-sm text-slate-600">{{ $user->status }}</td>
                            <td class="px-4 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.users.edit', $user) }}" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Edit</a>
                                    <form action="{{ route('admin.users.destroy', $user) }}" method="POST">
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
            {{ $users->links() }}
        </div>
    </div>
</div>
@endsection
