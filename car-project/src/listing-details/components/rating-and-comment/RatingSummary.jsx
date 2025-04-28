import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, MessageSquare } from "lucide-react";

const RatingSummary = ({ fetchAverageRating, totalReviewsCount }) => {
  const [averageRating, setAverageRating] = useState(null); // Changed to null initially
  const { t } = useTranslation();

  useEffect(() => {
    fetchAverageRating().then((rating) => {
      setAverageRating(isNaN(rating) ? null : parseFloat(rating));
    });
  }, [fetchAverageRating]);

  const hasRatings = averageRating !== null && totalReviewsCount > 0;

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mb-6">
      <div>
        <h3 className="font-medium text-gray-700">
          {t("ratingAndComment.overallRating")}
        </h3>
        <div className="flex items-center mt-1">
          {hasRatings ? (
            <>
              <span className="text-3xl font-bold text-blue-600 mr-2">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                    fill={
                      star <= Math.round(averageRating) ? "#facc15" : "none"
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <span className="text-gray-500 italic">
              {t("ratingAndComment.noRatingsYet")}
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm text-gray-500">
          {totalReviewsCount} {t("ratingAndComment.totalReviews")}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <MessageSquare size={16} className="text-blue-500" />
          <span className="text-sm text-gray-600">
            {t("ratingAndComment.customerFeedback")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
