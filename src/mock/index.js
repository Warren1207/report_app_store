import Mock from "mockjs";

Mock.mock("/api/login", "post", function() {
  return {};
});
