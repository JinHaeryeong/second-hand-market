
import type { FC, ReactNode } from 'react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}
const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-content">{children}</div>
        {actions && (
          <div className='modal-actions'>{actions}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
