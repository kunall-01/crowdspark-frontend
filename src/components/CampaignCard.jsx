const CampaignCard = ({ image, title, description, raised, goal }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
        <img src={image} alt="Campaign" className="rounded-md mb-3 object-cover h-[180px] w-full" />
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${(raised / goal) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">{raised} raised of {goal}</p>
      </div>
    );
  };
  
  export default CampaignCard;