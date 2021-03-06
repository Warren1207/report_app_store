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

Mock.mock(RegExp("/ReportTemplate/GetReportTemplateList.*"), "get", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 11:21:32.257400",
    Data: [
      {
        id: 1,
        name: "测试工参",
        path:
          "C:\\Users\\Public\\Nwt\\cache\\recv\\丁凡\\zunyi_siteinfo190403.csv",
        status: 2,
        createuserid: null,
        createdate: "/Date(1554866258374)/"
      }
    ],
    TotalCount: 1,
    Message: "OK"
  };
});

Mock.mock(RegExp("/TaskReport/GetTaskReportList.*"), "get", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 11:24:49.806400",
    Data: [
      {
        Id: 1308,
        Name: "无人值守PingCall0126-无人ZA",
        State: 1,
        Type: 1,
        TemplateId: 0,
        RateProgress: 100,
        DownloadCount: 0,
        DownloadUrl:
          "D:\\skyrulerIncrement\\2019\\1\\无人值守PingCall0126-无人ZA\\无人值守PingCall0126-无人ZA.zip",
        CreateTime: "2019-01-26 15:30:00",
        Remarks: null,
        ServerId: 32,
        TaskId: 21480,
        Parameter: null,
        Consignee: null,
        IsSendAppendix: 0,
        CreateUserId: 46,
        CreateUserName: "Test1",
        ErrorMessage: "",
        Guid: "b8cfdfcd-a0b8-4245-aadc-a94d38ae7f8e",
        IsDownload: true,
        UpdateTime: "2019-01-26 15:30:20"
      },
      {
        Id: 1307,
        Name: "无人值守PingCall0126-无人值守PingCAllZA-无人值守PingCA_3",
        State: 1,
        Type: 1,
        TemplateId: 0,
        RateProgress: 100,
        DownloadCount: 0,
        DownloadUrl:
          "D:\\skyrulerIncrement\\2019\\1\\无人值守PingCall0126-无人值守PingCAllZA-无人值守PingCA_3\\无人值守PingCall0126-无人值守PingCAllZA-无人值守PingCA_3.zip",
        CreateTime: "2019-01-26 15:30:00",
        Remarks: null,
        ServerId: 32,
        TaskId: 21466,
        Parameter: null,
        Consignee: null,
        IsSendAppendix: 0,
        CreateUserId: 46,
        CreateUserName: "Test1",
        ErrorMessage: "",
        Guid: "dbb158a3-62e8-4a3f-ac9c-4a52a799b26f",
        IsDownload: true,
        UpdateTime: "2019-01-26 15:30:20"
      },
      {
        Id: 1306,
        Name: "无人值守PingCall0126-无人值守PingCall_9",
        State: 1,
        Type: 1,
        TemplateId: 0,
        RateProgress: 100,
        DownloadCount: 0,
        DownloadUrl:
          "D:\\skyrulerIncrement\\2019\\1\\无人值守PingCall0126-无人值守PingCall_9\\无人值守PingCall0126-无人值守PingCall_9.zip",
        CreateTime: "2019-01-26 15:30:00",
        Remarks: null,
        ServerId: 32,
        TaskId: 21462,
        Parameter: null,
        Consignee: null,
        IsSendAppendix: 0,
        CreateUserId: 46,
        CreateUserName: "Test1",
        ErrorMessage: "",
        Guid: "22b3a0c7-d483-41cb-9170-9fa32c524189",
        IsDownload: true,
        UpdateTime: "2019-01-26 15:30:20"
      }
    ],
    TotalCount: 3,
    Message: "OK"
  };
});

Mock.mock("/BaseStation/AddBaseStation", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 10:33:41.814400",
    Data: "Success",
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock("/ReportTemplate/AddReportTemplate", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 10:33:41.814400",
    Data: "Success",
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock("/BaseStation/UploadBaseStation", "post", function() {
  return {
    CachedTime: "2019-04-10 11:03:49.867400",
    Data:
      "D:SourceWorkReportingAppStoreReportingAppStore.WebBaseStation工参模板.xlsx",
    FlagDescription: "SUCCESS",
    Message: "OK",
    State: 0,
    TotalCount: 0
  };
});

Mock.mock("/ReportTemplate/UploadReportTemplate", "post", function(option) {
  console.log(option);
  return {
    CachedTime: "2019-04-10 11:03:49.867400",
    Data:
      "D:SourceWorkReportingAppStoreReportingAppStore.WebBaseStation工参模板" +
      Math.floor(Math.random() * 99) +
      ".xlsx",
    FlagDescription: "SUCCESS",
    Message: "OK",
    State: 0,
    TotalCount: 0
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

Mock.mock("/ReportTemplate/UpdateReportTemplate", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 10:33:41.814400",
    Data: "Success",
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock(RegExp("/taskplan/index.*"), "get", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 11:51:17.606601",
    Data: [
      {
        id: 1,
        planname: "1",
        repeattype: null,
        startdate: null,
        enddate: null,
        intervaltime: null,
        status: null,
        createuserid: null,
        createdate: null,
        errormessage: null,
        lastexecute: null,
        executecount: null
      },
      {
        id: 2,
        planname: "1",
        repeattype: null,
        startdate: null,
        enddate: null,
        intervaltime: null,
        status: null,
        createuserid: null,
        createdate: null,
        errormessage: null,
        lastexecute: null,
        executecount: null
      },
      {
        id: 3,
        planname: "1",
        repeattype: null,
        startdate: null,
        enddate: null,
        intervaltime: null,
        status: null,
        createuserid: null,
        createdate: null,
        errormessage: null,
        lastexecute: null,
        executecount: null
      }
    ],
    TotalCount: 3,
    Message: "OK"
  };
});

Mock.mock("/taskplan/create", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 11:56:43.476601",
    Data: null,
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock("/taskplan/delete", "post", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 12:04:37.864601",
    Data: null,
    TotalCount: 0,
    Message: "OK"
  };
});

Mock.mock("/scenes/index", "get", function() {
  return {
    State: 0,
    FlagDescription: "SUCCESS",
    CachedTime: "2019-04-10 16:47:43.043601",
    Data: [
      {
        id: 9,
        name: "TOPn-卡顿（联通）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 8,
        name: "TOPn-低速率（联通）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 7,
        name: "TOPn-低COI（联通）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 6,
        name: "网络监控（联通）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 5,
        name: "VoLET两高两低专项（中移）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 4,
        name: "高负荷",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 3,
        name: "深度覆盖MR专项（中移）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 2,
        name: "多网融合专项（中移）",
        createuserid: null,
        createdate: null,
        status: null
      },
      {
        id: 1,
        name: "服务器机房部署",
        createuserid: null,
        createdate: null,
        status: null
      }
    ],
    TotalCount: 0,
    Message: "OK"
  };
});
