import TopNavbar from "../components/layout/TopNavbar";
import ThemeSwitcher from "../components/settings/ThemeSwitcher";
import ModeSwitcher from "../components/settings/ModeSwitcher";

const SettingsPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <TopNavbar title="Settings" />
      <div className="mt-6 space-y-4">
        <ThemeSwitcher />
        <ModeSwitcher />
      </div>
    </div>
  );
};

export default SettingsPage;
