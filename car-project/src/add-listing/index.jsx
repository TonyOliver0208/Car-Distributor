import Header from "@/components/Header";
import React, { useCallback, useEffect, useState } from "react";
import carDetails from "./../Shared/carDetails.json";
import features from "./../Shared/features.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TextAreaField from "./components/TextAreaField";
import { db } from "./../../configs";
import { CarImages, CarListing } from "./../../configs/schema";
import IconField from "./components/IconField";
import UploadImages from "./components/UploadImages";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";
import { eq } from "drizzle-orm";
import Service from "@/Shared/Service";

const AddListing = () => {
  const [formData, setFormData] = useState([]);
  const [featuresData, setFeaturesData] = useState([]);
  const [triggerUploadImages, setTriggerUploadImages] = useState(null);
  const [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get("mode");
  const recordId = searchParams.get("id");

  const getListingDetail = useCallback(async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, recordId));

    const resp = Service.FormatResult(result);

    setCarInfo(resp[0]);
    setFormData(resp[0]);
    setFeaturesData(resp[0].features);
  }, [recordId]);

  useEffect(() => {
    if (mode == "edit") {
      getListingDetail();
    }
  }, [getListingDetail, mode]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFeatureChange = (name, value) => {
    setFeaturesData((prevData) => ({ ...prevData, [name]: value }));

    console.log(featuresData);
  };

  const validateForm = () => {
    const requiredFields = carDetails.carDetails.filter(
      (item) => item.required
    );
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        toast.error(`Please fill in the ${field.label} field.`);
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!validateForm()) {
      setLoader(false);
    }
    const toastId = toast.loading("Saving your listing...");

    if (!user?.primaryEmailAddress?.emailAddress || !user?.fullName) {
      toast.error("User information is missing. Please log in again.");
      setLoader(false);
      return;
    }

    try {
      if (mode === "edit") {
        const result = await db
          .update(CarListing)
          .set({
            ...formData,
            features: featuresData,
            createdBy: user.primaryEmailAddress.emailAddress,
            userName: user.fullName,
            userImageUrl: user.imageUrl,
            postedOn: moment().format("DD/MM/yyyy"),
          })
          .where(eq(CarListing.id, recordId))
          .returning({ id: CarListing.id });

        toast.success("Listing updated successfully!");
        navigate("/profile");
      } else {
        const result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            createdBy: user.primaryEmailAddress.emailAddress,
            userName: user.fullName,
            userImageUrl: user.imageUrl,
            postedOn: moment().format("DD/MM/yyyy"),
          })
          .returning({ id: CarListing.id });

        // if (result?.[0]?.id) {
        //   setTriggerUploadImages(result[0].id);
        // }
        if (result?.[0]?.id) {
          setTriggerUploadImages(result[0].id);
          setTimeout(() => {
            setTriggerUploadImages(null);
          }, 1000);
          toast.success("Listing created successfully!");
        }
      }
    } catch (err) {
      console.error("Error saving listing:", err);
      toast.error("Failed to save listing. Please try again.");
      setLoader(false);
    } finally {
      setLoader(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">Add New Listing</h2>
        <form className="p-10 border rounded-xl mt-10" onSubmit={onSubmit}>
          {/* Car Details */}
          <div>
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {carDetails.carDetails.map((item, index) => (
                <div key={index}>
                  <label className="text-sm flex gap-2 items-center mb-1">
                    <IconField icon={item?.icon} />
                    {item?.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Features */}
          <div>
            <h2 className="font-medium text-xl my-6">Features</h2>
            <div className="grid grid-rows-2 md:grid-cols-3 gap-2">
              {features.features.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Checkbox
                    onCheckedChange={(value) =>
                      handleFeatureChange(item.name, value)
                    }
                    checked={featuresData?.[item.name]}
                  />
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Image Upload */}
          <UploadImages
            triggerUploadImages={triggerUploadImages}
            carInfo={carInfo}
            mode={mode}
            setLoader={(v) => {
              setLoader(v);
              navigate("/profile");
            }}
          />

          <div className="mt-10 flex justify-end">
            <Button type="submit" disabled={loader}>
              {loader ? (
                <AiOutlineLoading3Quarters className="animate-spin text-lg mr-2" />
              ) : null}
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
