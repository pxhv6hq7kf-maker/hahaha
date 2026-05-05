import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Industry from "./pages/Industry";
import Enterprise from "./pages/Enterprise";
import Report from "./pages/Report";
import FollowEnterprise from "./pages/FollowEnterprise";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", Component: Home },
      { path: "industry/:industryId", Component: Industry },
      { path: "enterprise/:enterpriseId", Component: Enterprise },
      { path: "report/:reportId", Component: Report },
      { path: "follow/enterprise", Component: FollowEnterprise },
      { path: "profile", Component: Profile },
    ],
  },
], { basename: "/hahaha" });
