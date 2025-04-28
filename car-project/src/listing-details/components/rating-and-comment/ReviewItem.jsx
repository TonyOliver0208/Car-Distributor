import { useState } from "react";
import { Star, Edit, Trash2, CheckCircle } from "lucide-react"; // Added CheckCircle icon
import { Button } from "@/components/ui/button";

const ReviewItem = ({
  review,
  userId,
  carListing,
  handleEditReview,
  setReviewToDelete,
  setIsDeleteAlertOpen,
  t,
}) => {
  const [editingReview, setEditingReview] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);

  const isOwnerReview = carListing?.createdBy === review.userEmail;

  return (
    <div className="p-5 border rounded-xl bg-white hover:shadow-md transition-shadow shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={review.userImageUrl || "/placeholder-avatar.jpg"}
            alt={t("ratingAndComment.userAvatar")}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
          />
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold">{review.username}</p>
              {isOwnerReview && (
                <CheckCircle
                  size={16}
                  className="text-white"
                  style={{ backgroundColor: "#3b82f6", borderRadius: "9999px" }}
                />
              )}
            </div>
            {!isOwnerReview && review.rating && (
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                    fill={star <= review.rating ? "#facc15" : "none"}
                  />
                ))}
                <span className="ml-2 text-xs text-gray-500">
                  {review.rating === 5
                    ? t("ratingAndComment.excellent")
                    : review.rating === 4
                    ? t("ratingAndComment.veryGood")
                    : review.rating === 3
                    ? t("ratingAndComment.good")
                    : review.rating === 2
                    ? t("ratingAndComment.fair")
                    : t("ratingAndComment.poor")}
                </span>
              </div>
            )}
            {isOwnerReview && (
              <span className="mt-1 inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {t("ratingAndComment.ownerDealer")}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">
            {new Date(review.createdAt).toLocaleString()}
          </p>
          {!isOwnerReview && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {t("ratingAndComment.verifiedPurchase")}
            </span>
          )}
        </div>
      </div>

      <div className="pl-14">
        <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

        {review.userId === userId && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditingReview(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Edit size={14} />
              {t("ratingAndComment.edit")}
            </button>
            <button
              onClick={() => {
                setReviewToDelete(review.id);
                setIsDeleteAlertOpen(true);
              }}
              className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 size={14} />
              {t("ratingAndComment.delete")}
            </button>
          </div>
        )}

        {editingReview && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {!isOwnerReview && (
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEditRating(star)}
                    className={`transition-all hover:scale-110 ${
                      editRating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <Star
                      size={24}
                      fill={editRating >= star ? "#facc15" : "none"}
                      className="transition-colors"
                    />
                  </button>
                ))}
              </div>
            )}
            <textarea
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button
                onClick={() => setEditingReview(false)}
                variant="outline"
                size="sm"
              >
                {t("ratingAndComment.cancel")}
              </Button>
              <Button
                onClick={() => {
                  handleEditReview(
                    review.id,
                    isOwnerReview ? null : editRating,
                    editComment
                  );
                  setEditingReview(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {t("ratingAndComment.save")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
