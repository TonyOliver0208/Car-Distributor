// // import { storage } from "configs/firebaseConfig";
// // import { ref } from "firebase/storage";
// import { Button } from "@/components/ui/button";
// import React, { useCallback, useEffect, useState } from "react";
// import { IoMdCloseCircle } from "react-icons/io";
// import { CarImages } from "./../../../configs/schema";
// import { uploadToCloudinary } from "./../../../helpers/cloudinary-helper";
// import { db } from "../../../configs";
// import { eq } from "drizzle-orm";
// import { toast } from "sonner";

// const UploadImages = ({ triggerUploadImages, setLoader, carInfo, mode }) => {
//   const [selectedFileList, setSelectedFileList] = useState([]);
//   const [editCarImageList, setEditCarImageList] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);

//   const supportedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

//   useEffect(() => {
//     if (mode === "edit") {
//       setEditCarImageList([]);
//       carInfo?.images.forEach((image) => {
//         setEditCarImageList((prev) => [...prev, image?.imageUrl]);
//       });
//     }
//   }, [mode, carInfo?.images]);

//   const onFileSelected = (event) => {
//     const files = event.target.files;
//     const validFiles = [];

//     for (let i = 0; i < files?.length; i++) {
//       const file = files[i];
//       // setSelectedFileList((prev) => [...prev, file]);
//       if (supportedImageTypes.includes(file.type)) {
//         validFiles.push(file);
//       } else {
//         toast.error(
//           `Unsupported file type: ${file.name}. Only JPG, JPEG, and PNG are allowed.`
//         );
//       }
//     }
//     setSelectedFileList((prev) => [...prev, ...validFiles]);
//   };

//   const onImageRemove = (img) => {
//     const result = selectedFileList.filter((item) => item != img);
//     setSelectedFileList(result);
//   };

//   const onImageRemoveFromDB = async (img, index) => {
//     const result = await db
//       .delete(CarImages)
//       .where(eq(CarImages.id, carInfo?.images[index]?.id))
//       .returning({ id: CarImages.id });

//     const imageList = editCarImageList.filter((item) => item != img);
//     setEditCarImageList(imageList);
//   };

//   const uploadImagesToServer = useCallback(async () => {
//     if (!triggerUploadImages || isUploading) return;

//     setIsUploading(true);
//     setLoader(true);
//     try {
//       const uploadPromises = selectedFileList.map(async (file) => {
//         const uploadResult = await uploadToCloudinary(file);

//         if (!uploadResult.url || !uploadResult.publicId) {
//           throw new Error("Invalid Cloudinary response");
//         }

//         const result = await db
//           .insert(CarImages)
//           .values({
//             imageUrl: uploadResult.url,
//             publicId: uploadResult.publicId,
//             carListingId: triggerUploadImages,
//           })
//           .returning({ id: CarImages.id });

//         return result;
//       });

//       await Promise.all(uploadPromises);
//       setSelectedFileList([]);
//     } catch (error) {
//       console.error("Error uploading images:", error);
//     } finally {
//       setIsUploading(false);
//       setLoader(false);
//     }
//   }, [selectedFileList, setLoader, triggerUploadImages, isUploading]);

//   useEffect(() => {
//     if (triggerUploadImages) {
//       uploadImagesToServer();
//     }
//   }, [triggerUploadImages, uploadImagesToServer]);

//   return (
//     <div>
//       <h2 className="font-medium text-xl my-3">Upload Car Images</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
//         {mode === "edit" &&
//           editCarImageList.map((img, index) => (
//             <div key={index} className="relative">
//               <IoMdCloseCircle
//                 className="absolute m-2 text-lg text-white cursor-pointer"
//                 onClick={(event) => {
//                   event.stopPropagation(); // Stop event bubbling
//                   onImageRemoveFromDB(img, index);
//                 }}
//               />

//               <img
//                 src={img}
//                 className="w-full h-[130px] object-cover rounded-xl"
//               />
//             </div>
//           ))}

//         {selectedFileList.map((img, index) => (
//           <div key={index} className="relative">
//             <IoMdCloseCircle
//               className="absolute m-2 text-lg text-white cursor-pointer"
//               onClick={(event) => {
//                 event.stopPropagation(); // Stop the click event from propagating
//                 onImageRemove(img);
//               }}
//             />

//             <img
//               src={URL.createObjectURL(img)}
//               className="w-full h-[130px] object-cover rounded-xl"
//             />
//           </div>
//         ))}
//         <label htmlFor="upload-images" className="cursor-pointer">
//           <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 hover:shadow-md">
//             <h2 className="text-lg text-center text-primary">+</h2>
//           </div>
//         </label>

//         <input
//           type="file"
//           multiple
//           id="upload-images"
//           onChange={onFileSelected}
//           className="hidden"
//           accept=".jpg,.jpeg,.png"
//         />
//       </div>
//     </div>
//   );
// };

// export default UploadImages;

// import { storage } from "configs/firebaseConfig";
// import { ref } from "firebase/storage";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { CarImages } from "./../../../configs/schema";
import { uploadToCloudinary } from "./../../../helpers/cloudinary-helper";
import { db } from "../../../configs";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

const UploadImages = ({ triggerUploadImages, setLoader, carInfo, mode }) => {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [editCarImageList, setEditCarImageList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const supportedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  useEffect(() => {
    if (mode === "edit") {
      setEditCarImageList([]);
      carInfo?.images.forEach((image) => {
        setEditCarImageList((prev) => [...prev, image?.imageUrl]);
      });
    }
  }, [mode, carInfo?.images]);

  const onFileSelected = (event) => {
    const files = event.target.files;

    // Check if user already has an image (either existing or newly selected)
    const hasExistingImage =
      editCarImageList.length > 0 || selectedFileList.length > 0;

    if (hasExistingImage) {
      toast.error(
        "You can only upload one image. Please remove the existing image first."
      );
      return;
    }

    if (files.length > 1) {
      toast.error("You can only upload one image at a time.");
      return;
    }

    const file = files[0];

    if (!supportedImageTypes.includes(file.type)) {
      toast.error(
        `Unsupported file type: ${file.name}. Only JPG, JPEG, and PNG are allowed.`
      );
      return;
    }

    setSelectedFileList([file]); // Store only one file
  };

  const onImageRemove = () => {
    setSelectedFileList([]);
  };

  const onImageRemoveFromDB = async (img, index) => {
    const result = await db
      .delete(CarImages)
      .where(eq(CarImages.id, carInfo?.images[index]?.id))
      .returning({ id: CarImages.id });

    setEditCarImageList([]);
  };

  const uploadImagesToServer = useCallback(async () => {
    if (!triggerUploadImages || isUploading || selectedFileList.length === 0)
      return;

    setIsUploading(true);
    setLoader(true);

    try {
      const file = selectedFileList[0];
      const uploadResult = await uploadToCloudinary(file);

      if (!uploadResult.url || !uploadResult.publicId) {
        throw new Error("Invalid Cloudinary response");
      }

      await db
        .insert(CarImages)
        .values({
          imageUrl: uploadResult.url,
          publicId: uploadResult.publicId,
          carListingId: triggerUploadImages,
        })
        .returning({ id: CarImages.id });

      setSelectedFileList([]);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setLoader(false);
    }
  }, [selectedFileList, setLoader, triggerUploadImages, isUploading]);

  useEffect(() => {
    if (triggerUploadImages) {
      uploadImagesToServer();
    }
  }, [triggerUploadImages, uploadImagesToServer]);

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload Car Image</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {mode === "edit" &&
          editCarImageList.map((img, index) => (
            <div key={index} className="relative">
              <IoMdCloseCircle
                className="absolute m-2 text-lg text-white cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onImageRemoveFromDB(img, index);
                }}
              />
              <img
                src={img}
                className="w-full h-[130px] object-cover rounded-xl"
              />
            </div>
          ))}

        {selectedFileList.map((img, index) => (
          <div key={index} className="relative">
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                onImageRemove();
              }}
            />
            <img
              src={URL.createObjectURL(img)}
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        {/* Only show upload button if no image exists */}
        {editCarImageList.length === 0 && selectedFileList.length === 0 && (
          <label htmlFor="upload-images" className="cursor-pointer">
            <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 hover:shadow-md">
              <h2 className="text-lg text-center text-primary">+</h2>
            </div>
          </label>
        )}

        <input
          type="file"
          id="upload-images"
          onChange={onFileSelected}
          className="hidden"
          accept=".jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
};

export default UploadImages;
