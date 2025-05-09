import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X,
  Check,
  ArrowLeftRight,
  Menu,
} from "lucide-react";

import { fetchData } from "../api/api";
import { useUser } from "../components-login/UserContext";

// Define the props type
interface SwipeCardsProps {
  toggleSidebar: () => void; // Function to toggle sidebar
  isSidebarOpen: boolean; // State of the sidebar
}

type Card = {
  id: number;
  url: string;
  name: string;
  Brandname: string;
  description: string;
  aboutJob: string;
  interests: string[];
};

const fetchMatchedProjectIds = async (user__Id: string) => {
  try {
    console.log("Fetching matched project IDs for:", user__Id);
    const response = await fetchData(
      `ModellaPreference/Model-project-preference-matched-project-ids-by-user-id/${user__Id}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching matched project IDs:", error);
    return [];
  }
};

const fetchProjectDetails = async (projectId: string) => {
  try {
    const data = await fetchData(`Brandprojects/projects_by_pId/${projectId}`);
    return data; // Return the user details if the request is successful
  } catch (error: unknown) {
    console.error(
      `Error fetching user details for ${projectId}:`,
      error instanceof Error ? error.message : error
    );
  }
};

const fetchProjectImage = async (user__Id: string, projectId: string) => {
  try {
    const data = await fetchData(
      `files/files-project?user_id=${user__Id}&project_id=${projectId}`
    );
    return data; // Return the profile image URL data if successful
  } catch (error: unknown) {
    console.error(
      `Error fetching project image for ${projectId}:`,
      error instanceof Error ? error.message : error
    );
  }
};

const fetchProjectTags = async (user__Id: string, projectId: string) => {
  try {
    const data = await fetchData(
      `ModellaTag/tags/projects/${user__Id}/${projectId}`
    );
    return data; // Return the user tags data if successful
  } catch (error: unknown) {
    console.error(
      `Error fetching tags for ${user__Id}:`,
      error instanceof Error ? error.message : error
    );
  }
};

const fetchUserDetails = async (user__Id: string) => {
  try {
    const data = await fetchData(`users/${user__Id}`);
    return data; // Return the user details if the request is successful
  } catch (error: unknown) {
    console.error(
      `Error fetching user details for ${user__Id}:`,
      error instanceof Error ? error.message : error
    );
  }
};

const SwipeCards: React.FC<SwipeCardsProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  // const userId = "model_67c5af423ae5b4ccb85b9a02";
  const { userId } = useUser();
  const user__Id = userId || "";

  const fetchCardData = async (projectId: string) => {
    try {
      const projectDetails = await fetchProjectDetails(projectId);
      if (!projectDetails) return null;

      const { user_Id, name, description } = projectDetails;
      const [imageResponse, tags, aboutJob] = await Promise.all([
        fetchProjectImage(user_Id, projectId),
        fetchProjectTags(user_Id, projectId),
        fetchUserDetails(user_Id),
      ]);

      return {
        id: projectId,
        url: imageResponse?.s3_url || "https://via.placeholder.com/300",
        name: name,
        Brandname: aboutJob.name || "No brand name available",
        description: description
          ? description.length > 30
            ? description.substring(0, 30) + "..."
            : description
          : "No short description available",
        aboutJob: description || "No job description available",
        interests: tags.work_Field || [],
      };
    } catch (error) {
      console.error(`Error fetching card data for ${projectId}:`, error);
      return null;
    }
  };

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const projectIds = await fetchMatchedProjectIds(user__Id);
      const cardsData = await Promise.all(projectIds.map(fetchCardData));
      const filteredCards = cardsData.filter(Boolean) as Card[];
      setCards(filteredCards);
      setCurrentIndex(filteredCards.length - 1);
      console.log("Loaded Cards:", filteredCards);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
    setLoading(false);
  }, [user__Id]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD8560] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Projects...</p>
    </div>
    </div>);

  const handleAccept = async () => {
    if (cards.length === 0) return; // Prevent errors if no cards are left

    const currentCard = cards[currentIndex];
    const currentCardId = currentCard.id; // Extract user ID of the accepted profile

    try {
      const response = await fetchData(
        `savedList/add-project?user_id=${user__Id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([currentCardId]), // Sending the accepted card's user_id
        }
      );

      console.log("Saved match:", response);
      toast.success(`${currentCard.name} has been added to your matches! 💕`, {
        icon: "✅",
        duration: 2000,
      });

      // Remove the card from the list
      const updatedCards = cards.filter((_, index) => index !== currentIndex);
      setCards(updatedCards);

      // Adjust index or reload new cards
      if (updatedCards.length === 0) {
        loadCards();
      } else {
        setCurrentIndex(updatedCards.length - 1);
      }
    } catch (error) {
      console.error("Error saving match:", error);
      toast.error("Failed to save match. Please try again.");
    }
  };

  const handleReject = async () => {
    if (cards.length === 0) return; // Prevent errors if no cards are left

    const currentCard = cards[currentIndex];
    const currentCardId = currentCard.id; // Extract user ID of the rejected profile

    try {
      const response = await fetchData(
        `savedList/remove-project?user_id=${user__Id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([currentCardId]), // Sending the rejected card's user_id
        }
      );

      console.log("Removed match:", response);
      toast.error(`${currentCard.name} has been rejected`, {
        icon: "❌",
        duration: 2000,
      });

      // Remove the card from the list
      const updatedCards = cards.filter((_, index) => index !== currentIndex);
      setCards(updatedCards);

      // Adjust index or reload new cards
      if (updatedCards.length === 0) {
        loadCards();
      } else {
        setCurrentIndex(updatedCards.length - 1);
      }
    } catch (error) {
      console.error("Error removing match:", error);
      toast.error("Failed to remove match. Please try again.");
    }
  };

  const navigateCards = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (selectedCard) {
    return (
      <DetailedView card={selectedCard} onClose={() => setSelectedCard(null)} />
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-100 px-4 py-8 md:px-8">
      {/* Hamburger Menu Button - only show when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-4 z-50 md:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="rounded-full bg-[rgb(221,133,96)] p-2 text-white shadow-lg hover:bg-[rgb(201,113,76)] transition-colors duration-200 cursor-pointer"
          >
            <Menu size={24} />
          </motion.button>
        </div>
      )}
      <div className="mx-auto max-w-2xl">
        {/* Legend Button */}
        <div className="absolute right-4 top-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLegend(!showLegend)}
            className="rounded-full bg-[rgb(221,133,96)] p-2 text-white shadow-lg hover:bg-[rgb(201,113,76)] transition-colors duration-200"
          >
            <HelpCircle size={24} />
          </motion.button>

          {/* Legend Popup */}
          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-4 shadow-xl"
              >
                <h3 className="mb-3 font-semibold text-gray-800">How to Use</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight
                      className="text-[rgb(221,133,96)]"
                      size={20}
                    />
                    <span className="text-sm text-gray-600">
                      Swipe or drag cards left/right
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="text-[rgb(221,133,96)]" size={20} />
                    <ChevronRight
                      className="text-[rgb(221,133,96)]"
                      size={20}
                    />
                    <span className="text-sm text-gray-600">
                      Navigate between cards
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="text-red-500" size={20} />
                    <span className="text-sm text-gray-600">
                      Reject profile
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span className="text-sm text-gray-600">
                      Accept profile
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mb-12 flex items-center justify-center">
          {/* Add the Previous button here */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateCards("prev")}
            className="absolute left-[-20px] z-10 rounded-full bg-[rgb(221,133,96)] p-3 shadow-lg text-white hover:bg-[rgb(201,113,76)] transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-[rgb(221,133,96)] md:left-[-60px] md:p-4 cursor-pointer"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <AnimatePresence mode="wait">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                cards={cards}
                setCards={setCards}
                currentIndex={currentIndex}
                index={index}
                onSelect={() => setSelectedCard(card)}
                {...card}
              />
            ))}
          </AnimatePresence>

          {/* Add the Next button here */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateCards("next")}
            className="absolute right-[-20px] z-10 rounded-full bg-[rgb(221,133,96)] p-3 shadow-lg text-white hover:bg-[rgb(201,113,76)] transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-[rgb(221,133,96)] md:right-[-60px] md:p-4 cursor-pointer"
            disabled={currentIndex === cards.length - 1}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        <div className="flex justify-center gap-6 md:gap-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReject}
            className="rounded-full bg-white p-4 shadow-lg hover:bg-red-50 disabled:opacity-50 md:p-6 cursor-pointer"
            disabled={cards.length === 0}
          >
            <X size={24} className="text-red-500" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAccept}
            className="rounded-full bg-white p-4 shadow-lg hover:bg-green-50 disabled:opacity-50 md:p-6 cursor-pointer"
            disabled={cards.length === 0}
          >
            <Check size={24} className="text-green-500" />
          </motion.button>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

const DetailedView = ({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen w-full bg-neutral-100 p-4 md:p-8"
    >
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onClose}
          className="mb-6 flex items-center rounded-full bg-[rgb(221,133,96)] p-3 shadow-lg text-white hover:bg-[rgb(201,113,76)] transition-colors duration-200 md:p-4"
        >
          <ChevronLeft size={24} />
          <span className="ml-2">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
            <img
              src={card.url}
              alt={card.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {card.name}
              </h1>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold md:text-2xl">About Job</h2>
              <p className="text-base text-gray-700 md:text-lg">
                {card.aboutJob}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.interests?.length ? (
                  card.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-indigo-100 px-3 py-1.5 text-sm text-indigo-800 md:px-4 md:py-2"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No requirements available
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface CardProps {
  id: number;
  url: string;
  name: string;
  Brandname: string;
  description: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
  currentIndex: number;
  index: number;
  onSelect: () => void;
}

const Card = ({
  id,
  url,
  name,
  Brandname,
  description,
  setCards,
  currentIndex,
  index,
  onSelect,
}: CardProps) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const isFront = index === currentIndex;
  const [showTooltip, setShowTooltip] = useState(true);

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : index % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      className="relative h-[450px] w-[300px] cursor-pointer rounded-2xl bg-white shadow-xl md:h-[600px] md:w-[400px]"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
        display: index === currentIndex ? "block" : "none",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isFront ? 1 : 0.98,
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
      onClick={() => {
        setShowTooltip(false);
        onSelect();
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Floating Text Bubble */}
      <AnimatePresence>
        {showTooltip && isFront && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-16"
          >
            <div className="relative">
              <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
                Click to view more details
              </div>
              {/* Triangle */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={url}
        alt={name}
        className="h-full w-full rounded-2xl object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
        <h3 className="text-xl font-bold text-white md:text-2xl">
          {Brandname}
        </h3>
        <p className="mt-2 text-sm text-gray-200 md:text-base">{description}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;
