//angular js module
const app = angular.module("TopDashContainer", []);
/**
 * 
 *
  We need a custom service to perform the initial request then 
  finally parse the data and bind it to the view
  -> Dashboard
  -> Table
  TODO: Add a row item click listener to update the Transaction view container
  **/

app.factory("dashManager", [
  "$document",
  ($document) => {
    var content = {};
    var rt_array = [];
    var t_history_table = [];
    var info_content = {}; // feed it with valid objects
    var monthly_data = [];

    const mapType = (t_type) => {
      return t_type[0];
    };

    const processAmount = (amount, t_type) => {
      if (t_type === "Recieve Money" || t_type === "Deposit") {
        return {
          amount: amount,
          gain: true,
        };
      }
      return {
        amount: amount,
        gain: false,
      };
    };

    const processDate = (date) => {
      //date is a string
      let then = new Date(date), now = new Date();
      let diff = (now - then) / 1000; // to secs
      if (diff < 60) {
        return {
          time: `Less than a minute ago`,
        };
      }
      diff /= 60; // to min
      if (diff < 60) {
        return {
          time: `${parseInt(Number(diff))} minutes ago`,
        };
      }
      diff /= 60; // to hours
      if (diff < 24) {
        return {
          time: `${parseInt(Number(diff))} hours ago`,
        };
      }
      diff /= 24; // to days
      if (diff < 7) {
        return {
          time: (diff == 1)? `${parseInt(Number(diff))} day ago`: `${parseInt(Number(diff))} days ago`,
        };
      }
      diff /= 7; // to weeks
      if (diff < 4) {
        return {
          time: `${parseInt(Number(diff))} weeks ago`,
        };
      }
      diff /= 4; // to months
      if (diff < 12) {
        return {
          time: `${parseInt(Number(diff))} month ago`,
        };
      }
      diff /= 12; // to years
      return {
        time: `${parseInt(Number(diff))} year ago`,
      };
    };

    return {
      addContent: (dt) => {
        content = dt;
        rt_array = dt.details.rt.data;
        monthly_data = dt.details.monthly_data;
      },

      getContent: () => {
        return content;
      },

      getArray: () => {
        return rt_array;
      },

      processData: () => {
        //this will map a transaction date to string
        //list all the transactions
        const arr = rt_array;
        for (var i in arr) {
          var item = arr[i];
          var itemInfo = {};
          itemInfo.index = i;
          itemInfo.type = mapType(item.type);
          //type

          itemInfo.subject = {
            name: item.subject || item.location,
            subjectID: item.subject_phoneNumber || item.subject_account,
          };
          itemInfo.date = processDate(item.dateTime);
          itemInfo.amount = processAmount(item.transaction_amount, item.type);
          t_history_table.push(itemInfo);
        }
      },

      getHistTable: () => {
        return t_history_table;
      },

      drawChart: () => {
        var chartContainer = $document.querySelector(
          ".bottom-analytics-container"
        );
        console.log(chartContainer);
      },

      prepareMonthlyChartFigures: () => {
        var md = [];
        for (var i in monthly_data) {
          let monthObj = [];
          let item = monthly_data[i];
          monthObj.push(`${item.label.month} ${item.label.year}`);
          monthObj.push(item.data.income);
          monthObj.push(item.data.spent);

          md.push(monthObj);
        }
      },

      getInfoContent: (n) => {
        // feed
        var info = {};
        const item = rt_array[n];
        var cleanItems = [];
        info.type = item.type;
        info.subject = item.subject;
        console.log(item);
        for (const [key, value] of Object.entries(item)) {
          if (
            value != null &&
            key != "message_id" &&
            key != "type"
          ) {
            let itemLabel;
            switch (key) {
              case "balance":
                itemLabel = "Balance";
                break;
              case "subject":
                itemLabel = "Subject";
                break;
              case "subject_phoneNumber":
                itemLabel = "Phone Number";
                break;
              case "transaction_amount":
                itemLabel = "Amount";
                break;
              case "transaction_cost":
                itemLabel = "Transaction cost";
                break;
              case "type":
                itemLabel = "Type";
                break;
              case "location":
                itemLabel = "Location";
                break;
              case "subject_account":
                itemLabel = "AccountNumber";
                break;
              case "transaction_code":
                itemLabel = "Transaction Code";
                break;
              case "dateTime":
                itemLabel = "Date & Time";
                break;
            }
            cleanItems.push({
              label: itemLabel || key,
              value: value,
            });
          }
        }
        info.items = cleanItems;
        info_content = info;
        return info_content;
      },
    };
  },
]);

app.controller("MainCtrl", [
  "$scope",
  "$http",
  "$document",
  "dashManager",
  async ($scope, $http, $document, dashManager) => {
    await $http
      .get("/get-data?dType=dashboard")
      .then((res) => {
        // then
        const content = res.data;
        $scope.content = content;
        $scope.balance = content.details.balance.balance;
        $scope.income = content.details.income;
        $scope.spent = content.details.spent;

        //page info

        $scope.pageInfo = [
          {
            label: "Home",
            active: true,
          },

          {
            label: "Transactions",
            active: false,
          },
          {
            label: "Analytics",
            active: false,
          },
          {
            label: "Inbox",
            active: false,
          },
        ];

        $scope.changeTab = (n) => {
          //look for an active one
          $scope.pageInfo.map((item) => {
            item.active = false;
          });
          $scope.pageInfo[n].active = true;
        };

        dashManager.addContent(content);
        dashManager.processData();

        $scope.transactions = dashManager.getHistTable();
        $scope.tInfoContent = dashManager.getInfoContent(0);
        $scope.monthlyData = dashManager.prepareMonthlyChartFigures();
        $scope.switchInfo = (n) => {
          // feed the transaction at index n to the transaction render
          $scope.tInfoContent = dashManager.getInfoContent(n);
        };
      })
      .catch((err) => {
        //show the error
        //
      });
  },
]);
