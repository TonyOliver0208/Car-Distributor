import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeleteReviewDialog = ({
  isDeleteAlertOpen,
  setIsDeleteAlertOpen,
  handleDeleteReview,
  reviewToDelete,
  t,
}) => (
  <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {t("ratingAndComment.confirmDeleteReviewTitle")}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("ratingAndComment.confirmDeleteReviewDescription")}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{t("ratingAndComment.cancel")}</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleDeleteReview(reviewToDelete)}>
          {t("ratingAndComment.delete")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteReviewDialog;
