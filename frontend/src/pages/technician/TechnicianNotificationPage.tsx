import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import NotificationsList from "../../components/technician/notifications/TechnicianNotificationsList";

const TechnicianNotificationsPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Notifications"
        description="Stay updated with new laboratory requests and system alerts."
      />

      <NotificationsList />
    </div>
  );
};

export default TechnicianNotificationsPage;