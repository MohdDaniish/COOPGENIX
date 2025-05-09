const mongoose = require("../connection");
const PoolExpiry = require("../model/poolexpiry"); // replace with actual path
const NewUserPlace = require("../model/newuserplace"); // replace with actual path
const PackageBuy = require("../model/packagebuy"); // replace with actual path
const listexpire = require("../model/listexpire");

async function updateExpiredPackages() {
    try {
      //const now = new Date();
      const now = Math.floor(Date.now() / 1000);
  
      // Step 1: Find expired records in poolexpiry
      const expiredPackages = await PoolExpiry.find({
        package_status: true,
        expiry: { $lte: now },
      });
  
      if (expiredPackages.length === 0) return;
  
      // Step 2: Update poolexpiry
      const bulkPoolUpdates = expiredPackages.map(pkg => ({
        updateOne: {
          filter: { _id: pkg._id },
          update: { $set: { package_status: false } }
        }
      }));
      await PoolExpiry.bulkWrite(bulkPoolUpdates);
  
      // Step 3: Update newuserplace
      const bulkNewUserPlaceUpdates = expiredPackages.map(pkg => ({
        updateMany: {
          filter: {
            referrer: pkg.user,
            packageId: pkg.packageId,
          },
          update: { $set: { package_status: false } }
        }
      }));
      await NewUserPlace.bulkWrite(bulkNewUserPlaceUpdates);
  
      // Step 4: Update packagebuy
      const bulkPackageBuyUpdates = expiredPackages.map(pkg => ({
        updateMany: {
          filter: {
            user: pkg.user,
            packageId: pkg.packageId,
          },
          update: { $set: { package_status: false } }
        }
      }));
      await PackageBuy.bulkWrite(bulkPackageBuyUpdates);

        // Step 5: Save records into listexpire schema
    const listExpireRecords = expiredPackages.map(pkg => ({
      user: pkg.user,
      packageId: pkg.packageId,
      expiry: pkg.expiry
    }));
    await listexpire.insertMany(listExpireRecords);
  
      console.log(`Updated ${expiredPackages.length} expired packages.`);
    } catch (err) {
      console.error("Error updating expired packages:", err);
    }
  }

module.exports = updateExpiredPackages;