import React, { useState, useEffect } from "react";
import { db } from "../../../configs";
import { CarListing, Reviews } from "../../../configs/schema";
import { count, desc, eq, sql, inArray } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

const TrafficAnalysis = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [listingStats, setListingStats] = useState(null);
  const [topListings, setTopListings] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [makeData, setMakeData] = useState([]);
  const [hasListings, setHasListings] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;

      try {
        setLoading(true);

        const userListings = await db
          .select({ id: CarListing.id })
          .from(CarListing)
          .where(eq(CarListing.createdBy, userEmail));

        if (userListings.length === 0) {
          setHasListings(false);
          setLoading(false);
          return;
        }

        setHasListings(true);

        const userListingIds = userListings.map((listing) => listing.id);

        const totalListings = userListings.length;

        const totalReviewsResult = await db
          .select({ count: count() })
          .from(Reviews)
          .where(inArray(Reviews.carListingId, userListingIds));

        const totalReviews = totalReviewsResult[0].count;

        const categoryCounts = await db
          .select({
            category: CarListing.category,
            count: count(),
          })
          .from(CarListing)
          .where(eq(CarListing.createdBy, userEmail))
          .groupBy(CarListing.category);

        const makeCounts = await db
          .select({
            make: CarListing.make,
            count: count(),
          })
          .from(CarListing)
          .where(eq(CarListing.createdBy, userEmail))
          .groupBy(CarListing.make)
          .orderBy(desc(count()))
          .limit(5);

        const popularListings = await db
          .select({
            carListingId: Reviews.carListingId,
            reviewCount: count(Reviews.id),
            listingTitle: CarListing.listingTitle,
            make: CarListing.make,
            model: CarListing.model,
            year: CarListing.year,
          })
          .from(Reviews)
          .innerJoin(CarListing, eq(Reviews.carListingId, CarListing.id))
          .where(inArray(Reviews.carListingId, userListingIds))
          .groupBy(
            Reviews.carListingId,
            CarListing.listingTitle,
            CarListing.make,
            CarListing.model,
            CarListing.year
          )
          .orderBy(desc(count(Reviews.id)))
          .limit(10);

        const avgRatings = await db
          .select({
            carListingId: Reviews.carListingId,
            avgRating: sql`AVG(${Reviews.rating})`,
          })
          .from(Reviews)
          .where(inArray(Reviews.carListingId, userListingIds))
          .groupBy(Reviews.carListingId);

        const ratingsMap = new Map();
        avgRatings.forEach((item) => {
          ratingsMap.set(
            item.carListingId,
            parseFloat(item.avgRating).toFixed(1)
          );
        });

        const topListingsWithRatings = popularListings.map((listing) => ({
          ...listing,
          avgRating: ratingsMap.get(listing.carListingId) || "N/A",
        }));

        setListingStats({
          totalListings,
          totalReviews,
          avgReviewsPerListing: totalListings
            ? (totalReviews / totalListings).toFixed(1)
            : 0,
        });

        setCategoryData(
          categoryCounts.map((cat) => ({
            name: cat.category,
            value: cat.count,
          }))
        );
        setMakeData(
          makeCounts.map((make) => ({ name: make.make, count: make.count }))
        );
        setTopListings(topListingsWithRatings);
      } catch (error) {
        console.error("Error fetching traffic analysis data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const formatListingTitle = (title, make, model, year) => {
    if (title) return title;
    return `${year} ${make} ${model}`;
  };

  if (!userEmail) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please sign in to view your traffic analysis.
        </AlertDescription>
      </Alert>
    );
  }

  if (!loading && !hasListings) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">{t("traffic.title")}</h1>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Listings Found</AlertTitle>
          <AlertDescription>
            You haven&apos;t created any car listings yet. Create your first
            listing to start tracking its performance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("traffic.title")}</h1>

      {!userEmail && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("traffic.authRequired.title")}</AlertTitle>
          <AlertDescription>
            {t("traffic.authRequired.description")}
          </AlertDescription>
        </Alert>
      )}

      {!loading && !hasListings && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("traffic.noListings.title")}</AlertTitle>
          <AlertDescription>
            {t("traffic.noListings.description")}
          </AlertDescription>
        </Alert>
      )}

      {userEmail && hasListings && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {t("traffic.stats.myListings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold">
                    {listingStats?.totalListings || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {t("traffic.stats.reviews")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold">
                    {listingStats?.totalReviews || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {t("traffic.stats.avgReviews")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold">
                    {listingStats?.avgReviewsPerListing || 0}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("traffic.charts.byCategory")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center h-full flex items-center justify-center text-gray-500">
                    {t("traffic.noCategoryData")}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("traffic.charts.topMakes")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : makeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={makeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center h-full flex items-center justify-center text-gray-500">
                    {t("traffic.noMakeData")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("traffic.topListings.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : topListings.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("traffic.topListings.rank")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("traffic.topListings.listing")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("traffic.topListings.rating")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("traffic.topListings.comments")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topListings.map((listing, index) => (
                        <tr key={listing.carListingId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatListingTitle(
                              listing.listingTitle,
                              listing.make,
                              listing.model,
                              listing.year
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.avgRating}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.reviewCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500">
                  {t("traffic.topListings.noData")}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TrafficAnalysis;
