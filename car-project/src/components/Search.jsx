import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { CiSearch } from "react-icons/ci";
import Data from "@/Shared/Data";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Search = () => {
  const [cars, setCars] = useState();
  const [make, setMake] = useState();
  const [price, setPrice] = useState();
  const { t } = useTranslation();

  const getSearchUrl = () => {
    const params = new URLSearchParams();
    if (cars) params.append("cars", cars);
    if (make) params.append("make", make);
    if (price) params.append("price", price);
    return `/search?${params.toString()}`;
  };

  return (
    <div className="p-2 md:p-5 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 px-5 items-center w-[60%]">
      <Select onValueChange={(value) => setCars(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder={t("cars")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">{t("new")}</SelectItem>
          <SelectItem value="Used">{t("used")}</SelectItem>
          <SelectItem value="Certified Pre-Owned">
            {t("certifiedPreOwned")}
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      <Select onValueChange={(value) => setMake(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder={t("carMakes")} />
        </SelectTrigger>
        <SelectContent>
          {Data.CarMakes.map((maker, index) => (
            <SelectItem key={maker.id} value={maker.name}>
              {maker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      <Select onValueChange={(value) => setPrice(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder={t("pricing")} />
        </SelectTrigger>
        <SelectContent>
          {Data.Pricing.map((price, index) => (
            <SelectItem key={price.id} value={price.amount}>
              {price.amount}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Link to={getSearchUrl()}>
        <CiSearch className="text-[50px] bg-primary rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer" />
      </Link>
    </div>
  );
};

export default Search;
