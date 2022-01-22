import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import useAuthUser from "../context/userContext";
import InboxIcon from "../icons/InboxIcon";
import MessageIcon from "../icons/MessageIcon";
import UploadIcon from "../icons/UploadIcon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDetectClickOutside } from "react-detect-click-outside";

export default function Header() {
  const [user] = useAuthUser();
  const [isVisible, setVisible] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: () => setVisible(false) });

  const toggleDropdown = () => setVisible((prev) => !prev);

  if (!user) return null;

  return (
    <div className="h-container">
      <div className="h-content">
        <div className="h-wrapper">
          <Link to="/" className="h-link">
            <img src="/tiktok-logo.svg" alt="Tiktok" className="h-icon" />
          </Link>
        </div>
        <SearchBar />

        <div className="h-menu-right">
          <Link to="/upload" className="h-menu-upload">
            <UploadIcon />
          </Link>

          <MessageIcon />

          <InboxIcon />

          <div
            ref={ref}
            onClick={toggleDropdown}
            className="h-avatar-container"
          >
            <img src={user.photoURL} alt={user.username} className="h-avatar" />

            {isVisible && <Dropdown />}
          </div>
        </div>
      </div>
    </div>
  );
}
