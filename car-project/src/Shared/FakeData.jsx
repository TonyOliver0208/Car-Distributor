import { faker } from "@faker-js/faker";
function createRandomeCarList() {
  return {
    name: faker.vehicle.vehicle(),
    fuelType: faker.vehicle.fuel(),
    model: faker.vehicle.model(),
    type: faker.vehicle.type(),

    image:
      "https://medialamborghini-meride-tv.akamaized.net/meride/lamborghini/video/images/folder1/1252/vlcsnap-2023-03-17-16h18m30s840.jpg",
    miles: 1000,
    gearType: "Automatic",
    price: faker.finance.amount({ min: 4000, max: 20000 }),
  };
}

const carList = faker.helpers.multiple(createRandomeCarList, {
  count: 7,
});

export default {
  carList,
};
