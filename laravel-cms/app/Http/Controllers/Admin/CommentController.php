<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with('post', 'user')->latest();
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $comments = $query->paginate(12);

        return view('admin.comments.index', compact('comments'));
    }

    public function updateStatus(Comment $comment, string $status)
    {
        $valid = ['pending', 'approved', 'spam', 'trash'];
        if (! in_array($status, $valid, true)) {
            abort(400, 'Invalid status.');
        }

        $comment->update(['status' => $status]);

        return back()->with('success', 'Comment status updated.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
