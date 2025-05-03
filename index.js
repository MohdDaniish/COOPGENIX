require("dotenv").config();
require("./connection");
const Web3 = require("web3");
const express = require("express");
const cors = require("cors");
const config2 = require("./model/confiig");
const app = express();
const routes = require("./router");
const cron = require("node-cron");
const moment = require("moment-timezone");
const registration = require("./model/registration");
const withdraw = require("./model/withdraw");
const Adminlogin = require("./routers/adminlogin");
const AuthRouter = require("./routers/auth");
const Dashboard = require("./routers/dashborad");
const crypto = require("crypto");
const path = require("path");
const newuserplace = require("./model/newuserplace");
const UserIncome = require("./model/userIncome");
const reEntry = require("./model/reEntry");
const SlotPurchased = require("./model/packagebuy");
const SponsorIncome = require("./model/sponsorincome");
const upgrade = require("./model/upgrade");
const globalincome = require("./model/globaldownlineincome");
const claimpromise = require("./model/claimpromisereward");
const poolexpiry = require("./model/poolexpiry");
const globaldownline = require("./model/globaldownlineincome");
const globalupline = require("./model/globaluplineincome");
const packagebuy = require("./model/packagebuy");
const stoppromise = require("./model/stoppromise");
const needtopurchase = require("./model/needtopurchase");
const updateExpiredPackages = require("./utility/cronBlockReset");
const weeklyfund = require("./model/weeklyfund");
const globalreward = require("./model/globalreward");

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins
      callback(null, true);

      // To revert back to allowed origins, comment out the above line and uncomment the following block:
      /*
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
      */
    },
  })
);

app.use("/api", routes);
app.use("/api", AuthRouter);
app.use("/api", Adminlogin);
app.use("/api", Dashboard);
app.use("/banner", express.static(path.join(__dirname, "/public/upload")));

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.RPC_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 15,
      onTimeout: false,
    },
  })
);

const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimedPromiseReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"GlobalDownlineIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"GlobalUplineIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"}],"name":"NeedToRePurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"place","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"cycle","type":"uint256"}],"name":"NewUserPlace","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"usdAmt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"polAmt","type":"uint256"}],"name":"PackageBuy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"}],"name":"PendingPoolExpiry","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"reinvest","type":"uint256"}],"name":"ReEntry","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"userId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referrerId","type":"uint256"}],"name":"Registration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"SponserIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"StopedPromiseReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"poolId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"cycle","type":"uint256"}],"name":"Upgrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint8","name":"packageId","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"poolId","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reinvestCount","type":"uint256"}],"name":"UserIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"polAmt","type":"uint256"}],"name":"WeeklyFundContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"netUsdAmt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"netPolAmt","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"EXPIRE_DAYS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LAST_MATRIX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROMISE_DAILY_DIVIDER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROMISE_DAILY_SHARE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROMISE_REWARD_TILL_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERREL_REWARD_DIVIDER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERREL_REWARD_SHARE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIME_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WAITING_FOR_PROMISE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"contract AggregatorV3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"packageId","type":"uint8"}],"name":"buyMatrix","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimPromiseReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"creatorWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_packageId","type":"uint8"},{"internalType":"uint8","name":"_poolId","type":"uint8"}],"name":"findReferrer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint8","name":"_packageId","type":"uint8"},{"internalType":"uint8","name":"_poolId","type":"uint8"}],"name":"getMatrixInfo","outputs":[{"internalType":"address","name":"currentReferrer","type":"address"},{"internalType":"address[]","name":"referrals","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint8","name":"_packageId","type":"uint8"}],"name":"getPackageInfo","outputs":[{"internalType":"uint256","name":"pendingPoolExpiry","type":"uint256"},{"internalType":"uint256","name":"directPurchase","type":"uint256"},{"internalType":"bool","name":"activeX2Packages","type":"bool"},{"internalType":"uint256","name":"reinvestCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_usdAmt","type":"uint256"}],"name":"getTotalPOLCoin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"weeklyReward","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"getWithdrawHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"idToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isUserExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_referrer","type":"address"}],"name":"joinPlan","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"lastUserId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liqudityWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"matrixPackage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"promiseReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_creatorWallet","type":"address"}],"name":"setCreatorWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newExpiry","type":"uint256"}],"name":"setExpiryPendingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_liquidityWallet","type":"address"}],"name":"setLiquidityWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"}],"name":"setOperatorWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"avlReward","type":"uint256"},{"internalType":"uint256","name":"partnersCount","type":"uint256"},{"components":[{"internalType":"uint256","name":"blockReward","type":"uint256"},{"internalType":"uint256","name":"globalBonus","type":"uint256"},{"internalType":"uint256","name":"directReferralReward","type":"uint256"},{"internalType":"uint256","name":"promiseReward","type":"uint256"},{"internalType":"uint256","name":"totalReward","type":"uint256"}],"internalType":"struct CoopGenix.Income","name":"income","type":"tuple"},{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"checkpoint","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"}],"internalType":"struct CoopGenix.PromiseStake","name":"promiseStake","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weeklyFundWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"weeklyReward","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdrawWeeklyReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"},{"internalType":"uint8","name":"","type":"uint8"}],"name":"xdpCurrentvId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"},{"internalType":"uint8","name":"","type":"uint8"}],"name":"xdpIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint8","name":"","type":"uint8"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"xdpvId_number","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

let contract = new web3.eth.Contract(ABI, process.env.MAIN_CONTRACT);

async function getLastSyncBlock() {
  let { lastSyncBlock } = await config2.findOne();
  return lastSyncBlock;
}
async function getEventReciept(fromBlock, toBlock) {
  let eventsData = await contract.getPastEvents("allEvents", {
    fromBlock: fromBlock,
    toBlock: toBlock,
  });
  return eventsData;
}

async function getTimestamp(blockNumber) {
  let { timestamp } = await web3.eth.getBlock(blockNumber);
  return timestamp;
}

async function processEvents(events) {
  //console.log("events.length ",events.length)
  for (let i = 0; i < events.length; i++) {
    const { blockNumber, transactionHash, returnValues, event } = events[i];
     //console.log("event ",  event);
    const timestamp = await getTimestamp(blockNumber);
    if (event == "Registration") {
      try {
        let isnotreg = await registration.findOne({
          user: returnValues.user,
        });
        if (!isnotreg) {
          let referrer = await registration.findOne({
            user: returnValues.referrer,
          });

          if (!referrer) {
            referrer = {
              userId: 0,
            };
          }
          //console.log(returnValues, "returnvalue", event);
          let userId = "";
          // const randomNumber = Math.floor(Math.random() * 100000);
          // const fiveDigitNumber = randomNumber.toString().padStart(5, "0");
          //userId = "COOPG" + fiveDigitNumber;
          const randomTenDigitNumber = Math.floor(1000000000 + Math.random() * 9000000000);
          userId = randomTenDigitNumber;
          try {
            let isCreated = await registration.create({
              userId: userId,
              uId: returnValues.userId,
              user: returnValues.user,
              referrerId: referrer.userId ? referrer.userId : 0,
              rId: returnValues.referrerId,
              referrer: returnValues.referrer,
              txHash: transactionHash,
              block: blockNumber,
              timestamp: timestamp,
            });

            const getref =  await registration.findOne({ user : returnValues.user },{ referrer : 1 })
            if(getref){
            await registration.updateOne({ user : getref.referrer }, { $inc : { directCount : 1 } })
            }
          } catch (e) {
            console.log("Error in save reg:", e.message);
          }
        }
      } catch (e) {
        console.log("Error (Registration Event) :", e.message);
      }
    } else if (event == "NewUserPlace") {
      try {

        await newuserplace.create({
          user: returnValues.user,
          referrer: returnValues.referrer,
          place: returnValues.place,
          packageId: returnValues.packageId,
          poolId: returnValues.poolId,
          cycle: returnValues.cycle,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp
        });

      } catch (e) {
        console.log("Error (NewUserPlace Event) :", e.message);
      }
    } else if (event == "UserIncome") {
      try {
        await UserIncome.create({
          sender: returnValues.sender,
          receiver: returnValues.receiver,
          amount: returnValues.amount,
          packageId: returnValues.packageId,
          poolId: returnValues.poolId,
          reinvestCount : returnValues.reinvestCount,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });
      } catch (e) {
        console.log("Error (UserIncome Event) :", e.message);
      }
    } else if (event == "Upgrade") {
      try {
        
         const isth = await upgrade.create({
          user: returnValues.user,
          referrer: returnValues.referrer,
          poolId: returnValues.poolId,
          packageId : returnValues.packageId,
          cycle : returnValues.cycle,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

        const isexpiry = await poolexpiry.findOne({ user : returnValues.user, packageId : returnValues.packageId, package_status : true })
        if(isexpiry){
          await poolexpiry.updateMany(
            { user: returnValues.user, packageId: returnValues.packageId }, 
            { $set: { package_status: false } } 
          );        }
      } catch (e) {
        console.log("Error (Upgrade Event) :", e.message);
      }
    } else if (event == "SponserIncome") {
      try {
        await SponsorIncome.create({
          sender: returnValues.sender,
          receiver: returnValues.receiver,
          amount: returnValues.amount,
          level: returnValues.level,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });
      } catch (e) {
        console.log("Error (SponserReward Event) :", e.message);
      }
    } else if (event == "PendingPoolExpiry") {
      try {
        await poolexpiry.create({
          user: returnValues.user,
          packageId: returnValues.packageId,
          expiry: returnValues.expiry,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });
      } catch (e) {
        console.log("Error (SponserReward Event) :", e.message);
      }
    } else if (event == "ReEntry") {
      try {
        
        await reEntry.create({
          user: returnValues.user,
          packageId: returnValues.packageId,
          reinvest: returnValues.reinvest,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });
      } catch (e) {
        console.log("Error (ReEntry Event) :", e.message);
      }
    } else if (event == "Withdraw") {
      try {
        
          const iswit = await withdraw.create({  
          user: returnValues.user,
          amount: returnValues.amount,
          netUsdAmt : returnValues.netUsdAmt,
          netPolAmt : returnValues.netPolAmt,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

      } catch (e) {
        console.log("Error (Withdraw Event) :", e.message);
      }
    } else if (event == "PackageBuy") {
      try {
        
          const iswit = await packagebuy.create({  
          user: returnValues.user,
          packageId: returnValues.packageId,
          usdAmt: returnValues.usdAmt,
          polAmt : returnValues.polAmt,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

      } catch (e) {
        console.log("Error (Withdraw Event) :", e.message);
      }
    } else if (event == "GlobalDownlineIncome") {
      try {
        
          const iswit = await globaldownline.create({  
          sender: returnValues.sender,
          receiver: returnValues.receiver,
          amount : returnValues.amount,
          level : returnValues.level,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

      } catch (e) {
        console.log("Error (GlobalDownlineIncome Event) :", e.message);
      }
    } else if (event == "GlobalUplineIncome") {
      try {
        
          const iswit = await globalupline.create({  
          sender: returnValues.sender,
          receiver: returnValues.receiver,
          amount : returnValues.amount,
          packageId : returnValues.packageId,
          level : returnValues.level,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

      } catch (e) {
        console.log("Error (GlobalUplineIncome Event) :", e.message);
      }
    } else if (event == "ClaimedPromiseReward") {
      try {
        
          const iswit = await claimpromise.create({  
          user: returnValues.user,
          amount : returnValues.amount,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp,
        });

      } catch (e) {
        console.log("Error (ClaimedPromiseReward Event) :", e.message);
      }
    } else if (event == "StopedPromiseReward") {
      try {
        
          const iswit = await stoppromise.create({  
          user: returnValues.user,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp
        });

      } catch (e) {
        console.log("Error (StopedPromiseReward Event) :", e.message);
      }
    } else if (event == "NeedToRePurchase") {
      try {
        
          const iswit = await needtopurchase.create({  
          user: returnValues.user,
          packageId: returnValues.packageId,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp
        });

        if(iswit){
          await upgrade.updateMany(
            { user: returnValues.user, packageId: returnValues.packageId }, 
            { $set: { package_status: false } } 
          );  
          
          await newuserplace.updateMany(
            { referrer: returnValues.user, packageId: returnValues.packageId }, 
            { $set: { package_status: false } } 
          ); 
        }

      } catch (e) {
        console.log("Error (NeedToRePurchase Event) :", e.message);
      }
    }else if (event == "WeeklyFundContribution") {
      try {
        
          const iswit = await weeklyfund.create({  
          user: returnValues.user,
          amount: returnValues.amount,
          polAmt: returnValues.polAmt,
          txHash: transactionHash,
          block: blockNumber,
          timestamp: timestamp
        });

      } catch (e) {
        console.log("Error (weeklyfund Event) :", e.message);
      }
    }
  }
}

async function updateBlock(updatedBlock) {
  try {
    let isUpdated = await config2.updateOne(
      {},
      { $set: { lastSyncBlock: updatedBlock } }
    );
    if (!isUpdated) {
      console.log("Something went wrong!");
    }
  } catch (e) {
    console.log("Error Updating Block", e);
  }
}

async function planData(ratio, amount, curr) {
  //bUSDT-stUSD
  //console.log(ratio," ",amount," ",curr)
  if (ratio == 10 && curr == "WYZ-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "16.67",
      months: "12",
    };
    return data;
  } else if (ratio == 20 && curr == "WYZ-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "8.33",
      months: "24",
    };
    return data;
  } else if (ratio == 30 && curr == "WYZ-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "5.56",
      months: "36",
    };
    return data;
  } else if (ratio == 40 && curr == "WYZ-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "4.17",
    };
    return data;
  } else if (ratio == 50 && curr == "WYZ-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "3.33",
    };
    return data;
  } else if (ratio == 15 && curr == "sUSDT-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "11.11",
    };
    return data;
  } else if (ratio == 20 && curr == "sUSDT-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "8.33",
    };
    return data;
  } else if (ratio == 25 && curr == "sUSDT-stUSDT") {
    var data = {
      token1: ratio,
      token2: 100 - ratio,
      return2x: (amount * 2) / 1e18,
      xreturn3x: (amount * 3) / 1e18,
      apy: "6.67",
    };
    return data;
  }
}

async function updaterank() {
  try {
    const record = await SlotPurchased.findOne({ checked: 0 }).exec();
    if (record) {
      const poolId = record.slotId;
      let rank = "";
      let amount = 0;
      if (poolId == 1) {
        rank = "COMMUNITY MEMBER";
        amount = 7;
      } else if (poolId == 2) {
        rank = "BEGINNER";
        amount = 7;
      } else if (poolId == 3) {
        rank = "SEEKER";
        amount = 14;
      } else if (poolId == 4) {
        rank = "ENGAGER";
        amount = 14;
      } else if (poolId == 5) {
        rank = "MOTIVATOR";
        amount = 28;
      } else if (poolId == 6) {
        rank = "EXPLORER";
        amount = 28;
      } else if (poolId == 7) {
        rank = "SOLDIER";
        amount = 56;
      } else if (poolId == 8) {
        rank = "PROMOTER";
        amount = 56;
      } else if (poolId == 9) {
        rank = "ADVISOR";
        amount = 112;
      } else if (poolId == 10) {
        rank = "DIRECTOR";
        amount = 112;
      } else if (poolId == 11) {
        rank = "ACHIEVER";
        amount = 224;
      } else if (poolId == 12) {
        rank = "CREATOR";
        amount = 224;
      } else if (poolId == 13) {
        rank = "MENTOR";
        amount = 448;
      } else if (poolId == 14) {
        rank = "EXPERT";
        amount = 896;
      } else if (poolId == 15) {
        rank = "MASTER";
        amount = 1792;
      } else if (poolId == 16) {
        rank = "COMMUNITY LEGEND";
        amount = 3584;
      }

      await SlotPurchased.updateOne({ _id: record._id }, { $set: { checked: 1 } });

      await registration.updateOne(
        { user: record.user },
        {
          $set: { rank: rank, ranknumber: poolId },
          $inc: { invest_amount: amount },
        }
      );
    }
  } catch (error) {}
}

async function listEvent() {
  try{
  let lastSyncBlock = await getLastSyncBlock();
  let latestBlock = await web3.eth.getBlockNumber();
  let toBlock =
    latestBlock > lastSyncBlock + 1000 ? lastSyncBlock + 1000 : latestBlock;
  //console.log(lastSyncBlock, toBlock);
  let events = await getEventReciept(lastSyncBlock, toBlock);
  // console.log("events", events.length);

  await processEvents(events);
  await updateBlock(toBlock);
  if (lastSyncBlock == toBlock) {
    setTimeout(listEvent, 15000);
  } else {
    setTimeout(listEvent, 5000);
  }
} catch(error){
  console.log("error ",error)
  web3 = await getWorkingRpc();
  contract = new web3.eth.Contract(ABI, process.env.MAIN_CONTRACT);
  listEvent();
}
}

const rpcUrls = [
  'https://opbnb-testnet-rpc.bnbchain.org',
  'https://opbnb-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
  'https://opbnb-testnet-rpc.publicnode.com',
  'https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5',
  process.env.RPC_URL, // fallback to env variable
];

async function getWorkingRpc() {
  for (const url of rpcUrls) {
    try {
      console.log(`Trying RPC: ${url}`);
      const tempWeb3 = new Web3(new Web3.providers.HttpProvider(url));
      // Try to get the latest block to test the connection
      await tempWeb3.eth.getBlockNumber();
      console.log(`✅ Connected to ${url}`);
      return tempWeb3;
    } catch (error) {
      console.error(`❌ Failed to connect to ${url}:`, error.message);
    }
  }
  throw new Error('All RPC URLs failed');
}


// const updteschema=async()=>{
//   await registration.updateMany(
//    // { cal_status: 0, teamBusinessnew: 0 }, // Filter criteria
//    {},
//     { $set: { cal_status: 0, teamBusinessnew: 0 } } // Update operation
//   );

// }

const updateTeambussness = async () => {
  try {
    const data = await registration.aggregate([
      {
        $lookup: {
          from: "stake2",
          localField: "user",
          foreignField: "referral",
          as: "result",
        },
      },
    ]);
    return res.json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};


async function getLevelIds(user) {
  try {
    let uplines = [];
    const rec = await registration.findOne({ user: user }).exec();
    if (rec) {
      let currentReferrerId = rec.referrer;
      //console.log("currentReferrerId :: ",currentReferrerId)
      if (uplines.length == 0) {
        uplines.push(rec.referrer);
      }
      // console.log("currentReferrerId :: ",currentReferrerId)
      let i = 1;
      while (currentReferrerId) {
        const record = await registration
          .findOne({ user: currentReferrerId }, { referrer: 1 })
          .exec();

        if (!record) {
          break;
        }

        uplines.push(record.referrer);
        //console.log("referrer :: ",currentReferrerId)
        currentReferrerId = record.referrer;
      }

      return uplines;
    } else {
      return uplines;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getLevelIdsTill(user, till) {
  try {
    let uplines = [];
    const rec = await registration.findOne({ user: user }).exec();
    if (rec) {
      let currentReferrerId = rec.referrer;
      //console.log("currentReferrerId :: ",currentReferrerId)
      if (uplines.length == 0) {
        uplines.push(rec.referrer);
      }
      // console.log("currentReferrerId :: ",currentReferrerId)
      let i = 1;
      while (currentReferrerId) {
        const record = await registration
          .findOne({ user: currentReferrerId }, { referrer: 1 })
          .exec();

        if (!record) {
          break;
        }

        uplines.push(record.referrer);
        i++;

        if (i == till) {
          break;
        }
        //console.log("referrer :: ",currentReferrerId)
        currentReferrerId = record.referrer;
      }

      return uplines;
    } else {
      return uplines;
    }
  } catch (error) {
    console.log(error);
  }
}

async function level(txHash) {
  try {
    if (txHash != "") {
      const res = await findUplines(txHash);
      return res;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}

async function leveltop(txHash) {
  try {
    if (txHash != "") {
      const res = await findUplinestop(txHash);
      return res;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}



async function getReward(ratio, token) {
  if (ratio == "10" && token == "WYZ-stUSDT") {
    const rewdays = {
      month: "12",
      days: "365",
    };
    return rewdays;
  }

  if (ratio == "20" && token == "WYZ-stUSDT") {
    const rewdays = {
      month: "24",
      days: "730",
    };
    return rewdays;
  }

  if (ratio == "30" && token == "WYZ-stUSDT") {
    const rewdays = {
      month: "36",
      days: "1095",
    };
    return rewdays;
  }

  if (ratio == "40" && token == "WYZ-stUSDT") {
    const rewdays = {
      month: "48",
      days: "1460",
    };
    return rewdays;
  }

  if (ratio == "50" && token == "WYZ-stUSDT") {
    const rewdays = {
      month: "60",
      days: "1825",
    };
    return rewdays;
  }

  if (ratio == "15" && token == "sUSDT-stUSDT") {
    const rewdays = {
      month: "18",
      days: "548",
    };
    return rewdays;
  }

  if (ratio == "20" && token == "sUSDT-stUSDT") {
    const rewdays = {
      month: "24",
      days: "730",
    };
    return rewdays;
  }

  if (ratio == "25" && token == "sUSDT-stUSDT") {
    const rewdays = {
      month: "30",
      days: "913",
    };
    return rewdays;
  }
}


async function levelPercent(i) {
  if (i == 1) {
    return 10;
  } else if (i == 2) {
    return 5;
  } else if (i >= 3 && i <= 4) {
    return 3;
  } else if (i >= 5 && i <= 7) {
    return 2;
  } else if (i >= 8 && i <= 13) {
    return 1;
  } else if (i >= 14 && i <= 16) {
    return 2;
  } else if (i >= 17 && i <= 18) {
    return 3;
  } else if (i == 19) {
    return 5;
  } else if (i == 20) {
    return 10;
  }
}

async function levelPercentRecurr(i) {
  if (i == 1) {
    return 25;
  } else if (i == 2) {
    return 10;
  } else if (i == 3 || i == 4) {
    return 5;
  } else if (i == 5) {
    return 15;
  }
}

async function upids(user) {
  try {
    const uplevels = await getLevelIds(user);
    return uplevels;
  } catch (error) {
    console.log(error);
  }
}

async function updateStakeTeamBusiness() {
  try {
    const record = await stake2.findOne({ calteam_status: 0 }).exec();
    if (record) {
      const team = await upids(record.user);
      if (team.length > 0) {
        //await Promise.all(team.slice(1).map(async address => {
        await Promise.all(
          team.map(async (address) => {
            await registration.updateOne(
              { user: address },
              {
                $set: { staketeambusiness: record.amount }, // Replace 'record.amount' with your actual value
                //$inc: { staketeamCount: 1 } // Increment the team count by 1
              }
            );
          })
        );
      }
      await stake2.updateOne(
        { user: record.user },
        { $set: { calteam_status: 1 } }
      );
      //console.log("up teams ",team)
    }
  } catch (error) { }
}

async function updateTopupTeamBusiness() {
  try {
    const record = await Topup.findOne({ calteam_status: 0 }).exec();
    if (record) {
      const team = await upids(record.user);
      if (team.length > 0) {
        //await Promise.all(team.slice(1).map(async address => {
        await Promise.all(
          team.map(async (address) => {
            await registration.updateOne(
              { user: address },
              {
                $set: { staketeambusiness: record.amount }, // Replace 'record.amount' with your actual value
                //$inc: { staketeamCount: 1 } // Increment the team count by 1
              }
            );
          })
        );
      }
      await Topup.updateOne(
        { user: record.user },
        { $set: { calteam_status: 1 } }
      );
      //console.log("up teams ",team)
    }
  } catch (error) { }
}

async function updateWithdrawDates() {
  const currentTime = new Date();
  const thirtyMinutesInMs = 30 * 60 * 1000;
  const thirtyOneMinutesInMs = 31 * 60 * 1000;

  try {
    console.log("currentTime :: ", currentTime);
    const recordsToUpdate = await stakeRegister.find({
      withdraw_endate: { $lt: currentTime },
    });
    //console.log(recordsToUpdate)
    if (recordsToUpdate) {
      const bulkOps = recordsToUpdate.map((record) => {
        return {
          updateOne: {
            filter: { _id: record._id },
            update: {
              $set: {
                withdraw_stdate: new Date(
                  record.withdraw_stdate.getTime() + thirtyMinutesInMs
                ),
                withdraw_endate: new Date(
                  record.withdraw_endate.getTime() + thirtyOneMinutesInMs
                ),
              },
            },
          },
        };
      });

      if (bulkOps.length > 0) {
        await stakeRegister.bulkWrite(bulkOps);
        console.log("roi withdraw time updated successfully.");
      } else {
        console.log("No roi withdraw time to update.");
      }
    } else {
      console.log("No roi withdraw time to update.");
    }
    // for referral withdrawal

    const ToUpdate = await stakeRegister.find({
      withdrawref_endate: { $lt: currentTime },
    });
    if (ToUpdate) {
      const bulkrefOps = ToUpdate.map((record) => {
        return {
          updateOne: {
            filter: { _id: record._id },
            update: {
              $set: {
                withdraw_stdate: new Date(
                  record.withdrawref_stdate.getTime() + thirtyMinutesInMs
                ),
                withdraw_endate: new Date(
                  record.withdrawref_endate.getTime() + thirtyOneMinutesInMs
                ),
              },
            },
          },
        };
      });

      if (bulkrefOps.length > 0) {
        await stakeRegister.bulkWrite(bulkrefOps);
        console.log("referral withdraw time updated successfully.");
      } else {
        console.log("No referral withdraw time to update.");
      }
    } else {
      console.log("No referral withdraw time to update.");
    }
  } catch (error) {
    console.error("Error updating records:", error);
  }
}

async function findAllDescendantsOld(referrer) {
  const allUserIds = new Set();
  let currentLevel = [referrer];

  while (currentLevel.length > 0) {
    const directMembers = await registration.aggregate([
      { $match: { referrer: { $in: currentLevel } } },
      { $group: { _id: null, users: { $addToSet: "$user" } } },
    ]);

    if (directMembers.length === 0) {
      break;
    }

    currentLevel = directMembers[0].users;
    currentLevel.forEach((id) => allUserIds.add(id));
  }

  return Array.from(allUserIds);
}

async function findAllDescendants(referrer) {
  const allUserIds = new Set();
  let currentLevel = [referrer];
  let firstIteration = true;

  while (currentLevel.length > 0) {
    const directMembers = await registration.aggregate([
      { $match: { referrer: { $in: currentLevel } } },
      { $group: { _id: null, users: { $addToSet: "$user" } } },
    ]);

    if (directMembers.length === 0) {
      break;
    }

    currentLevel = directMembers[0].users;

    if (!firstIteration) {
      currentLevel.forEach((id) => allUserIds.add(id));
    }
    firstIteration = false;
  }

  return Array.from(allUserIds);
}

async function setTeamBusiness() {
  try {
    // Step 1: Get all users from stakeRegister
    const allUsers = await registration.distinct("user");

    // Step 2: For each user, find all team members recursively and sum their investments
    for (const user of allUsers) {
      const allTeamMembers = await findAllDescendants(user);
      const dirbizz = await calculateDirectsesy(user);
      // Aggregate amounts from stake2 schema
      const stake2Result = await stake2.aggregate([
        { $match: { user: { $in: allTeamMembers } } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      const stake2TotalAmount =
        stake2Result.length > 0 ? stake2Result[0].totalAmount : 0;

      // Sum the amounts from both schemas
      const totalAmount = stake2TotalAmount;
      const directplus = totalAmount + dirbizz;
      // Update the registration collection with the total team business amount
      await registration.updateOne(
        { user: user },
        {
          $set: {
            staketeambusiness: totalAmount,
            directplusteambiz: directplus,
            directbusiness: dirbizz,
          },
        }
      );
    }

    console.log("Team business update done");
    return true;
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function calculateDirects(walletAddress) {
  try {
    // Step 1: Find direct members from the registration schema
    const directMembers = await registration
      .find({ referrer: walletAddress })
      .select("user");
    const userIds = directMembers.map((member) => member.user);

    // Step 2: Find corresponding records in the stake2 schema and sum the amount
    const stakeResult = await stake2.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const stakeTotalAmount =
      stakeResult.length > 0 ? stakeResult[0].totalAmount : 0;

    // Step 3: Find corresponding records in the topup schema and sum the amount
    const topupResult = await Topup.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const topupTotalAmount =
      topupResult.length > 0 ? topupResult[0].totalAmount : 0;

    // Step 4: Return the sum of amounts from both schemas
    return stakeTotalAmount + topupTotalAmount;
  } catch (error) {
    console.error("Error in function:", error);
    throw new Error("Internal Server Error");
  }
}

async function calculateDirectsesy(walletAddress) {
  try {
    // Step 1: Find direct members from the registration schema
    const directMembers = await stakedirect
      .find({ referrer: walletAddress })
      .select("user");
    const userIds = directMembers.map((member) => member.user);

    // Step 2: Find corresponding records in the stakeRegister schema and sum the topupAmount
    const stakeRegisterResult = await registration.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$stake_amount" } } },
    ]);
    const stakeRegisterTotalAmount =
      stakeRegisterResult.length > 0 ? stakeRegisterResult[0].totalAmount : 0;

    // Step 3: Return the total amount
    return stakeRegisterTotalAmount;
  } catch (error) {
    console.error("Error in function:", error);
    throw new Error("Internal Server Error");
  }
}

async function sendRankReward() {
  try {
    const rewa = await stakeReward.findOne({ send_status: 0 }).exec();
    if (rewa) {
      const amount = rewa.amount;
      const isupd = await stakeRegister.updateOne(
        { user: rewa.user },
        { $inc: { wallet_rewards: amount, rankbonus: amount } }
      );
      if (isupd.modifiedCount > 0) {
        await stakeReward.updateOne(
          { _id: rewa._id },
          { $set: { send_status: 1 } }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}

async function calculatePoolReward() {
  try {
    // Calculate the date 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Aggregate sums from Stake2 collection
    const stake2Result = await stake2.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const stake2Sum = stake2Result.length > 0 ? stake2Result[0].totalAmount : 0;

    // Calculate the combined sum
    const totalSum = stake2Sum;
    console.log("totalSum ", totalSum);
    // for income of POOL 10000

    const pool50k = await stakeReward.find({ targetbusiness: 10000 });

    const poolfiftyk = pool50k;

    if (poolfiftyk) {
      const stakePercentage = 0.03; // 3%
      const poolfiftykIncome = totalSum * stakePercentage; // 0.5% of totalSum
      console.log("amount to give 10000", poolfiftykIncome);
      const numofuser = poolfiftyk.length;
      console.log("numofuser ", numofuser);
      const peruseramount = poolfiftykIncome / numofuser;
      console.log("peruseramount ", peruseramount);

      const txn_id = await generateRandomString(19);
      // Iterate over each user in the pool and calculate their share
      for (const user of poolfiftyk) {
        // Insert record in stakePoolIncome schema
        const stakePoolIncome = await stakepoolincome.create({
          user: user.user,
          amount: peruseramount,
          percent: stakePercentage,
          pool: 10000,
          txn_id: txn_id, // Replace with actual transaction ID
          totalBusiness: totalSum,
        });

        await stakePoolIncome.save();
      }
    }

    // for income of POOL 50000

    const pool50000 = await stakeReward.find({ targetbusiness: 50000 });

    const poolfiftykcto = pool50000;

    if (poolfiftykcto) {
      const stakePercentage = 0.02; // 3%
      const poolfiftykIncome = totalSum * stakePercentage; // 0.5% of totalSum
      console.log("amount to give 50000", poolfiftykIncome);
      const numofuser = poolfiftykcto.length;
      console.log("numofuser ", numofuser);
      const peruseramount = poolfiftykIncome / numofuser;
      console.log("peruseramount ", peruseramount);

      const txn_id = await generateRandomString(19);
      // Iterate over each user in the pool and calculate their share
      for (const user of poolfiftykcto) {
        // Insert record in stakePoolIncome schema
        const stakePoolIncome = await stakepoolincome.create({
          user: user.user,
          amount: peruseramount,
          percent: stakePercentage,
          pool: 50000,
          txn_id: txn_id, // Replace with actual transaction ID
          totalBusiness: totalSum,
        });

        await stakePoolIncome.save();
      }
    }

    // for income of POOL 100000

    const poollakh = await stakeReward.find({ targetbusiness: 100000 });

    const poollakhcto = poollakh;

    if (poollakhcto) {
      const stakePercentage = 0.01; // 3%
      const poolfiftykIncome = totalSum * stakePercentage; // 0.5% of totalSum
      console.log("amount to give 100000", poolfiftykIncome);
      const numofuser = poollakhcto.length;
      console.log("numofuser ", numofuser);
      const peruseramount = poolfiftykIncome / numofuser;
      console.log("peruseramount ", peruseramount);

      const txn_id = await generateRandomString(19);
      // Iterate over each user in the pool and calculate their share
      for (const user of poollakhcto) {
        // Insert record in stakePoolIncome schema
        const stakePoolIncome = await stakepoolincome.create({
          user: user.user,
          amount: peruseramount,
          percent: stakePercentage,
          pool: 100000,
          txn_id: txn_id, // Replace with actual transaction ID
          totalBusiness: totalSum,
        });

        await stakePoolIncome.save();
      }
    }
  } catch (error) {
    console.error("Error summing amounts:", error);
  }
}

async function getMonthRange(joiningDateStr) {
  // Parse the joining date string to a Date object
  const joiningDate = new Date(joiningDateStr);

  // Get the current date
  const currentDate = new Date();

  // Extract the day from the joining date
  const joiningDay = joiningDate.getDate();

  // Construct the start date for the current month based on the joining day
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    joiningDay
  );

  // Construct the end date for the current month by adding one month to the start date
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  // Format the dates to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get the formatted start and end dates
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  return { startDate: startDateStr, endDate: endDateStr };
}

async function sumBizInAMonth(joindate, startDate, endDate, userAddr) {
  const directMembers = await stakedirect
    .find({ referrer: userAddr })
    .select("user");
  const userIds = directMembers.map((member) => member.user);
  //console.log("Directs team ",userIds)
  console.log("joindate ", joindate);
  console.log("startDate ", startDate);
  console.log("endDate ", endDate);
  console.log("userAddr ", userAddr);
  // Step 2: Find corresponding records in the stakeRegister schema and sum the topupAmount
  console;
  const stake2Result = await stake2.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalStake2: { $sum: "$amount" },
      },
    },
  ]);

  // Aggregate Topup amounts
  const topupResult = await Topup.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalTopup: { $sum: "$amount" },
      },
    },
  ]);

  const totalStake2 = stake2Result[0] ? stake2Result[0].totalStake2 : 0;
  const totalTopup = topupResult[0] ? topupResult[0].totalTopup : 0;
  const totalSum = totalStake2 + totalTopup;

  // direct count

  const count = await stakedirect.countDocuments({
    referrer: userAddr,
    createdAt: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
  });

  // previous month count

  const prevstake2Result = await stake2.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: {
          $gte: new Date(joindate),
          $lt: new Date(startDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalStake2: { $sum: "$amount" },
      },
    },
  ]);

  // Aggregate Topup amounts
  const prevtopupResult = await Topup.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: {
          $gte: new Date(joindate),
          $lt: new Date(startDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalTopup: { $sum: "$amount" },
      },
    },
  ]);

  const prevResult = prevstake2Result[0] ? prevstake2Result[0].totalStake2 : 0;
  const prevTopup = prevtopupResult[0] ? prevtopupResult[0].totalTopup : 0;
  const prevBiz = prevResult + prevTopup;

  const prevcount = await stakedirect.countDocuments({
    referrer: userAddr,
    createdAt: {
      $gte: new Date(joindate),
      $lt: new Date(startDate),
    },
  });

  return {
    monthBiz: totalSum,
    monthDir: count,
    prevBiz: prevBiz,
    prevDir: prevcount,
  };
}

async function sendPoolReward() {
  try {
    const rewa = await stakepoolincome
      .findOne({ send_status: 0 })
      .limit(1)
      .exec();
    if (rewa) {
      const amount = rewa.amount;

      // Get the user's totalIncome and return limit
      const userRecord = await registration
        .findOne({ user: rewa.user }, { totalIncome: 1, return: 1 })
        .exec();
      if (userRecord) {
        await stakepoolincome.updateOne(
          { _id: rewa._id },
          { $set: { send_status: 1 } }
        );
        const totalIncome = userRecord.totalIncome || 0;
        const maxLimit = userRecord.return || 0;

        // Check if the new amount can be added
        if (amount + totalIncome < maxLimit) {
          const isupd = await registration.updateOne(
            { user: rewa.user },
            {
              $inc: {
                wallet_income: amount,
                poolbonus: amount,
                totalIncome: amount,
              },
            }
          );

          // if (isupd.modifiedCount > 0) {

          // }
        } else {
          await stakepoolincome.updateOne(
            { _id: rewa._id },
            { $set: { lapse_status: 1 } }
          );
          console.log(`Cannot add amount. Exceeds return limit: ${maxLimit}`);
        }
      } else {
        console.log(`User record not found for user: ${rewa.user}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// async function sendPoolReward(){
//   try {
//   const rewa = await stakepoolincome.findOne({ send_status : 0 }).limit(1).exec();
//   if(rewa){
//     const amount = rewa.amount
//     const isupd = await registration.updateOne({ user : rewa.user }, { $inc : { wallet_income : amount, poolIncome : amount } })
//     if(isupd.modifiedCount > 0){
//       await stakepoolincome.updateOne({ _id : rewa._id},{ $set : { send_status : 1 }})
//     }
//   }
//   } catch (error){
//   console.log(error)
//   }
// }

function calculateIncomeAndPackage(investment, planname) {
  let monthlyRate;
  let packageName;
  if (planname == "Flexi") {
    if (investment >= 60 && investment <= 1000) {
      monthlyRate = 0.06; // 6%
      packageName = "Gold";
    } else if (investment > 1000 && investment <= 3000) {
      monthlyRate = 0.09; // 9%
      packageName = "Platinum";
    } else if (investment > 3000 && investment <= 10000) {
      monthlyRate = 0.12; // 12%
      packageName = "Diamond";
    }
  } else if (planname == "Fix") {
    if (investment >= 60 && investment <= 1000) {
      monthlyRate = 0.09; // 6%
      packageName = "Gold";
    } else if (investment >= 1000 && investment <= 3000) {
      monthlyRate = 0.12; // 9%
      packageName = "Platinum";
    } else if (investment > 3000 && investment <= 10000) {
      monthlyRate = 0.15; // 12%
      packageName = "Diamond";
    }
  }
  const perDayIncome = (investment * monthlyRate) / 30; // Assuming 30 days in a month

  return {
    perDayIncome: perDayIncome,
    packageName: packageName,
  };
}

async function setPoolAchievers() {
  try {
    // Step 1: Get all users from stakeRegister
    const allUsers = await registration.distinct("user");

    // Step 2: For each user, find all team members recursively and sum their investments
    for (const user of allUsers) {
      const udata = await registration.findOne(
        { user: user },
        { ranknumber: 1 }
      );
      const currentRank = udata.ranknumber;
      const bizratio = await calculateseventythirty(user);
      const seventy = bizratio.seventy;
      const thirty = bizratio.thirty;
      console.log("seventy ", seventy);
      console.log("thirty ", thirty);

      console.log("currentRank :: ", currentRank);
      if (currentRank == 0) {
        const eligseventy = 5000;
        const eligthirty = 5000;

        if (seventy >= eligseventy && thirty >= eligthirty) {
          const seeRew = await stakeReward.findOne({ user: user, rankno: 1 });
          if (!seeRew) {
            await stakeReward.create({
              user: user,
              targetbusiness: 10000,
              rankno: 1,
              powerleg: seventy,
              weakleg: thirty,
            });
            await registration.updateOne(
              { user: user },
              { $set: { ranknumber: 1 } }
            );
          }
        }
      }

      if (currentRank == 1) {
        const eligseventy = 25000;
        const eligthirty = 25000;

        if (seventy >= eligseventy && thirty >= eligthirty) {
          const seeRew = await stakeReward.findOne({ user: user, rankno: 2 });
          if (!seeRew) {
            await stakeReward.create({
              user: user,
              targetbusiness: 50000,
              rankno: 2,
              powerleg: seventy,
              weakleg: thirty,
            });
            await registration.updateOne(
              { user: user },
              { $set: { ranknumber: 2 } }
            );
          }
        }
      }

      if (currentRank == 2) {
        const eligseventy = 50000;
        const eligthirty = 50000;

        if (seventy >= eligseventy && thirty >= eligthirty) {
          const seeRew = await stakeReward.findOne({ user: user, rankno: 3 });
          if (!seeRew) {
            await stakeReward.create({
              user: user,
              targetbusiness: 100000,
              rankno: 3,
              powerleg: seventy,
              weakleg: thirty,
            });
            await registration.updateOne(
              { user: user },
              { $set: { ranknumber: 3 } }
            );
          }
        }
      }
    }

    console.log("Team CTO update done");
    return true;
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function calculateseventythirty(walletAddress) {
  try {
    // to calculate 70 and 30 percent in diferent legs
    const records = await registration
      .find({ referrer: walletAddress })
      .sort({ directplusteambiz: -1 })
      .exec();
    if (records.length > 1) {
      const highestValue = records[0].directplusteambiz;
      //var seventyPercentOfHighest = highestValue * 0.7;
      var seventyPercentOfHighest = highestValue;

      var thirtyPercentOfRemainingSum = 0;

      if (records.length > 1) {
        // Step 4: Sum the remaining directplusteambiz values
        const remainingSum = records
          .slice(1)
          .reduce((acc, record) => acc + record.directplusteambiz, 0);
        //thirtyPercentOfRemainingSum = remainingSum * 0.3;
        thirtyPercentOfRemainingSum = remainingSum;
      }

      // Total calculated value
      const totalCalculatedValue =
        seventyPercentOfHighest + thirtyPercentOfRemainingSum;
    } else {
      var seventyPercentOfHighest = 0;
      var thirtyPercentOfRemainingSum = 0;
    }

    return {
      seventy: seventyPercentOfHighest,
      thirty: thirtyPercentOfRemainingSum,
    };
    console.log("seventyPercentOfHighest :: ", seventyPercentOfHighest);
    console.log("thirtyPercentOfRemainingSum :: ", thirtyPercentOfRemainingSum);
    // to calculate 70 and 30 percent in diferent legs
  } catch (error) {
    console.log(error);
  }
}

async function weeklyglobal() {
  try {
    // Step 1: Get all distinct users from registration
    const allUsers = await registration.distinct("user");

    // Step 2: Define the time range (last 7 days to now) using full datetime
    const dateto = new Date(); // current time
    const datefrom = new Date();
    datefrom.setDate(dateto.getDate() - 7); // exactly 7 days ago


    // Step 3: Calculate the total weekly fund in that exact time window
    const weeklyfundData = await weeklyfund.aggregate([
      {
        $match: {
          createdAt: { $gt: datefrom, $lte: dateto }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const totalWeeklyFund = weeklyfundData[0]?.totalAmount/1e18 || 0;

    // Step 4: Collect qualified users and their number of weekly directs
    const qualifiedUsers = [];

    for (const user of allUsers) {
      const direct_member = await registration.countDocuments({
        referrer: user,
        createdAt: { $gt: datefrom, $lte: dateto }
      });

      // Only include if at least 1 direct was added
      if (direct_member > 0) {
        qualifiedUsers.push({ user, direct_member });
      }
    }

    // Step 5: Calculate total directs from all qualified users
    const totalDirects = qualifiedUsers.reduce((sum, obj) => sum + obj.direct_member, 0);

    // Step 6: Distribute fund proportionally
    for (const qUser of qualifiedUsers) {
      const shareRatio = qUser.direct_member / totalDirects;
      const income = totalWeeklyFund * shareRatio;

      const seeRew = await globalreward.findOne({ user: qUser.user, lifetimerankno: 1 });
      if (!seeRew) {
        await globalreward.create({
          user: qUser.user,
          amount: income,
          directs: qUser.direct_member,
          shareratio : shareRatio*100,
          weeklyfund: totalWeeklyFund,
          polAmt: 0,
          datefrom,
          dateto
        });

        await registration.updateOne(
          { user: qUser.user },
          { $inc: { unity_income: income, allunity_income: income } }
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Error in API:", error);
    throw new Error("Internal Server Error");
  }
}


// cron.schedule('* * * * *', async () => {
//   updaterank();
//   // await updateStakeTeamBusiness();
//   // await updateTopupTeamBusiness();
//   console.log('Setting total Invest');
// });

// cron.schedule('*/20 * * * *', async () => {
//   setPoolAchievers();
//   // await updateStakeTeamBusiness();
//   // await updateTopupTeamBusiness();
//   console.log('Team CTO updated');
// });

//   cron.schedule('*/3 * * * *', async () => {
//     levelIncome();
//     topuplevelIncome();
//    //console.log('setting last Withdrawal');
//  });

listEvent();

//  cron.schedule('*/10 * * * *', async () => {
//   roiwallet();
//  });
//  cron.schedule('*/10 * * * *', async () => {
//   levelOnRoi();
//  });

// cron.schedule('*/2 * * * *', async () => {
//  //sendRankReward();
//  sendPoolReward();

// });

// cron.schedule(
//   "0 1 * * *", // Run at 1:00 AM IST every day
//   () => {
//     roiwallet();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata for IST
//   }
// );

// cron.schedule(
//   "0 3 * * *", // Run at 1:00 AM IST every day
//   () => {
//     topuproi();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata for IST
//   }
// );

cron.schedule(
  "30 10 * * 5", // At 10:30 AM every Friday
  () => {
    weeklyglobal();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set the timezone to IST
  }
);

//setInterval(updateWithdrawDates, 30000);
//setTeamBusiness();

cron.schedule("* * * * *", async () => {
  await updateExpiredPackages();
});

const server = app.listen(8080, () => {
  console.log("Server running!");
});
