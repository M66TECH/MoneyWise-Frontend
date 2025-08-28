import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative bg-background-surface rounded-lg shadow-xl w-full max-w-md p-6 border border-border" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;