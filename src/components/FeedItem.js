import FollowButton from "../components/FollowButton";
import LikeButton from "../components/LikeButton";
import MessagesButton from "../components/MessagesButton";
import MuteButton from "../components/MuteButton";
import PauseButton from "../components/PauseButton";
import ShareButton from "../components/ShareButton";
import useVideo from "../hooks/useVideo";
import MusicIcon from "../icons/MusicIcon";
import { formatDraftText } from "../lib/draft-utils";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeedItem({ post }) {
  return (
    <div className="fi-container">
      <Link to={`/${post.user.username}`} className="fi-avatar-link">
        <span className="fi-avatar">
          <img src={post.user.photoURL} alt={post.user.username} />
        </span>
      </Link>
      <div className="fi-info">
        <div className="fi-author">
          <Link to={`/${post.user.username}`}>
            <h3 className="fi-username">{post.user.username}</h3>
          </Link>
          <Link to={`/${post.user.username}`}>
            <h4 className="fi-displayName">{post.user.displayName}</h4>
          </Link>
        </div>
        <div
          className="fi-caption"
          dangerouslySetInnerHTML={{ __html: formatDraftText(post.caption) }}
        />
        <FollowButton post={post} />
        <div className="fi-music-container">
          <h4>
            <div className="fi-music">
              <MusicIcon />
              {post.audio_name}
            </div>
          </h4>
        </div>
        <FeedItemVideo post={post} />
      </div>
    </div>
  );
}

function FeedItemVideo({ post }) {
  const {
    videoRef,
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    setPlaying,
  } = useVideo();

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: [0.9, 1],
    };

    function playVideo(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setPlaying(true);
        } else {
          videoRef.current?.pause();
          setPlaying(false);
        }
      });
    }

    const observer = new IntersectionObserver(playVideo, options);

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fiv-container">
      <div className="fiv-wrapper">
        <div className="fiv-inner">
          <div className="fiv-video-container">
            <video
              ref={videoRef}
              src={post.videoUrl}
              playsInline
              loop
              muted={isMuted}
              className="fiv-video"
            />
            <MuteButton toggleMute={toggleMute} isMuted={isMuted} />
            <PauseButton isPlaying={isPlaying} togglePlay={togglePlay} />
          </div>
        </div>
      </div>
      <div className="fiv-action-bar">
        <LikeButton post={post} />
        <MessagesButton post={post} />
        <ShareButton />
      </div>
    </div>
  );
}
