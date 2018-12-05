import axios from "axios";

var instance = axios.create({
  // addittional configuration more protection
  xsrfCookieName: "mytoken",
  xsrfHeaderName: "csrf-token"
});

export default instance;
