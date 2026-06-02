// templates/weeklyDigestTemplate.js

const weeklyDigestTemplate = ({ pendingRequests, profileLink }) => {
  return {
    subject: `📬 You have ${pendingRequests} pending connection request${
      pendingRequests !== 1 ? "s" : ""
    } on DevFinder`,

    htmlBody: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  
  <body
    style="
      margin:0;
      padding:0;
      background:#0F0F0F;
      font-family:Arial, Helvetica, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">
  
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background:#1A1A1A;
              border-radius:16px;
              overflow:hidden;
              border:1px solid #27272A;
            "
          >
  
            <tr>
              <td
                style="
                  background:#111111;
                  padding:30px;
                  text-align:center;
                  border-bottom:1px solid #27272A;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#8B5CF6;
                    font-size:32px;
                    font-weight:700;
                  "
                >
                  DevFinder
                </h1>
              </td>
            </tr>
  
            <tr>
              <td style="padding:40px;">
  
                <h2
                  style="
                    color:#FFFFFF;
                    margin-top:0;
                    margin-bottom:20px;
                  "
                >
                  📬 Weekly Connection Summary
                </h2>
  
                <p
                  style="
                    color:#D4D4D8;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  Here's a quick update from your developer network.
                </p>
  
                <div
                  style="
                    background:#111111;
                    border:1px solid #27272A;
                    border-radius:12px;
                    padding:28px;
                    margin:30px 0;
                    text-align:center;
                  "
                >
                  <div
                    style="
                      font-size:48px;
                      font-weight:700;
                      color:#8B5CF6;
                      margin-bottom:10px;
                    "
                  >
                    ${pendingRequests}
                  </div>
  
                  <div
                    style="
                      color:#D4D4D8;
                      font-size:18px;
                    "
                  >
                    Pending Connection Request${
                      pendingRequests !== 1 ? "s" : ""
                    }
                  </div>
                </div>
  
                <p
                  style="
                    color:#D4D4D8;
                    line-height:1.7;
                  "
                >
                  Developers are waiting to connect with you.
                  Review your requests and expand your professional network.
                </p>
  
                <div
                  style="
                    text-align:center;
                    margin-top:35px;
                  "
                >
                  <a
                    href="${profileLink}"
                    style="
                      display:inline-block;
                      background:#8B5CF6;
                      color:#FFFFFF;
                      text-decoration:none;
                      padding:14px 32px;
                      border-radius:10px;
                      font-weight:700;
                      font-size:15px;
                    "
                  >
                    Review Requests
                  </a>
                </div>
  
                <hr
                  style="
                    border:none;
                    border-top:1px solid #27272A;
                    margin:40px 0;
                  "
                />
  
                <p
                  style="
                    color:#71717A;
                    font-size:12px;
                    text-align:center;
                    margin:0;
                  "
                >
                  You're receiving this email because you have a DevFinder account.
                </p>
  
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  </body>
  </html>
      `,

    textBody: `
  📬 DevFinder Weekly Digest
  
  You currently have ${pendingRequests} pending connection request${
      pendingRequests !== 1 ? "s" : ""
    }.
  
  Review your requests here:
  
  ${profileLink}
  
  Keep growing your developer network on DevFinder 🚀
  `,
  };
};

module.exports = weeklyDigestTemplate;
