<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'editor', 'author'], true);
    }

    public function view(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $this->viewAny($user);
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || in_array($user->role?->slug, ['super-admin', 'admin', 'editor'], true);
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
