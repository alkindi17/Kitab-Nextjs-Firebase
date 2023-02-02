import Link from "next/link";

function PostFeed({ posts, admin }) {
	return (
		posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null
	);
}

function PostItem({ post, admin = false }) {

	const wordCount = post.content?.split(" ").length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return ( 
		<div className="card">
			<Link href={`/${post.username}`}>
					<strong>By {post.username}</strong>
			</Link>

			<Link href={`/${post.username}/${post.slug}`}>
				<h2>
					{post.title}
				</h2>
			</Link>

			<footer>
				<span>
					{wordCount} words. {minutesToRead} min read
				</span>
				<span className="push-left">💗 {post.heartCount || 0}</span>
			</footer>

			{admin && (
				<>
					<Link>
						<h3>
							<button className="btn-blue">Edit</button>
						</h3>
					</Link>

					{post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
				</>
			)}
		</div>
  );
}

export default PostFeed;