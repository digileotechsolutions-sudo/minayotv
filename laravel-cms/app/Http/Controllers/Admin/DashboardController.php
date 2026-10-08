<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'posts_total' => Post::count(),
            'posts_published' => Post::where('status', 'published')->count(),
            'posts_draft' => Post::where('status', 'draft')->count(),
            'posts_scheduled' => Post::where('status', 'scheduled')->count(),
            'categories' => Category::count(),
            'comments' => Comment::count(),
            'users' => User::count(),
            'views' => Post::sum('views'),
        ];

        $recentPosts = Post::with('author')->latest()->take(5)->get();
        $recentActivity = ActivityLog::with('user')->latest()->take(8)->get();
        $popularArticles = Post::orderByDesc('views')->take(5)->get();
        $viewTrend = Post::select(DB::raw('DATE(created_at) as day'), DB::raw('SUM(views) as total'))
            ->groupBy('day')
            ->orderBy('day')
            ->limit(7)
            ->get();

        return view('admin.dashboard', compact(
            'stats',
            'recentPosts',
            'recentActivity',
            'popularArticles',
            'viewTrend'
        ));
    }
}
