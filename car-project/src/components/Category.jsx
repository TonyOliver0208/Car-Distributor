import React from "react";
import Data from "../Shared/Data";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Category = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-40">
      <h2 className="font-bold text-3xl text-center mb-6">
        {t("browseByType")}
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 px-20">
        {Data.Category.map((category, index) => (
          <Link key={index} to={"search/" + category.name}>
            <div
              key={index}
              className="border rounded-xl p-3 items-center flex flex-col hover:shadow-md cursor-pointer"
            >
              <img
                src={category.icon}
                alt="Car Type Icon"
                width={35}
                height={35}
              />
              <h2 className="mt-2">{t(category.name)}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
