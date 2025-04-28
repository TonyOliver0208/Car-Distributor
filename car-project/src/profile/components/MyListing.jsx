import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./../../../configs";
import { CarImages, CarListing } from "./../../../configs/schema";
import { desc, eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";
import Service from "./../../Shared/Service";
import CarItem from "@/components/CarItem";
import { FaTrashAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateSignature } from "./../../../helpers/cloudinary-helper";
import { useTranslation } from "react-i18next"; // Import useTranslation

const MyListing = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { user } = useUser();
  const [carList, setCarList] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getUserCarListing = useCallback(async () => {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(CarListing.id));

    const resp = Service.FormatResult(result);
    setCarList(resp);

    console.log(resp);
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    user && getUserCarListing();
  }, [user, getUserCarListing]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const images = await db
        .select()
        .from(CarImages)
        .where(eq(CarImages.carListingId, deleteId));

      const deletePromises = images.map(async (image) => {
        const { publicId } = image;
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
        const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = await generateSignature(publicId, timestamp);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              public_id: publicId,
              timestamp: timestamp,
              api_key: apiKey,
              signature: signature,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete image from Cloudinary");
        }
      });

      await Promise.all(deletePromises);

      await db.delete(CarImages).where(eq(CarImages.carListingId, deleteId));

      await db.delete(CarListing).where(eq(CarListing.id, deleteId));

      setCarList((prevList) => prevList.filter((car) => car.id !== deleteId));
    } catch (error) {
      console.error("Error deleting car listing:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-4xl">{t("myListing.title")}</h2>
        <Link to={"/add-listing"}>
          <Button>{t("myListing.addNewListing")}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
        {carList.map((item, index) => (
          <div key={index}>
            <CarItem car={item} />

            <div className="p-2 bg-gray-50 rounded-lg flex justify-between gap-3">
              <Link
                to={"/add-listing?mode=edit&id=" + item?.id}
                className="flex-grow"
              >
                <Button variant="outline" className="w-full cursor-pointer">
                  {t("myListing.edit")}
                </Button>
              </Link>

              <Button
                variant="destructive"
                className="flex-none"
                onClick={() => openDeleteModal(item.id)}
              >
                <FaTrashAlt />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myListing.confirmDelete")}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t("myListing.deleteWarning")}</p>
          <DialogFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("myListing.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("myListing.deleting") : t("myListing.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListing;
