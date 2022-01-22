import Modal from "../components/Modal";
import useSuccessModal from "../context/successModalContext";

export default function SuccessModal({ onConfirm, onCancel }) {
  const { isSuccessOpen, closeSuccess } = useSuccessModal();

  return (
    <Modal open={isSuccessOpen} onClose={closeSuccess}>
      <div className="success-modal-container">
        <div className="success-modal-title-container">
          <div className="success-modal-title">Your video is being</div>
          <div className="success-modal-subtitle">uploaded to Tiktok</div>
        </div>
        <button className="success-modal-discard" onClick={onConfirm}>
          Upload another video
        </button>
        <button className="success-modal-confirm" onClick={onCancel}>
          View profile
        </button>
      </div>
    </Modal>
  );
}
