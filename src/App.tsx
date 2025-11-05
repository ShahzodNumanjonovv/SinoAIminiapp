import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav";
import { Outlet } from "@tanstack/react-router";

export default function App() {
  return (
    <div className="min-h-full">
      <Topbar />
      <div className="p-4 pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
