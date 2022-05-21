import qs from "qs";
import axios from "axios";

export default {
  // 取得 台灣所有縣市的名稱
  async getCityList() {
    var apiUrl =
      "https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON";
    try {
      let res = await axios.get(apiUrl, {
        headers: await this.getAuthorizationHeader(),
      });
      // console.log("getCityList 拿到 tdx data 啦", apiUrl, res.data);
      return await res.data;
    } catch (err) {
      console.log("台灣所有縣市的名稱", err);
    }
  },
  async getAuthorizationHeader() {
    const parameter = {
      grant_type: "client_credentials",
      client_id: "shooboost-0659506a-9440-4f49",
      client_secret: "f075a3b1-3567-47d5-9926-e413ba6d3d42",
    };
    let auth_url = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;
    try {
      let res = await axios({
        method: "POST",
        url: auth_url,
        data: qs.stringify(parameter),
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      let accesstoken = res.data;
      return {
        authorization: `Bearer ${accesstoken.access_token}`,
      };
    } catch (err) {
      return err;
    }
  },

  // 取得 指定縣市之公車路線
  async getRoutesOfTheCity(cityName, cityNameInChinese) {
    // var apiUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${cityName}?$format=JSON`;
    var apiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/${cityName}?$format=JSON`;
    try {
      let res = await axios.get(`${apiUrl}`, {
        headers: await this.getAuthorizationHeader(),
      });
      // _this.tdxData = res.data;
      // console.log("getRoutesOfTheCity 拿到 tdx data 啦", apiUrl, res.data);
      let routesList = [];
      // 整理我會用到的路徑相關資料
      res.data.forEach((item) => {
        routesList.push({
          City: item.City,
          CityName: cityNameInChinese,
          CityCode: item.CityCode,
          RouteUID: item.RouteUID,
          RouteMapImageUrl: item.RouteMapImageUrl,
          // SubRoutes: item.SubRoutes,
          // HasSubRoutes: item.HasSubRoutes,
          RouteName: item.RouteName,
          DepartureStopNameEn: item.DepartureStopNameEn,
          DepartureStopNameZh: item.DepartureStopNameZh,
          DestinationStopNameEn: item.DestinationStopNameEn,
          DestinationStopNameZh: item.DestinationStopNameZh,
        });
      });
      return await routesList;
    } catch (err) {
      console.log(err);
    }
  },

  // 取得 全台公車路線
  async getRoutesOfTaiwan(allCityList) {
    let routesList = [];
    // 使用 map 搭配 for loop
    // map 儲存各個縣市的公車路線清單
    let routesOfAllCities = [];
    for (let city of allCityList) {
      routesOfAllCities.push(
        await this.getRoutesOfTheCity(city.City, city.CityName)
      );
    }

    // for loop 將各縣市路線清單合併(concat)為一個清單
    // 例如 [[北市路線666, 北市路線661],[宜蘭路線6],[台中路線02,台中路線50]] concat 成 [北市路線666, 北市路線661, 宜蘭路線6, 台中路線02,台中路線50]
    for (let routesOfCity of routesOfAllCities) {
      routesList = routesList.concat(await routesOfCity);
    }
    routesList.sort((a, b) => {
      return a.RouteName.Zh_tw.localeCompare(b.RouteName.Zh_tw, "zh-TW");
    });
    // console.log("routesList", await routesList);
    return await routesList;
  },

  // 取得 特定公車路線的 進站離站的公車車牌號碼（行駛中的公車車牌與離他最近的站牌）
  async getVehicleNearStopOfTheRoute(cityName, RouteName) {
    let selectDetailList = [
      "RouteName",
      "Direction",
      "RouteUID",
      "StopUID",
      "PlateNumb",
      "A2EventType",
      "StopName",
      "SubRouteUID",
    ];
    let selectDetailString = selectDetailList.join("%2C");
    var apiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/RealTimeNearStop/City/${cityName}/${RouteName}?$select=${selectDetailString}&$format=JSON`;
    try {
      let res = await axios.get(`${apiUrl}`, {
        headers: await this.getAuthorizationHeader(),
      });
      // console.log(
      //   "getVehicleNearStopOfTheRoute 拿到 tdx data 啦",
      //   apiUrl,
      //   res.data
      // );
      return await res.data;
    } catch (err) {
      console.log(err);
    }
  },

  // 取得該縣市的所有 無障礙公車 公車車牌
  async getVehicleOfTheCity(cityName) {
    var apiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/Vehicle/City/${cityName}?$filter=VehicleType%20eq%201&$format=JSON/`;
    try {
      let res = await axios.get(`${apiUrl}`, {
        headers: await this.getAuthorizationHeader(),
      });
      // console.log("getVehicleOfTheCity 拿到 tdx data 啦", apiUrl, res.data);
      return await res.data;
    } catch (err) {
      console.log(err);
    }
  },

  // 取得全台 公車車牌、該車牌是否為無障礙公車
  async getVehicleOfTaiwan(allCityList) {
    let vehicleList = [];
    let vehicleOfAllCities = [];
    for (let city of allCityList) {
      if (city.City === "Chiayi") {
        continue;
      }
      // console.log(city)
      vehicleOfAllCities.push(await this.getVehicleOfTheCity(city.City));
    }

    // for loop 將各縣市路線清單合併(concat)為一個清單
    // 例如 [[北市路線666, 北市路線661],[宜蘭路線6],[台中路線02,台中路線50]] concat 成 [北市路線666, 北市路線661, 宜蘭路線6, 台中路線02,台中路線50]
    for (let vehicleOfCity of vehicleOfAllCities) {
      vehicleList = vehicleList.concat(await vehicleOfCity);
    }
    return await vehicleList;
  },

  // 取得 特定公車路線的路徑圖資
  async getRouteGEOJSON(city, routeName) {
    let apiUrl = `https://tdx.transportdata.tw/api/basic/V3/Map/Bus/Network/StopOfRoute/City/${city}/RouteName/${routeName}?%24format=GEOJSON`;
    try {
      let res = await axios.get(`${apiUrl}`, {
        headers: await this.getAuthorizationHeader(),
      });
      // console.log("getRouteGEOJSON 拿到 tdx data 啦", apiUrl, res.data);
      return res.data.features[0];
    } catch (err) {
      console.log(err);
    }
  },

  // 取得 特定公車路線的行經站牌
  async getStopsOfTheRoute(cityName, RouteName, RouteUID) {
    let apiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/${cityName}/${RouteName}?$filter=RouteUID%20%20eq%20'${RouteUID}'&$format=JSON`;
    try {
      let res = await axios.get(apiUrl, {
        headers: await this.getAuthorizationHeader(),
      });
      // console.log("getStopsOfTheRoute 拿到 tdx data 啦", apiUrl, res.data);
      // 去程與回程各自經過的站牌，依站序排列
      // differentDirectionsStopsLists[0] 為去程
      // differentDirectionsStopsLists[0].Stops 為去程經過的站牌所有站牌，依站序排列
      return await res.data;
    } catch (err) {
      console.log(err);
    }
  },

  // 取得 特定公車路線的各個站牌的預估公車進入該站剩餘秒數
  async getEstimatedTimeOfTheRoute(cityName, RouteName) {
    let selectDetailList = [
      "RouteName",
      "Direction",
      "StopUID",
      "StopName",
      "EstimateTime",
      "StopSequence",
      "PlateNumb",
    ];
    let selectDetailString = selectDetailList.join("%2C");
    let apiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${cityName}/${RouteName}?&select=${selectDetailString}&$format=JSON`;
    try {
      let res = await axios.get(apiUrl, {
        headers: await this.getAuthorizationHeader(),
      });
      res.data.sort((item, itemNext) => {
        return item.Direction - itemNext.Direction;
      });
      let direction0List = res.data.filter(function (item) {
        return item.Direction === 0;
      });
      let direction1List = res.data.filter(function (item) {
        return item.Direction === 1;
      });
      let differentDirectionsStopsEstimatedTimeLists = [
        direction0List,
        direction1List,
      ];
      return await differentDirectionsStopsEstimatedTimeLists;
    } catch (err) {
      console.log(err);
    }
  },

  // 整理 特定公車路線的各個站牌，將每站的即時到站剩餘秒數、行經各站之車牌、行經各站之車種，整合成各站詳情
  async sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(
    vehicleOfTaiwan,
    cityName,
    RouteName,
    RouteUID
  ) {
    let differentDirectionsStopsLists = await this.getStopsOfTheRoute(
      cityName,
      RouteName,
      RouteUID
    );
    // 取得 特定公車路線的行經站牌
    let differentDirectionsStopsEstimatedTimeLists =
      await this.getEstimatedTimeOfTheRoute(cityName, RouteName);

    // 取得 特定公車路線的 進站離站的公車車牌號碼（行駛中的公車車牌與離他最近的站牌）
    let realTimeBusList = await this.getVehicleNearStopOfTheRoute(
      cityName,
      RouteName
    );

    // 將 特定公車路線的 1.即時到站資料（站牌的預估公車進入該站剩餘秒數）與 2.進站離站資料（行駛中的公車車牌與離他最近的站牌），依照站牌代碼（StopUID）整理
    for (var stopsList of await differentDirectionsStopsLists) {
      // 找出路線相同(SubRouteUID)且行駛方向相同(Direction)的公車(進站離站資料)
      let busListOnSameDirection = await realTimeBusList.filter(function (bus) {
        return (
          bus.Direction === stopsList.Direction &&
          stopsList.SubRouteUID === bus.SubRouteUID
        );
      });
      if (busListOnSameDirection) {
        await busListOnSameDirection.forEach(async function (bus) {
          let sameStop = await stopsList.Stops.find((stop) => {
            return bus.StopUID === stop.StopUID;
          });
          // console.log(
          //   "StopUID Dir Seq sameStop",
          //   bus.StopUID,
          //   bus.Direction,
          //   bus.StopSequence,
          //   sameStop,
          //   "bus",
          //   bus,
          //   bus.PlateNumb
          // );
          // 車輛是否為無障礙車

          let isFriendlyBus = vehicleOfTaiwan.find(function (vechile) {
            if (vechile) {
              return vechile.PlateNumb === bus.PlateNumb;
            }
          });
          if (isFriendlyBus) {
            bus.VehicleType = "無障礙公車";
            // console.log(bus.PlateNumb, "存無障礙公車");
          }

          if (bus.A2EventType === 0) {
            sameStop.busDeparture = (await sameStop.busDeparture)
              ? [...sameStop.busDeparture, bus]
              : [bus];
            // console.log(sameStop.busDeparture, "sameStop.busDeparture");
          } else if (bus.A2EventType === 1) {
            sameStop.busArrival = (await sameStop.busArrival)
              ? [...sameStop.busArrival, bus]
              : [bus];
            // console.log(sameStop.busArrival, "sameStop.busArrival");
          }
        });
      }

      // 找出行駛方向相同的預估到站清單
      let stopsEstimatedTimeListOnSameDirection =
        differentDirectionsStopsEstimatedTimeLists.find(function (
          stopsEstimatedTimeList
        ) {
          if (stopsEstimatedTimeList[0]) {
            return stopsEstimatedTimeList[0].Direction === stopsList.Direction;
          } else {
            return null;
          }
        });
      if (stopsEstimatedTimeListOnSameDirection) {
        // 將每站的預估到站時間添加到每站的詳細資訊表
        await stopsList.Stops.forEach(async (stop) => {
          let stopWithEstimatedTime =
            await stopsEstimatedTimeListOnSameDirection.find((ETstop) => {
              return ETstop.StopUID === stop.StopUID;
            });
          if (stopWithEstimatedTime) {
            let stopET = stopWithEstimatedTime.EstimateTime;
            let stopETInteger = Math.floor(stopET / 60);
            stop.EstimateTime =
              stopET == undefined
                ? "未發車"
                : stopETInteger === 1
                ? "將進站"
                : stopETInteger === 0
                ? "進站中"
                : stopETInteger;
          }
        });
      }
    }
    // console.log(
    //   "differentDirectionsStopsLists",
    //   differentDirectionsStopsLists
    // );
    return differentDirectionsStopsLists;
  },
};
