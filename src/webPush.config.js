import webPush from "web-push";

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  "mailto:area57sout.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

export default webPush
