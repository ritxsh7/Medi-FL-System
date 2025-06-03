import { FiUsers, FiCheckCircle, FiBarChart2, FiUser } from "react-icons/fi";

const infoBars = [
  { title: "Local Accuracy", icon: <FiBarChart2 /> },
  { title: "Global Accuracy", icon: <FiCheckCircle /> },
  { title: "No of clients", icon: <FiUsers /> },
  { title: "Initiated by", icon: <FiUser /> },
];

const SessionInfo = ({ info, index }) => (
  <div className="flex items-center space-x-2 ">
    {infoBars[index].icon}
    <div className="flex items-center gap-1 text-md">
      <p className="text-gray-500">{infoBars[index].title}: </p>
      <p className="text-md font-semibold">{info}</p>
    </div>
  </div>
);

const SessionCard = ({ session }) => {
  return (
    <div className="bg-white rounded-lg min-w-[400px] shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center p-6 space-x-6">
      {/* Avatar */}
      <div className="flex items-center w-full gap-4">
        {/* Title and Date */}
        <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
          {session.name[0]}
        </div>
        <div className="flex justify-between items-center text-left">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {session.name}
            </h2>
            <p className="text-md text-gray-500">{session.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Session Details */}
      {/* <div className="grid grid-cols-2 text-md gap-3 mt-4 w-full">
        {Object.values(session.info).map((info, i) => (
          <SessionInfo info={info} index={i} key={i} />
        ))}
      </div> */}
    </div>
  );
};

export default SessionCard;
