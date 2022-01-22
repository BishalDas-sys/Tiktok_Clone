import MessagesIcon from "../icons/MessagesIcon";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

export default function MessagesButton({ post }) {
  const [comments] = useCollectionData(post.ref.collection("comments"));

  return (
    <Link
      to={`/${post.user.username}/video/${post.id}`}
      className="messages-button"
    >
      <MessagesIcon />
      <strong className="messages-button-count">{comments?.length}</strong>
    </Link>
  );
}
