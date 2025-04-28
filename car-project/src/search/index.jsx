import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Search from "@/components/Search";
import CarItem from "@/components/CarItem";
import { db } from "./../../configs";
import { CarImages, CarListing } from "./../../configs/schema";
import { eq, and, lte, or, like } from "drizzle-orm";
import Service from "@/Shared/Service";
import { useTranslation } from "react-i18next";

const SearchByOptions = () => {
  const [searchParam] = useSearchParams();
  const [carList, setCarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const condition = searchParam.get("cars");
  const make = searchParam.get("make");
  const price = searchParam.get("price");
  const carName = searchParam.get("car");
  const { t } = useTranslation();

  const getSearchResultText = () => {
    if (carName) {
      return `${t("searchOptions.searchFor")} "${carName}"`;
    }
    if (condition || make || price) {
      const filters = [];
      if (make) filters.push(`${t("searchOptions.for")} "${make}"`);
      if (condition) filters.push(` "${condition}"`);
      // else filters.push(`${t("searchOptions.searchResult")}`);
      return `${t("searchOptions.searchResult")}: ${filters.join(", ")}`;
    }
    return t("searchOptions.searchResult");
  };

  const getCarList = useCallback(async () => {
    try {
      let query = db
        .select()
        .from(CarListing)
        .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId));

      const conditions = [];
      if (condition) conditions.push(eq(CarListing.condition, condition));
      if (make) conditions.push(eq(CarListing.make, make));
      if (price) conditions.push(lte(CarListing.sellingPrice, price));

      if (carName) {
        const exactMatchQuery = query.where(
          and(...conditions, eq(CarListing.listingTitle, carName))
        );
        const exactMatchResult = await exactMatchQuery.execute();
        const exactMatchResp = Service.FormatResult(exactMatchResult);

        if (exactMatchResp.length > 0) {
          setCarList(exactMatchResp);
          setIsExactMatch(true);
          return;
        }

        const carNameParts = carName.split(" ");
        const carMake = carNameParts[0];
        conditions.push(
          or(
            like(CarListing.listingTitle, `%${carName}%`),
            eq(CarListing.make, carMake)
          )
        );
        setIsExactMatch(false);
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const result = await query.execute();
      const resp = Service.FormatResult(result);
      setCarList(resp);
    } catch (error) {
      console.error("Error fetching car list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [condition, make, price, carName]);

  useEffect(() => {
    getCarList();
  }, [getCarList]);

  return (
    <div>
      <Header />
      <div className="p-16 bg-black flex justify-center">
        <Search />
      </div>
      <div className="p-10 md:px-20">
        <h2 className="font-bold text-4xl">{getSearchResultText()}</h2>

        {!isLoading && !isExactMatch && carName && carList.length > 0 && (
          <div className="col-span-full flex justify-center items-center h-[100px]">
            <p className="text-xl text-gray-500">
              {t("searchOptions.noMatchingCar")}
            </p>
          </div>
        )}

        {!isLoading && carList.length === 0 && (
          <div className="col-span-full flex justify-center items-center h-[370px]">
            <p className="text-xl text-gray-500">
              {t("searchOptions.noResults")}
            </p>
          </div>
        )}

        {!isLoading && !isExactMatch && carName && carList.length > 0 && (
          <p className="font-bold text-4xl mt-3">
            {t("searchOptions.recommendedCars")}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {isLoading &&
            [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-[370px] rounded-xl bg-slate-200 animate-pulse"
              ></div>
            ))}

          {!isLoading &&
            carList.length > 0 &&
            carList.map((item, index) => (
              <div key={index}>
                <CarItem car={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchByOptions;
