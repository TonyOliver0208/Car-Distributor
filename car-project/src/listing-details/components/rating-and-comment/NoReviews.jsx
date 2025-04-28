import { MessageSquare } from "lucide-react";

const NoReviews = ({ t }) => (
  <div className="p-8 border rounded-xl bg-gray-50 text-center">
    <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
    <p className="text-gray-500 mb-2">{t("ratingAndComment.noReviewsYet")}</p>
    <p className="text-sm text-gray-400">
      {t("ratingAndComment.beTheFirstToReview")}
    </p>
  </div>
);

export default NoReviews;
