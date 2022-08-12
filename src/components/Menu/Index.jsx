import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../firebase/config";
import { TypeItem } from "../../helpers/TypeItems";
import LoadingMenu from "./LoadingMenu";
import MenuInfo from "./MenuInfo";

const Index = () => {
  const { rid } = useParams();
  const [loagindData, setLoadingData] = useState(false);
  const [menuInfo, setMenuInfo] = useState(null);

  useEffect(() => {
    async function GetData() {
      await GetMenuInformation();
    }
    GetData();
  }, []);

  const GetMenuInformation = async () => {
    setLoadingData(false);
    if (!rid) {
      return null;
    }
    let firstSoups = await GetFistTimeOptions();
    let secondSoups = await GetSecondTimeOptions();
    let basicStews = await GetThridBasicTimeOptions();
    let proStews = await GetThridProTimeOptions();
    let specialStews = await GetThridSpecialTimeOptions();

    const menu = {
      FirstSoups: firstSoups ? firstSoups : null,
      SecondSoups: secondSoups ? secondSoups : null,
      BasicStews: basicStews ? basicStews : null,
      ProStews: proStews ? proStews : null,
      SpecialStews: specialStews ? specialStews : null,
    };

    setMenuInfo(menu);
    setLoadingData(true);
  };

  const GetFistTimeOptions = async () => {
    const { docs } = await store
      .collection("RestaurantItems")
      .where("RestaurantId", "==", rid)
      .where("Type", "==", TypeItem.Soups)
      .where("TimeItem", "==", "1")
      .where("Status", "==", true)
      .get();

    if (!docs) {
      return null;
    }

    const restaurantItems = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    return restaurantItems;
  };

  const GetSecondTimeOptions = async () => {
    const { docs } = await store
      .collection("RestaurantItems")
      .where("RestaurantId", "==", rid)
      .where("Type", "==", TypeItem.Soups)
      .where("TimeItem", "==", "2")
      .where("Status", "==", true)
      .get();

    if (!docs) {
      return null;
    }

    const restaurantItems = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    return restaurantItems;
  };

  const GetThridBasicTimeOptions = async () => {
    const { docs } = await store
      .collection("RestaurantItems")
      .where("RestaurantId", "==", rid)
      .where("Type", "==", TypeItem.BasicStews)
      .where("TimeItem", "==", "3")
      .where("Status", "==", true)
      .get();

    if (!docs) {
      return null;
    }

    const restaurantItems = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    return restaurantItems;
  };

  const GetThridProTimeOptions = async () => {
    const { docs } = await store
      .collection("RestaurantItems")
      .where("RestaurantId", "==", rid)
      .where("Type", "==", TypeItem.ProStews)
      .where("TimeItem", "==", "3")
      .where("Status", "==", true)
      .get();

    if (!docs) {
      return null;
    }

    const restaurantItems = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    return restaurantItems;
  };

  const GetThridSpecialTimeOptions = async () => {
    const { docs } = await store
      .collection("RestaurantItems")
      .where("RestaurantId", "==", rid)
      .where("Type", "==", TypeItem.SpecialStews)
      .where("TimeItem", "==", "3")
      .where("Status", "==", true)
      .get();

    if (!docs) {
      return null;
    }

    const restaurantItems = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    return restaurantItems;
  };

  return (
    <Fragment>
      {!loagindData ? <LoadingMenu /> : <MenuInfo menuInfo={menuInfo} />}
    </Fragment>
  );
};

export default Index;
