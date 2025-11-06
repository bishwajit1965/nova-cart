import Marquee from "react-fast-marquee";
import { Megaphone } from "lucide-react";
import useAnnouncements from "../../hooks/useAnnouncements";

const AnnouncementBar = () => {
  const { data: announcements = [] } = useAnnouncements();

  if (!announcements.length) return null;

  return (
    <div className="bg-linear-to-t from-blue-600 to-indigo-500 text-white py-2 px-4 rounded-sm shadow-md">
      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        <Marquee
          className="flex items-center gap-8"
          pauseOnHover={true}
          speed={50}
          gradient={true}
          gradientColor="lightGray"
        >
          {announcements.map((a) => (
            <span key={a._id} className="font-medium flex items-center gap-2">
              <Megaphone size={18} /> <span className="mr-10">{a.message}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default AnnouncementBar;
