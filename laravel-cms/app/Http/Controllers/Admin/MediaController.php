<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')->orWhere('file_name', 'like', '%'.$request->search.'%');
        }
        $media = $query->latest()->paginate(12);
        return view('admin.media.index', compact('media'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        Media::create([
            'name' => $file->getClientOriginalName(),
            'file_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
            'path' => $path,
        ]);

        return back()->with('success', 'File uploaded.');
    }

    public function destroy(Media $media)
    {
        Storage::disk('public')->delete($media->path);
        $media->delete();

        return back()->with('success', 'File deleted.');
    }
}
