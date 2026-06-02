// templates/connectionRequestTemplate.js

const connectionRequestTemplate = ({
  senderName,
  senderHeadline,
  profileLink,
}) => {
  return {
    subject: `🚀 ${senderName} wants to connect with you on DevFinder`,

    htmlBody: `
     <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#0F0F0F;font-family:Arial,sans-serif;">
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
                  border:1px solid #27272A;
                "
              >
                <tr>
                  <td
                    style="
                      background:#111111;
                      padding:30px;
                      text-align:center;
                    "
                  >
                    <h1
                      style="
                        margin:0;
                        color:#8B5CF6;
                        font-size:32px;
                      "
                    >
                      DevFinder
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#FFFFFF;">
                      🚀 New Connection Request
                    </h2>

                    <p style="color:#D4D4D8;">
                      <strong>${senderName}</strong> wants to connect with you.
                    </p>

                    <div
                      style="
                        background:#111111;
                        border:1px solid #27272A;
                        border-radius:12px;
                        padding:20px;
                        margin:24px 0;
                      "
                    >
                      <h3 style="margin:0;color:#FFFFFF;">
                        ${senderName}
                      </h3>

                      <p style="color:#A1A1AA;">
                        ${senderHeadline || "Developer"}
                      </p>
                    </div>

                    <p style="color:#D4D4D8;">
                      Expand your network and discover new opportunities.
                    </p>

                    <a
                      href="${profileLink}"
                      style="
                        display:inline-block;
                        background:#8B5CF6;
                        color:white;
                        text-decoration:none;
                        padding:14px 30px;
                        border-radius:10px;
                        font-weight:bold;
                      "
                    >
                      View Profile
                    </a>
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
  ${senderName} wants to connect with you.
  
  Headline:
  ${senderHeadline}
  
  Profile:
  ${profileLink}
  `,
  };
};

module.exports = connectionRequestTemplate;
