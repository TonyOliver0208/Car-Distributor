import React from "react";
import { useTranslation } from "react-i18next";

const InforSection = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                {t("findYourDreamRide")}
              </h2>

              <p className="mt-4 text-gray-700">
                {t("inforSectionDescription")}
              </p>
            </div>
          </div>

          <div>
            <img
              src="https://mclaren.scene7.com/is/image/mclaren/720S-Coupe_hero:crop-16x9?wid=1920&hei=1080"
              className="rounded"
              alt="Mclaren 720S Coupe"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InforSection;
