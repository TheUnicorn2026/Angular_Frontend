var app = angular.module('authApp', []);

app.controller('LoginController', function ($scope, $http, $window) {

  $scope.isLogin = true;
  $scope.user = {};
  $scope.message = '';
  $scope.data = {};

  // Toggle Login / Register
  $scope.toggleForm = function () {
    $scope.isLogin = !$scope.isLogin;
    $scope.user = {};
    $scope.message = '';
    $scope.data = {};
  };

  // LOGIN or REGISTER
  $scope.submitForm = function (event) {
    event.preventDefault();

    if ($scope.isLogin) {
      // LOGIN
      $http.post('http://127.0.0.1:8000/user/login/', {
        email: $scope.user.email,
        password: $scope.user.password
      }).then(function (response) {
        $scope.message = response.data.message;
        $scope.data = response.data.user;

        // for redirecting
        $window.location.href = "user.html"; 

      }, function () {
        $scope.message = "Login failed";
      });

    } else {
      // REGISTER
      $http.post('http://127.0.0.1:8000/user/register/', {
        name: $scope.user.name,
        email: $scope.user.email,
        password: $scope.user.password,
        phone: $scope.user.phone,
        type: $scope.user.type
      }).then(function (response) {
        $scope.message = "Registration successful";
        $scope.data = response.data;
      }, function () {
        $scope.message = "Registration failed";
      });
    }
  };

  // ✅ FORGOT PASSWORD (TELEGRAM OTP FLOW)
  $scope.forgotPassword = function () {

    if (!$scope.user.email) {
      alert("Please enter email first");
      return;
    }

    // 1️⃣ SEND OTP
    $http.post('http://127.0.0.1:8000/user/forgot-password/', {
      email: $scope.user.email
    }).then(function (response) {

      alert(response.data.message);

      // 2️⃣ ENTER OTP
      var otp = prompt("Enter OTP sent to Telegram");
      if (!otp) return;

      var newPassword = prompt("Enter new password");
      if (!newPassword) return;

      // 3️⃣ RESET PASSWORD
      return $http.post('http://127.0.0.1:8000/user/reset-password/', {
        email: $scope.user.email,
        otp: otp,
        new_password: newPassword
      });

    }).then(function (response) {
      if (response) {
        alert(response.data.message);
      }
    }).catch(function (error) {
      alert("Password reset failed");
      console.error(error);
    });
  };

});
