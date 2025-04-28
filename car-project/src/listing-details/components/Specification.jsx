import IconField from "@/add-listing/components/IconField";
import CarSpecification from "@/Shared/CarSpecification";
import React from "react";
import { useTranslation } from "react-i18next";

const Specification = ({ carDetail }) => {
  const { t } = useTranslation();

  return (
    <div className="p-10 rounded-xl border shadow-md mt-7">
      <h2 className="font-medium text-2xl">{t("CarDetails.specifications")}</h2>
      {carDetail ? (
        CarSpecification.map((item, index) => (
          <div key={index} className="mt-5 flex items-center justify-between">
            <h2 className="flex gap-2">
              <IconField icon={item?.icon} /> {t(item.label)}
            </h2>
            <h2>{carDetail?.[item?.name] ?? "N/A"}</h2>
          </div>
        ))
      ) : (
        <div className="w-full h-[500px] rounded-xl bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
};

export default Specification;
