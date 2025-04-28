import Header from "@/components/Header";
import React, { useCallback, useEffect, useState } from "react";
import DetailHeader from "../components/DetailHeader";
import { useParams } from "react-router-dom";
import { db } from "./../../../configs";
import { CarImages, CarListing } from "./../../../configs/schema";
import { count, eq, and, ne, sql } from "drizzle-orm";
import Service from "@/Shared/Service";
import ImageGallery from "../components/ImageGallery";
import Description from "../components/Description";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Specification from "../components/Specification";
import OwnersDetail from "../components/OwnersDetail";
import FinancialCalculator from "../components/FinancialCalculator";
import RatingAndComment from "../components/RatingAndComment";
import Footer from "@/components/Footer";
import MostSearchedCar from "@/components/MostSearchedCar";
import { Reviews } from "./../../../configs/schema";

const ListingDetail = () => {
  const { id } = useParams();
  const [carDetail, setCarDetail] = useState();
  const [ownerReviewCount, setOwnerReviewCount] = useState(0);
  const [ownerAvgRating, setOwnerAvgRating] = useState(0);

  useEffect(() => {
    const fetchOwnerReviewStats = async () => {
      if (carDetail?.createdBy) {
        try {
          const result = await db
            .select({
              count: count(),
              avgRating: sql`ROUND(AVG(${Reviews.rating}), 1)`,
            })
            .from(Reviews)
            .innerJoin(CarListing, eq(Reviews.carListingId, CarListing.id))
            .where(
              and(
                eq(CarListing.createdBy, carDetail.createdBy),
                ne(Reviews.userEmail, carDetail.createdBy)
              )
            );

          setOwnerReviewCount(result[0]?.count || 0);
          setOwnerAvgRating(result[0]?.avgRating || 0);
        } catch (error) {
          console.error("Error fetching owner reviews:", error);
          setOwnerReviewCount(0);
          setOwnerAvgRating(0);
        }
      }
    };

    fetchOwnerReviewStats();
  }, [carDetail?.createdBy]);

  console.log(carDetail?.createdBy);

  const getCarDetail = useCallback(async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, id));

    const resp = Service.FormatResult(result);

    setCarDetail(resp[0]);
  }, [id]);

  useEffect(() => {
    getCarDetail();
  }, [getCarDetail]);

  return (
    <div>
      <Header />

      <div className="p-10 md:px-20">
        <DetailHeader carDetail={carDetail} />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5">
          <div className="md:col-span-2 ">
            <ImageGallery carDetail={carDetail} />

            <Description carDetail={carDetail} />

            {carDetail?.features && <Features features={carDetail.features} />}

            <FinancialCalculator carDetail={carDetail} />

            <RatingAndComment carListingId={carDetail?.id} />
          </div>

          <div>
            {carDetail && <Pricing carDetail={carDetail} />}

            <Specification carDetail={carDetail} />

            <OwnersDetail
              carDetail={carDetail}
              ownerReviewCount={ownerReviewCount}
              ownerAvgRating={ownerAvgRating}
            />
          </div>
        </div>
        <MostSearchedCar />
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;
