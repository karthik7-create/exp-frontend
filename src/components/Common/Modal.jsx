import { useEffect, useCallback } from 'react';
import { HiXMark } from 'react-icons/hi2';
import './Modal.css';

export default function Modal({ isOpen = true, onClose, title, children, size }) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal ${size === 'lg' ? 'modal--lg' : ''}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <HiXMark />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
