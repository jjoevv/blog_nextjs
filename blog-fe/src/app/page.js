import BlogCard from './components/BlogCard'
import posts from './data/posts'

export default function Home() {
   return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-500">📝 Welcome to My Demo Blog</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </main>
   )
}
