import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Industry from "./pages/Industry";
import Enterprise from "./pages/Enterprise";
import Report from "./pages/Report";
import FollowEnterprise from "./pages/FollowEnterprise";
import Profile from "./pages/Profile";
import Benefits from "./pages/Benefits";
import BenefitApply from "./pages/BenefitApply";
import Notifications from "./pages/Notifications";
import City from "./pages/City";
import RankingList from "./pages/RankingList";
import QueuePage from "./pages/QueuePage";
import GenerationFailedPage from "./pages/GenerationFailedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", Component: Home },
      { path: "industry/:industryId", Component: Industry },
      { path: "rankings/:rankType", Component: RankingList },
      { path: "enterprise/:enterpriseId", Component: Enterprise },
      { path: "report/:reportId", Component: Report },
      { path: "follow/enterprise", Component: FollowEnterprise },
      { path: "profile", Component: Profile },
      { path: "benefits", Component: Benefits },
      { path: "benefits/apply", Component: BenefitApply },
      { path: "notifications", Component: Notifications },
      { path: "city/:cityId", Component: City },
      { path: "queue", Component: QueuePage },
      { path: "generation-failed/:enterpriseId", Component: GenerationFailedPage },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
], { basename: "/hahaha" });
