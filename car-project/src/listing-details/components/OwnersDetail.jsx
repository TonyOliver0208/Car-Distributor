import { Button } from "@/components/ui/button";
import Service from "@/Shared/Service";
import { useUser, useClerk } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StarIcon } from "lucide-react";

const OwnersDetail = ({ carDetail, ownerReviewCount, ownerAvgRating }) => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigation = useNavigate();
  const { t } = useTranslation();

  const onMessageOwnerButtonClick = async () => {
    const userId = user.primaryEmailAddress?.emailAddress.split("@")[0];
    const ownerUserId = carDetail?.createdBy?.split("@")[0];

    try {
      await Service.CreateSendBirdUser(
        userId,
        user?.fullName,
        user?.imageUrl
      ).then((res) => {
        console.log(res);
      });
    } catch (e) {
      console.log(e);
    }

    try {
      await Service.CreateSendBirdUser(
        ownerUserId,
        carDetail?.userName,
        carDetail?.userImageUrl
      ).then((res) => {
        console.log(res);
      });
    } catch (e) {
      console.log(e);
    }

    try {
      await Service.CreateSendBirdChannel(
        [userId, ownerUserId],
        carDetail?.listingTitle
      ).then((res) => {
        console.log(res);
        console.log("Channel created");
        navigation("/profile");
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-10 border rounded-xl shadow-md mt-7">
      <h2 className="font-medium text-2xl mb-3">
        {t("CarDetails.ownerDetails")}
      </h2>
      <img
        src={carDetail?.userImageUrl}
        className="w-[70px] h-[70px] rounded-full"
        alt={carDetail?.userName}
      />
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <h2 className="font-bold text-xl">{carDetail?.userName}</h2>
        {ownerReviewCount > 0 ? (
          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              <StarIcon className="w-3 h-3 mr-1" />
              <span className="text-xs font-medium">{ownerAvgRating}</span>
            </div>
            <span className="text-xs text-gray-600">
              ({ownerReviewCount} {t("CarDetails.reviews")})
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">
            ({t("CarDetails.noReviewsYet")})
          </span>
        )}
      </div>

      <h2 className="mt-2 text-gray-500">{carDetail?.createdBy}</h2>

      {isSignedIn ? (
        <Button className="w-full mt-6" onClick={onMessageOwnerButtonClick}>
          {t("CarDetails.messageOwner")}
        </Button>
      ) : (
        <div className="mt-6 text-center text-gray-600">
          {t("CarDetails.please")}{" "}
          <span
            className="text-primary cursor-pointer underline"
            onClick={() => openSignIn({ redirectUrl: window.location.href })}
          >
            {t("CarDetails.logIn")}
          </span>{" "}
          {t("CarDetails.toMessageOwner")}
        </div>
      )}
    </div>
  );
};

export default OwnersDetail;
