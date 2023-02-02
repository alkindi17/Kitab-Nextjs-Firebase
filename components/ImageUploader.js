import { storage, STATE_CHANGED } from "@/lib/firebase";
import { useState } from "react";
import Loader from "./Loader";
import { auth } from "@/lib/firebase";

function ImageUploader() {

	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadURL, setdownloadURL] = useState(null)

	const uploadFile = async (e) => {
		
		const file = e.target.files[0]
		const extension = (file.type.split('/')[1])
		const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
		setUploading(true);

		const task = ref.put(file);

		task.on(STATE_CHANGED, (snapshot) => {
			const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
			setProgress(pct);

			task
				.then((d) => ref.getDownloadURL())
				.then((url) => {
					setdownloadURL(url);
					setUploading(false)
				});
		});
	}

	return (
		<div className="box">
			<Loader show={uploading} />

			{!uploading && (
				<>
					<label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>	
				</>
			)}

			{downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}

		</div>
	);
}

export default ImageUploader;