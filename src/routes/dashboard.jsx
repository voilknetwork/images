
import Login from "../views/Login.jsx";
import Welcome from "../views/Welcome.jsx";
import Logout from "../views/Logout.jsx";
import Images from "../views/Images.jsx";

var dashRoutes = [
  {
    path: "/home",
    name: "Home",
    icon: "fas fa-bell",
    component: Welcome
  },
  {
    path: "/login",
    name: "Login",
    icon: "fas fa-bell",
    component: Login
  },
  {
    path: "/@:username",
    name: "Username",
    icon: "fas fa-sign-out-alt",
    component: Images
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "fas fa-sign-out-alt",
    component: Logout
  },
  { redirect: true, path: "/", pathTo: "/home", name: "Welcome" }
];
export default dashRoutes;