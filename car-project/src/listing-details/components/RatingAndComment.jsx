import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { db } from "./../../../configs";
import { Reviews, CarListing } from "./../../../configs/schema";
import { count, desc, eq, and, asc, sql } from "drizzle-orm";

import USER_IMAGE from "/car_dealer_logo_transparent.svg";
import RatingSummary from "./rating-and-comment/RatingSummary";
import ReviewForm from "./rating-and-comment/ReviewForm";
import LoginPrompt from "./rating-and-comment/LoginPrompt";
import ReviewControls from "./rating-and-comment/ReviewControls";
import ReviewItem from "./rating-and-comment/ReviewItem";
import NoReviews from "./rating-and-comment/NoReviews";
import Pagination from "./rating-and-comment/Pagination";
import DeleteReviewDialog from "./rating-and-comment/DeleteReviewDialog";

const ITEMS_PER_PAGE = 5;

const RatingAndComment = ({ carListingId }) => {
  const { t } = useTranslation();
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [carListing, setCarListing] = useState(null);
  const [sortBy, setSortBy] = useState("mostRecent");
  const [filterByRating, setFilterByRating] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);

  const isOwner =
    carListing?.createdBy === user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchCarListing = async () => {
      try {
        const result = await db
          .select()
          .from(CarListing)
          .where(eq(CarListing.id, carListingId))
          .limit(1);

        if (result.length > 0) {
          setCarListing(result[0]);
        }
      } catch (error) {
        console.error("Failed to fetch car listing:", error);
      }
    };

    if (carListingId) {
      fetchCarListing();
    }
  }, [carListingId]);

  const fetchComments = useCallback(
    async (page) => {
      if (!carListingId) return;

      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;

        let orderBy;
        switch (sortBy) {
          case "highestRating":
            orderBy = desc(Reviews.rating);
            break;
          case "lowestRating":
            orderBy = asc(Reviews.rating);
            break;
          default:
            orderBy = desc(Reviews.createdAt);
        }

        let whereClause = eq(Reviews.carListingId, carListingId);
        if (filterByRating) {
          whereClause = and(
            eq(Reviews.carListingId, carListingId),
            eq(Reviews.rating, filterByRating)
          );
        }

        const reviewsResult = await db
          .select()
          .from(Reviews)
          .where(whereClause)
          .orderBy(orderBy)
          .limit(ITEMS_PER_PAGE)
          .offset(offset);

        const totalCount = await db
          .select({ count: count() })
          .from(Reviews)
          .where(whereClause);

        setTotalPages(Math.ceil(totalCount[0].count / ITEMS_PER_PAGE));
        setTotalReviewsCount(totalCount[0].count);

        const processedReviews = reviewsResult.map((review) => ({
          ...review,
          username: review.userName || review.userEmail.split("@")[0],
          userImageUrl: review.userImageUrl || "/placeholder-avatar.jpg",
        }));

        setComments(processedReviews);
      } catch (error) {
        toast.error(t("ratingAndComment.errors.failedToFetchReviews"));
        console.error("Error fetching reviews:", error);
      }
    },
    [carListingId, sortBy, filterByRating, t]
  );

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage, fetchComments]);

  const handleSubmit = async () => {
    if (!isSignedIn) {
      toast.error(t("ratingAndComment.errors.pleaseLogIn"));
      openSignIn({ redirectUrl: window.location.href });
      return;
    }

    const isOwner =
      carListing?.createdBy === user?.primaryEmailAddress?.emailAddress;

    if (isOwner && rating > 0) {
      toast.error(t("ratingAndComment.errors.ownerCannotRate"));
      return;
    }

    if (!isOwner && !rating) {
      toast.error(t("ratingAndComment.errors.selectRating"));
      return;
    }

    if (!comment.trim()) {
      toast.error(t("ratingAndComment.errors.writeComment"));
      return;
    }

    try {
      await db.insert(Reviews).values({
        carListingId,
        userId,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        rating: isOwner ? null : rating,
        comment,
        userName: user?.fullName,
        userImageUrl: user?.imageUrl,
      });

      toast.success(t("ratingAndComment.success.reviewSubmitted"));
      setRating(0);
      setComment("");
      setCurrentPage(1);
      fetchComments(1);
    } catch (error) {
      toast.error(t("ratingAndComment.errors.failedToSubmit"));
      console.error(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isSignedIn) {
      toast.error(t("ratingAndComment.errors.pleaseLogIn"));
      return;
    }

    try {
      await db.delete(Reviews).where(eq(Reviews.id, reviewId));
      toast.success(t("ratingAndComment.success.reviewDeleted"));
      fetchComments(currentPage);
    } catch (error) {
      toast.error(t("ratingAndComment.errors.failedToDelete"));
      console.error(error);
    } finally {
      setIsDeleteAlertOpen(false);
    }
  };

  const handleEditReview = async (reviewId, newRating, newComment) => {
    if (!isSignedIn) {
      toast.error(t("ratingAndComment.errors.pleaseLogIn"));
      return;
    }

    try {
      await db
        .update(Reviews)
        .set({ rating: newRating, comment: newComment })
        .where(eq(Reviews.id, reviewId));
      toast.success(t("ratingAndComment.success.reviewUpdated"));
      fetchComments(currentPage);
    } catch (error) {
      toast.error(t("ratingAndComment.errors.failedToUpdate"));
      console.error(error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const result = await db
        .select({ avgRating: sql`AVG(${Reviews.rating})` })
        .from(Reviews)
        .where(eq(Reviews.carListingId, carListingId));
      return parseFloat(result[0].avgRating).toFixed(1);
    } catch (error) {
      console.error("Failed to fetch average rating:", error);
      return "0.0";
    }
  };

  return (
    <div className="mt-10 p-6 border rounded-2xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MessageSquare className="text-blue-500" />
        {t("ratingAndComment.leaveReview")}
      </h2>

      <RatingSummary
        fetchAverageRating={fetchAverageRating}
        totalReviewsCount={totalReviewsCount}
      />

      <ReviewForm
        user={user}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        handleSubmit={handleSubmit}
        USER_IMAGE={USER_IMAGE}
        t={t}
        isOwner={isOwner}
      />

      {!isSignedIn && <LoginPrompt openSignIn={openSignIn} t={t} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="text-blue-500" />
          {t("ratingAndComment.reviews")}
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totalReviewsCount})
            </span>
          )}
        </h3>

        <ReviewControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterByRating={filterByRating}
          setFilterByRating={setFilterByRating}
          t={t}
        />
      </div>

      <div className="space-y-6">
        {comments.length > 0 ? (
          <>
            {comments.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                userId={userId}
                carListing={carListing}
                handleEditReview={handleEditReview}
                setReviewToDelete={setReviewToDelete}
                setIsDeleteAlertOpen={setIsDeleteAlertOpen}
                t={t}
              />
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        ) : (
          <NoReviews t={t} />
        )}
      </div>

      <DeleteReviewDialog
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        handleDeleteReview={handleDeleteReview}
        reviewToDelete={reviewToDelete}
        t={t}
      />
    </div>
  );
};

export default RatingAndComment;
