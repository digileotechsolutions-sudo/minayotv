<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Role;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super-admin'],
            ['name' => 'Admin', 'slug' => 'admin'],
            ['name' => 'Editor', 'slug' => 'editor'],
            ['name' => 'Author', 'slug' => 'author'],
            ['name' => 'Subscriber', 'slug' => 'subscriber'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }

        $adminRole = Role::where('slug', 'super-admin')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@pulse.local'],
            [
                'name' => 'Pulse Admin',
                'password' => Hash::make('Password123!'),
                'role_id' => $adminRole?->id,
                'status' => 'active',
            ]
        );

        $categories = ['Kenya', 'Technology', 'Business', 'Culture', 'World'];
        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => strtolower(str_replace(' ', '-', $category))], [
                'name' => $category,
                'description' => 'Sample category for the editorial calendar.',
            ]);
        }

        $tags = ['news', 'startup', 'climate', 'politics', 'design'];
        foreach ($tags as $tag) {
            Tag::firstOrCreate(['slug' => strtolower(str_replace(' ', '-', $tag))], ['name' => $tag]);
        }
    }
}
