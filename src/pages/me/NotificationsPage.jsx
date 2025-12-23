import { notificationApi } from "@/common/api/notification.api";
import { useEffect, useState } from "react";
import NotificationCard from "@/components/noti/NotificationCard";

const NotificationsPage = () => {
  const [notis, setNotis] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await notificationApi.getNotifications();
      setNotis(result);
    };
    fetchNotifications();
  }, []);
  return (
    <>
      <div className="p-8 flex flex-col space-y-4">
        {notis.map((noti) => (
          <NotificationCard
            key={noti.notificationId}
            noti={noti}
          ></NotificationCard>
        ))}
      </div>
    </>
  );
};

export default NotificationsPage;
