import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { firestore, auth, serverTimeStamp } from "@/lib/firebase";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { toast } from "react-hot-toast";

export default function AdminPostsPage() {
	return ( 
		<main>
			<AuthCheck>
				<PostsList />
				<CreateNewPost />
			</AuthCheck>
		</main>
		);
}

function PostsList() {
	const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
	const query = ref.orderBy('createdAt');
	const [posts] = useCollectionData(query);

	return(
		<>
			<h1>Manage Your Posts</h1>
			<PostFeed posts={posts} />
		</>
	)
}

function CreateNewPost() {
	const router = useRouter();
	const {username, user} = useContext(UserContext);
	const [title, setTitle] = useState('');

	const slug = encodeURI(kebabCase(title));

	const isValid = title.length > 3 && title.length < 100;

	const createPost = async (e) => {
		e.preventDefault();

		const uid = user.uid;
		const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# Hello World!',
			createdAt: serverTimeStamp(),
			updatedAt: serverTimeStamp(),
			heartCount: 0
		}

		await ref.set(data);

		toast.success('Post Created!')

		router.push(`/admin/${slug}`)

	}

	return(
		<form onSubmit={createPost}>
			<input 
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="My Awesome Article!"
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid} className="btn-green">
				Post
			</button>
		</form>
	)
}