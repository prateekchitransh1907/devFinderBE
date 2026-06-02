const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequestModel = require("../models/connectionRequest");
const { sendEmail } = require("../services/emailService");
const weeklyDigestTemplate = require("../emailTemplates/weeklyDigestTemplate");

console.log("🚀 weeklyDigest.js loaded");
// Every Monday at 8:00 AM
cron.schedule("0 8 * * 1", async () => {
  console.log("Running weekly digest task...");

  try {
    // For demo purposes, we'll look at requests created yesterday
    // const yesterday = subDays(new Date(), 1);

    // const yesterdayStart = startOfDay(yesterday);
    // const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequestModel
      .find({
        status: "INTERESTED",
      })
      .populate("receiverId", "firstName lastName emailId");

    // const usersMap = {};

    // // Group requests by receiver
    // pendingRequests.forEach((request) => {
    //   const receiverId = request.receiverId._id.toString();

    //   if (!usersMap[receiverId]) {
    //     usersMap[receiverId] = {
    //       firstName: request.receiverId.firstName,
    //       email: request.receiverId.emailId,
    //       pendingCount: 0,
    //     };
    //   }

    //   usersMap[receiverId].pendingCount++;
    // });

    // console.log(
    //   `Found ${Object.keys(usersMap).length} users with pending requests`
    // );

    // // SES Sandbox: send only to your verified email

    // // const template = weeklyDigestTemplate({
    // //   pendingRequests: pendingRequests.length,
    // //   profileLink: "https://dev-finder.com/connections/requests",
    // // });

    // for (const user of Object.values(usersMap)[0]) {
    //   try {
    //     const template = weeklyDigestTemplate({
    //       pendingRequests: user.pendingCount,
    //       profileLink: "https://dev-finder.com/connections/requests",
    //     });

    //     await sendEmail({
    //       // Sandbox: keep your verified email
    //       toAddress: "prateekchitransh@gmail.com",

    //       // Production:
    //       // toAddress: user.email,

    //       fromAddress: "weekly-digest@dev-finder.com",
    //       ...template,
    //     });

    //     console.log(
    //       `Digest sent for ${user.firstName} (${user.pendingCount} requests)`
    //     );
    //   } catch (err) {
    //     console.error(`Failed sending digest for ${user.firstName}`, err);
    //   }
    // }

    const totalPendingRequests = pendingRequests.length;

    const template = weeklyDigestTemplate({
      pendingRequests: totalPendingRequests,
      profileLink: "https://dev-finder.com/connections/requests",
    });

    await sendEmail({
      toAddress: "prateekchitransh@gmail.com",
      fromAddress: "weekly-digest@dev-finder.com",
      ...template,
    });

    console.log("Weekly digest email sent successfully");
  } catch (err) {
    console.error("Error in weekly digest task:", err);
  }

  console.log("Weekly digest task completed.");
});
