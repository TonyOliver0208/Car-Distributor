import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { useDropzone } from "react-dropzone";
import Data from "@/Shared/Data";
import { useTranslation } from "react-i18next";
import { IoMdCloseCircle } from "react-icons/io";
import { Loader2 } from "lucide-react";

const SearchBar = ({ close }) => {
  const { t } = useTranslation();
  const [cars, setCars] = useState("");
  const [make, setMake] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const removeImage = () => {
    setImage(null);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch(
          "https://car-model-server.onrender.com/predict/",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.car) {
          window.location.href = `/search?car=${data.car}`;
        } else {
          console.error("Search failed: No car predicted");
        }
      } else {
        const searchParams = new URLSearchParams();
        if (cars) searchParams.append("cars", cars);
        if (make) searchParams.append("make", make);
        if (price) searchParams.append("price", price);

        if (searchParams.toString()) {
          window.location.href = `/search?${searchParams.toString()}`;
        } else {
          console.error("No search criteria provided");
        }
      }
    } catch (error) {
      console.error("Error during image search:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t("advanceSearchCars")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select onValueChange={(value) => setCars(value)}>
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <SelectValue placeholder={t("condition")} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            <SelectItem value="New">{t("new")}</SelectItem>
            <SelectItem value="Used">{t("used")}</SelectItem>
            <SelectItem value="Certified Pre-Owned">
              {t("certifiedPreOwned")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setMake(value)}>
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <SelectValue placeholder={t("make")} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {Array.isArray(Data?.CarMakes) ? (
              Data?.CarMakes.map((maker) => (
                <SelectItem key={maker.id} value={maker.name}>
                  {maker.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled>{t("noData")}</SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setPrice(value)}>
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <SelectValue placeholder={t("price")} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {Data?.Pricing?.map((price) => (
              <SelectItem key={price.id} value={price.amount}>
                {price.amount}
              </SelectItem>
            )) || <SelectItem disabled>{t("noPricingData")}</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors min-h-[150px] flex items-center justify-center"
      >
        <input {...getInputProps()} />
        {image ? (
          <div className="relative w-full">
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded car preview"
                className="max-h-40 object-contain rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <IoMdCloseCircle className="text-red-500 text-xl" />
            </button>
            <p className="mt-2 text-sm text-gray-500">
              {image.name} ({Math.round(image.size / 1024)} KB)
            </p>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">{t("dropImageHere")}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-500">{t("dragDropImage")}</p>
            <p className="text-xs text-gray-400">
              {t("supportedFormats")}: JPG, JPEG, PNG
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={close}
          className="bg-gray-50 border border-gray-200 hover:bg-gray-100"
          disabled={loading}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          disabled={loading || (!image && !cars && !make && !price)}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> {t("searching")}
            </>
          ) : (
            <>
              <CiSearch className="mr-2" /> {t("search")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
