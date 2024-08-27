import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:area57sout.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export default webpush;
