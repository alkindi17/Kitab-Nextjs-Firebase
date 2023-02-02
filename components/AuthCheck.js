import { UserContext } from "@/lib/context";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Loader from "./Loader";

function AuthCheck(props) {


	const { username } = useContext(UserContext)
	
	return (
		username ? props.children : props.fallback || <Link href={"/enter"}>You must be signed in</Link>
	);

	
}

export default AuthCheck;