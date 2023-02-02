import Link from 'next/link';

export default function Custom404() {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <img
        src="https://media3.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif?cid=790b7611156eb5341d4e372b12c0d46ddf34f0ec12a1ca05&rid=giphy.gif&ct=g"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></img>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
}