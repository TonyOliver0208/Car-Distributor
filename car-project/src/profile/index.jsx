import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import MyListing from "./components/MyListing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Inbox from "./components/Inbox";
import TrafficAnalysis from "./components/TrafficAnalysis";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <Tabs defaultValue="my-listing" className="w-full">
          <TabsList className="w-full flex justify-start">
            <TabsTrigger value="my-listing">
              {t("profile.myListing")}
            </TabsTrigger>
            <TabsTrigger value="inbox">{t("profile.inbox")}</TabsTrigger>
            <TabsTrigger value="traffic">{t("profile.traffic")}</TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent value="traffic">
            <TrafficAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
