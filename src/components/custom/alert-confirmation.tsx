import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface AlertConfirmationProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onConfirmText?: string;
  onCancel?: () => void;
  onCancelText?: string;
  children: React.ReactNode;
}

export const AlertConfirmation = ({
  title = "Konfirmasi penghapusan data",
  description = "Apakah anda yakin ingin menghapus data ini? Data yang akan dihapus tidak dapat dibatalkan.",
  onConfirm = () => {},
  onConfirmText = "Ya",
  onCancel = () => {},
  onCancelText = "Tidak",
  children,
}: AlertConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {onCancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {onConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
