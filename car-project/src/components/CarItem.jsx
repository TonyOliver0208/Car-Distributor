import React from "react";
import { Separator } from "./ui/separator";
import { LuFuel } from "react-icons/lu";
import { TbBrandSpeedtest } from "react-icons/tb";
import { TbManualGearboxFilled } from "react-icons/tb";
import { IoMdOpen } from "react-icons/io";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CarItem = ({ car }) => {
  const { t, i18n } = useTranslation();

  const formatPrice = (price) => {
    if (i18n.language === "vi") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(price * 26000);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
    }
  };

  // const formatDate = (date) => {
  //   if (i18n.language === "vi") {
  //     return new Date(date).toLocaleDateString("vi-VN", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //   } else {
  //     return new Date(date).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //   }
  // };
  const formatDate = (date) => {
    const [day, month, year] = date.split("/");

    const formattedDate = new Date(`${year}-${month}-${day}`);

    if (i18n.language === "vi") {
      return formattedDate.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      return formattedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Link to={"/listing-details/" + car?.id}>
      <div className="rounded-xl bg-white border hover:shadow-md cursor-pointer relative">
        <div className="absolute m-2 w-[calc(100%-16px)] flex justify-between">
          <h2 className="bg-green-500 px-2 rounded-full text-sm text-white">
            {t(car?.condition)}
          </h2>
          <h2 className="bg-gray-500 px-2 rounded-full text-sm text-white shadow-sm">
            {formatDate(car?.postedOn)}
          </h2>
        </div>

        <img
          src={car?.images[0]?.imageUrl}
          width={"100%"}
          height={250}
          className="rounded-t-xl h-[180px] object-cover"
        />

        <div className="p-4">
          <h2 className="font-bold text-black text-lg mb-2 truncate w-full">
            {car?.listingTitle}
          </h2>
          <Separator />

          <div className="grid grid-cols-3 mt-5">
            <div className="flex flex-col items-center ">
              <LuFuel className="text-lg mb-2" />
              <h2 className="truncate w-full">
                {car?.mileage} {t("miles")}
              </h2>
            </div>

            <div className="flex flex-col items-center">
              <TbBrandSpeedtest className="text-lg mb-2" />
              <h2>{t(car?.fuelType)}</h2>
            </div>

            <div className="flex flex-col items-center">
              <TbManualGearboxFilled className="text-lg mb-2" />
              <h2>{t(car?.transmission)}</h2>
            </div>
          </div>
          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">
              {formatPrice(car.sellingPrice)}{" "}
            </h2>

            <h2 className="text-primary text-sm flex gap-2 items-center">
              <IoMdOpen />
              {t("viewDetails")}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarItem;
