import Mock from "mockjs";

Mock.mock("/Account/Login", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 11:24:04.232601",
    Data: {
      Token: "e82602ff58454668912a7bbe9578b445"
    },
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock(RegExp("/BaseStation/GetBaseStationList.*"), "get", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 10:29:25.691400",
    Data: [
      {
        id: 1,
        name: "测试工参",
        path:
          "C:\\Users\\Public\\Nwt\\cache\\recv\\丁凡\\zunyi_siteinfo190403.csv",
        filename: "zunyi_siteinfo190403",
        status: 1,
        createuserid: null,
        createdate: "/Date(1554863116132)/",
        mobilemode: "NB"
      }
    ],
    TotalCount: 1,
    Message: "OK"
  };
});

Mock.mock("/BaseStation/UpdateBaseStation", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 10:33:41.814400",
    Data: "Success",
    TotalCount: 0,
    Message: "OK"
  };
});
