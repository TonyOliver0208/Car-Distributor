import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";

const ReviewForm = ({
  user,
  rating,
  setRating,
  comment,
  setComment,
  handleSubmit,
  USER_IMAGE,
  t,
  isOwner,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="border border-blue-300 rounded-xl p-5 shadow-sm bg-white mb-8 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={user?.imageUrl || USER_IMAGE || "/placeholder-avatar.jpg"}
          alt={t("ratingAndComment.userAvatar")}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 mb-2">
            {user?.fullName || t("ratingAndComment.anonymous")}
            {isOwner && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {t("ratingAndComment.listingOwner")}
              </span>
            )}
          </p>

          {!isOwner && (
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) >= star ? "#facc15" : "none"}
                    className={`transition-colors ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center">
                {rating > 0
                  ? rating === 5
                    ? t("ratingAndComment.excellent")
                    : rating === 4
                    ? t("ratingAndComment.veryGood")
                    : rating === 3
                    ? t("ratingAndComment.good")
                    : rating === 2
                    ? t("ratingAndComment.fair")
                    : t("ratingAndComment.poor")
                  : ""}
              </span>
            </div>
          )}

          <textarea
            rows={4}
            placeholder={
              isOwner
                ? t("ratingAndComment.ownerPlaceholder")
                : t("ratingAndComment.guestPlaceholder")
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-4 text-gray-400 text-sm">
          <button
            className="hover:text-blue-500 transition-colors flex items-center gap-1"
            title={t("ratingAndComment.formatting.bold")}
          >
            <strong>B</strong>
          </button>
          <button
            className="hover:text-blue-500 transition-colors italic flex items-center gap-1"
            title={t("ratingAndComment.formatting.italic")}
          >
            I
          </button>
          <button
            className="hover:text-blue-500 transition-colors underline flex items-center gap-1"
            title={t("ratingAndComment.formatting.insertLink")}
          >
            🔗
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <ThumbsUp size={16} />
          {t("ratingAndComment.comment")}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
