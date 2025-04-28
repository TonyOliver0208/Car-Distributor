import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const FinancialCalculator = ({ carDetail }) => {
  const { t } = useTranslation();
  const [carPrice, setCarPrice] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateMonthlyPayment = () => {
    const principal = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 1200;

    const monthlyPayment =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

    setMonthlyPayment(monthlyPayment.toFixed(2));
  };

  return (
    <div className="p-10 border rounded-xl shadow-md mt-7">
      <h2 className="font-medium text-2xl">
        {t("CarDetails.financialCalculator")}
      </h2>
      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label htmlFor="">{t("CarDetails.price")} $</label>
          <Input type="number" onChange={(e) => setCarPrice(e.target.value)} />
        </div>

        <div className="w-full">
          <label htmlFor="">{t("CarDetails.interestRate")}</label>
          <Input
            type="number"
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label htmlFor="">{t("CarDetails.loanTerm")} (Months)</label>
          <Input type="number" onChange={(e) => setLoanTerm(e.target.value)} />
        </div>

        <div className="w-full">
          <label htmlFor="">{t("CarDetails.downPayment")}</label>
          <Input
            type="number"
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>
      </div>

      {monthlyPayment > 0 && (
        <h2 className="font-medium text-2xl mt-5">
          {t("CarDetails.monthlyPayment")}:{" "}
          <span className="font-bold text-4xl">${monthlyPayment}</span>
        </h2>
      )}
      <Button
        className="w-full mt-5"
        size="lg"
        onClick={calculateMonthlyPayment}
      >
        {t("CarDetails.calculate")}
      </Button>
    </div>
  );
};

export default FinancialCalculator;
