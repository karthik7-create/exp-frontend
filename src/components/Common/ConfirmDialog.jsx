import { useEffect } from 'react';
import { HiOutlineExclamationTriangle, HiOutlineTrash } from 'react-icons/hi2';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  isOpen = true,
  onClose,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const handleClose = onClose || onCancel;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose, loading]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) handleClose();
  };

  return (
    <div className="confirm-overlay" onClick={handleOverlayClick} role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="confirm-dialog">
        <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
          {variant === 'danger' ? <HiOutlineTrash /> : <HiOutlineExclamationTriangle />}
        </div>
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            {cancelText}
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
