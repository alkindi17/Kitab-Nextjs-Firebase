import styles from '../../styles/Post.module.css';
import PostContent from "@/components/PostContent";
import { firestore, postToJson, getUserWithUsername } from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import HeartButton from '@/components/HeartButton';

export async function getStaticPaths() {
	const snapshot = await firestore.collectionGroup('posts').get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug }
		};
	});
	console.log(paths);
	return {
		paths,
		fallback: 'blocking'
	}
}

export async function getStaticProps({params}) {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	console.log(params);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection('posts').doc(slug)
		post = postToJson(await postRef.get())

		path = postRef.path;
	}

	return {
		props: { post, path },
		revalidate: 5000
	};
}

function Post(props) {

	const postRef = firestore.doc(props.path);

	const [realtimePost] = useDocumentData(postRef);

	const post = realtimePost || props.post;

	return (
		<main className={styles.container}>

			<section>
			<PostContent post={post} />
			</section>

			<aside className="card">
				<p>
					<strong>{post.heartCount || 0} 🤍</strong>
					<HeartButton postRef={postRef}/>
				</p>
			</aside>

		</main>
	);
}

export default Post;