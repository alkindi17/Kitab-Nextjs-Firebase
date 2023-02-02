import AuthCheck from "@/components/AuthCheck";
import ImageUploader from "@/components/ImageUploader";
import { firestore, auth, serverTimeStamp } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/Admin.module.css"

function AdminPostEdit() {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}

export default AdminPostEdit;

function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const {slug} = router.query;

	const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
	const [post] = useDocumentDataOnce(postRef);

	return(
		<main className={styles.container}>
		{post && (
			<>
				<section>
					<h1>{post.title}</h1>
					<p>ID: {post.slug}</p>
					<ImageUploader />
					<PostForm postRef={postRef} defaultValues={post} preview={preview} />
				</section>

				<aside>
					<h3>Tools</h3>
					<button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
					<Link href={`/${post.username}/${post.slug}`}>
						<button className="btn-blue">Go to Page</button>
					</Link>
				</aside>

			</>
		)}
		</main>
	);
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimeStamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

	return(
		<form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

				<textarea {...register("content", {
					maxLength: { value: 20000, message: 'content is too long' },
					minLength: { value: 10, message: 'content is too short' },
					required: { value: true, message: 'content is required' },
				})}>

				</textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          {/* <input className={styles.checkbox} name="published" type="checkbox" ref={register} /> */}
					<input type={"checkbox"} className={styles.checkbox} {...register("published")} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
	);
}