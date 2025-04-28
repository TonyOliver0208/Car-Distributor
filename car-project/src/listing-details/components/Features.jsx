import React from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";

const Features = ({ features = {} }) => {
  const { t } = useTranslation();

  console.log(features);
  return (
    <div className="p-10 border shadow-md rounded-xl my-7">
      <h2 className="font-medium text-2xl">{t("CarDetails.features")}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 mt-5 lg:grid-cols-4 gap-7">
        {Object.entries(features || {}).map(([key, value]) => (
          <div key={key} className="flex gap-2 items-center">
            <FaCheck className="text-lg p-1 rounded-full bg-blue-100 text-primary" />
            <h2>{key}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
