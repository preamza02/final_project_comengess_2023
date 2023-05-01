const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";
var final_des_url;

exports.authApp = (req, res) => {
    const redirect = req.params.redirect;
    final_des_url = redirect
    // console.log(req)
    // console.log(authorization_url)
    res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

        const tokenReq = https.request(
            access_token_url,
            tokenOptions,
            (tokenRes) => {
                let tokenData = "";
                tokenRes.on("data", (chunk) => {
                    tokenData += chunk;
                });
                tokenRes.on("end", () => {
                    const token = JSON.parse(tokenData);
                    req.session.token = token;
                    // console.log(req.session);
                    if (token) {
                        res.writeHead(302, {
                            Location: final_des_url,
                            // Location: `http://localhost:3000/courseville/profile`,
                        });
                        res.end();
                    }
                });
            }
        );
        tokenReq.on("error", (err) => {
            console.error(err);
        });
      }
    );
    tokenReq.on("error", (err) => {
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};
exports.logout = (req, res) => {
    const redirect = req.params.redirect;
    req.session.destroy();
    res.redirect(redirect);
    res.end();
};

exports.getProfileInformation = (req, res) => {
    // console.log(req.session.token)
    // console.log("-----------------------------------------------")
    try {
        const profileOptions = {
            headers: {
                Authorization: `Bearer ${req.session.token.access_token}`,
            },
        };
        const profileReq = https.request(
            "https://www.mycourseville.com/api/v1/public/get/user/info",
            profileOptions,
            (profileRes) => {
                // console.log(req.session.token
                let profileData = "";
                profileRes.on("data", (chunk) => {
                    profileData += chunk;
                });
                profileRes.on("end", () => {
                    const profile = JSON.parse(profileData);
                    const true_profile = {
                        "is_login": true,
                        "student": {
                          "id": profile.data.student.id,
                          "title_th": profile.data.student.id,
                          "firstname_th": profile.data.student.firstname_th,
                          "lastname_th": profile.data.student.lastname_th,
                          "title_en": profile.data.student.title_en,
                          "firstname_en": profile.data.student.firstname_en,
                          "lastname_en": profile.data.student.lastname_en,
                          "degree" : profile.data.student.degree,
                        },
                        "account": {
                          uid: profile.data.account.uid,
                          profile_pict: profile.data.account.profile_pict,
                        }
                      }
                    console.log(true_profile)
                    res.send(true_profile);
                    res.end();
                });
            }
        );
        profileReq.on("error", (err) => {
            console.error(err);
        });
        profileReq.end();
    } catch (error) {
        const mock = {
            "is_login": false,
            "student": {
              "id": "",
              "title_th": "",
              "firstname_th": "",
              "lastname_th": "",
              "title_en": "",
              "firstname_en": "",
              "lastname_en": "",
              "degree": "",
            },
            "account": {
                "uid": "",
                "profile_pict": "",
              }
          }
        console.log(error);
        console.log("Please logout, then login again.");
        console.log(mock);
        res.send(mock);
        res.end();
    }
};
