import { Button } from "@/components/ui/button";
import React from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useTranslation } from "react-i18next";

const Pricing = ({ carDetail }) => {
  const { t, i18n } = useTranslation();

  if (!carDetail) {
    return null;
  }

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

  return (
    <div className="p-10 rounded-xl border shadow-md">
      <h2>{t("CarDetails.ourPrice")}</h2>

      <h2 className="font-bold text-4xl mt-1">
        {formatPrice(carDetail.sellingPrice)}{" "}
      </h2>

      <Button className="w-full mt-5" size="lg">
        <MdOutlineLocalOffer className="text-lg mr-2" />{" "}
        {t("CarDetails.makeAnOffer")}
      </Button>
    </div>
  );
};

export default Pricing;
