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
