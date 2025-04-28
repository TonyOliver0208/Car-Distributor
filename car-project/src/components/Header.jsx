import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { i18n, t } = useTranslation();

  const isActive = (path) => {
    return location.pathname + location.search === path;
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex justify-between items-center shadow-sm p-5">
      <Link to={"/"}>
        <img
          src="https://thumbs.dreamstime.com/b/vector-logo-design-car-dealer-technology-business-deal-marketing-auto-shop-service-technology-business-partnership-110252659.jpg"
          width={120}
          height={90}
        />
      </Link>

      <ul className="hidden md:flex gap-16">
        <Link to={"/"}>
          <li
            className={`font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary ${
              isActive("/") ? "text-primary font-semibold" : ""
            }`}
          >
            {t("home")}
          </li>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <li className="font-medium flex items-center gap-2 hover:scale-105 transition-all cursor-pointer hover:text-primary">
              <Search size={18} /> {t("search")}
            </li>
          </DialogTrigger>
          <DialogContent>
            <SearchBar close={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        <Link to={"/search?cars=New"}>
          <li
            className={`font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary ${
              isActive("/search?cars=New") ? "text-primary font-semibold" : ""
            }`}
          >
            {t("new")}
          </li>
        </Link>

        <Link to={"/search?cars=Used"}>
          <li
            className={`font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary ${
              isActive("/search?cars=Used") ? "text-primary font-semibold" : ""
            }`}
          >
            {t("used")}
          </li>
        </Link>

        <Link to={"/search?cars=Certified Pre-Owned"}>
          <li
            className={`font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary ${
              isActive("/search?cars=Certified%20Pre-Owned")
                ? "text-primary font-semibold"
                : ""
            }`}
          >
            {t("preowned")}
          </li>
        </Link>
      </ul>

      <div className="flex items-center gap-5">
        <button
          onClick={toggleLanguage}
          className="text-sm px-2 py-1 border rounded"
        >
          {i18n.language === "en" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}
        </button>
        {isSignedIn ? (
          <>
            <UserButton />
            <Link to={"/profile"}>
              <Button>{t("submitListing")}</Button>
            </Link>
          </>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/">
            <Button>{t("signIn")}</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Header;
