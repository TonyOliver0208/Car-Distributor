import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropdownField = ({ item, handleInputChange, carInfo }) => {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (carInfo?.[item?.name]) {
      setSelectedValue(carInfo[item.name]); // Set the initial value from database
    }
  }, [carInfo, item?.name]);

  return (
    <Select
      onValueChange={(value) => {
        setSelectedValue(value);
        handleInputChange(item.name, value);
      }}
      value={selectedValue} // Ensure value is controlled
      required={item.required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={item.label} />
      </SelectTrigger>
      <SelectContent>
        {item?.options?.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropdownField;
