export default function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="text-gray-600 mt-2">{post.description}</p>
      </div>
    </div>
  )
}
