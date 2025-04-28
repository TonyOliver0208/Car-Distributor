import React from "react";
import Search from "./Search";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col items-center p-10 py-20 gap-5 h-[650px] w-full bg-[#eef0fc]">
        <h2 className="text-lg">{t("findCarsNearYou")}</h2>
        <h2 className="text-[60px] font-bold">{t("findYourDreamCar")}</h2>
        <Search />
        <img src="/rolls_royce_PNG50.png" className=" w-[60%]" />
      </div>
    </div>
  );
};

export default Hero;
