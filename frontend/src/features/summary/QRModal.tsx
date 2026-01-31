import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: string;
  title?: string;
}

export function QRModal({ isOpen, onClose, qrData, title = 'Código QR del Pedido' }: QRModalProps) {
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
          <div className="flex justify-center bg-white p-4 rounded-lg">
            <QRCodeSVG value={qrData} size={256} level="M" />
          </div>
          <p className="text-secondary text-sm mt-4">
            Escanea este código QR para ver el pedido completo
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
