import { Dispatch, SetStateAction, useState } from "react";
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

// Define the props type
interface SwipeCardsProps {
  toggleSidebar: () => void; // Function to toggle sidebar
  isSidebarOpen: boolean; // State of the sidebar
}

const SwipeCards: React.FC<SwipeCardsProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [cards, setCards] = useState<Card[]>(cardData);
  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [rejectedCards, setRejectedCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const handleAccept = () => {
    const currentCard = cards[currentIndex];
    setSavedCards([...savedCards, currentCard]);
    toast.success(`${currentCard.name} has been added to your matches!`, {
      icon: "✅",
      duration: 2000,
    });
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReject = () => {
    const currentCard = cards[currentIndex];
    setRejectedCards([...rejectedCards, currentCard]);
    toast.error(`${currentCard.name} has been rejected`, {
      icon: "❌",
      duration: 2000,
    });
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            }}
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
            onClick={() => {
              if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
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
              <h2 className="mb-4 text-xl font-bold md:text-2xl">About Me</h2>
              <p className="text-base text-gray-700 md:text-lg">
                {card.aboutMe}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-indigo-100 px-3 py-1.5 text-sm text-indigo-800 md:px-4 md:py-2"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Card = ({
  id,
  url,
  name,
  description,
  setCards,
  currentIndex,
  index,
  onSelect,
}: {
  id: number;
  url: string;
  name: string;
  description: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
  currentIndex: number;
  index: number;
  onSelect: () => void;
}) => {
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
        <h3 className="text-xl font-bold text-white md:text-2xl">{name}</h3>
        <p className="mt-2 text-sm text-gray-200 md:text-base">{description}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
  name: string;
  description: string;
  aboutMe: string;
  interests: string[];
};

const cardData: Card[] = [
  {
    id: 1,
    url: "https://i.imgur.com/LUk0B4B.jpg",
    name: "Carnage",
    description:
      "Looking for a dynamic fitness model to represent our high-performance apparel.",
    aboutMe: "Leading active and lifestyle clothing brand based in Sri Lanka",
    interests: [
      "Fashion Modeling",
      "Runway",
      "Fashion Photography",
      "Fitness Wear",
      "Brand Ambassador",
      "Commercial Modeling",
    ],
  },
  {
    id: 2,
    url: "https://i.imgur.com/L9D9Z39.jpeg",
    name: "AT Studios",
    description: "Searching for a commercial model to represent the studios",
    aboutMe: "Exclusive lines of Makeup right in Sri Lanka",
    interests: [
      "Makeup Artistry",
      "Beauty Trends",
      "Fashion Styling",
      "Cosmetics",
      "Beauty Photography",
      "Fashion Events",
    ],
  },
  {
    id: 3,
    url: "https://i.imgur.com/F3PvqAp.jpeg",
    name: "Mimosa",
    description:
      "searching for a petite model to feature in an upcoming campaign!",
    aboutMe: "Mimosa is a leading women's fashion brand in Sri Lanka",
    interests: [
      "Fashion Design",
      "Sustainable Fashion",
      "Textile Design",
      "Fashion Illustration",
      "Eco-friendly Materials",
      "Fashion Blogging",
    ],
  },
  {
    id: 4,
    url: "https://i.imgur.com/fOPq4lQ.jpeg",
    name: "CS 16",
    description:
      "Art curator with a passion for contemporary design and music festivals.",
    aboutMe:
      "CS 16 is a forward-thinking fashion business that merges cutting-edge technology with high-end style.",
    interests: [
      "Fashion Curation",
      "Fashion Shows",
      "Luxury Brands",
      "Fashion Marketing",
      "Fashion History",
      "Fashion Journalism",
    ],
  },
  {
    id: 5,
    url: "https://i.imgur.com/esvt3Rh.jpeg",
    name: "Travlon",
    description: "Looking for a swimwear model to represent our brand!",
    aboutMe: "leading swimwear brand in Sri Lanka",
    interests: [
      "Fashion Tech",
      "E-commerce Fashion",
      "Digital Fashion",
      "Fashion Analytics",
      "Fashion Startups",
      "Fashion Innovation",
    ],
  },
];
