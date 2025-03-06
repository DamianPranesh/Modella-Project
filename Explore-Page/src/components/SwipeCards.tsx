import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

// Define the props type
interface SwipeCardsProps {
  toggleSidebar: () => void; // Function to toggle sidebar
  isSidebarOpen: boolean; // State of the sidebar
}

const fetchRecentReviews = async (userId: string) => {
  try {
    const response = await fetchData(`ratings/recent/${userId}`, {
      method: "GET",
    });
    console.log("Fetched reviews:", response);
    return response;
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return [];
  }
};

const fetchMatchedUserIds = async (userId: string) => {
  try {
    console.log("Fetching matched user IDs for:", userId);
    const response = await fetchData(
      `ModellaPreference/brand-Model-preference-matched-ids-by-user-id/${userId}`,
      {
        method: "POST",
        body: JSON.stringify({}), // If your API requires a body, add it here
      }
    );
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching matched user IDs:", error);
    return [];
  }
};

// const fetchUserDetails = async (userId: string) => {
//   return fetchData(`users/${userId}`); // Calls /api/v1/{user_Id}
// };

// const fetchUserProfileImage = async (userId: string) => {
//   return fetchData(
//     `files/urls-for-user-id-and-foldername-with-limits?user_id=${userId}&folder=profile-pic&limit=1`
//   );
// };

// const fetchUserTags = async (userId: string) => {
//   return fetchData(`ModellaTag/tags/models/${userId}`);
// };

// Fetch user details with error handling
const fetchUserDetails = async (userId: string) => {
  try {
    const data = await fetchData(`users/${userId}`);
    return data; // Return the user details if the request is successful
  } catch (error: any) {
    console.error(
      `Error fetching user details for ${userId}:`,
      error.message || error
    );
    //throw new Error(`Unable to fetch user details for ${userId}. Please try again later.`);
  }
};

// Fetch user profile image with error handling
const fetchUserProfileImage = async (userId: string) => {
  try {
    const data = await fetchData(
      `files/urls-for-user-id-and-foldername-with-limits?user_id=${userId}&folder=profile-pic&limit=1`
    );
    return data; // Return the profile image URL data if successful
  } catch (error: any) {
    console.error(
      `Error fetching profile image for ${userId}:`,
      error.message || error
    );
    //throw new Error(`Unable to fetch profile image for ${userId}. Please try again later.`);
  }
};

// Fetch user tags with error handling
const fetchUserTags = async (userId: string) => {
  try {
    const data = await fetchData(`ModellaTag/tags/models/${userId}`);
    return data; // Return the user tags data if successful
  } catch (error: any) {
    console.error(`Error fetching tags for ${userId}:`, error.message || error);
    //throw new Error(`Unable to fetch tags for ${userId}. Please try again later.`);
  }
};

const SwipeCards: React.FC<SwipeCardsProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  // const [cards, setCards] = useState<Card[]>(cardData);
  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [rejectedCards, setRejectedCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const [userIds, setUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = "brand_67c5b2c43ae5b4ccb85b9a11";

  // useEffect(() => {
  //   const getMatchedUserIds = async () => {
  //     setLoading(true);
  //     const ids = await fetchMatchedUserIds(userId);
  //     console.log("Fetched ids:", ids);
  //     setUserIds(ids);
  //     setLoading(false);
  //   };

  //   getMatchedUserIds();
  // }, [userId]);

  // useEffect(() => {
  //   const loadCards = async () => {
  //     setLoading(true);
  //     try {
  //       // Step 1: Get matched user IDs
  //       const userIds = await fetchMatchedUserIds(userId);
  //       console.log("Fetched user IDs:", userIds);

  //       // Step 2: Fetch details for each user
  //       const cardPromises = userIds.map(async (id: string) => {
  //         const userDetails = await fetchUserDetails(id);
  //         const imageResponse = await fetchUserProfileImage(id);
  //         const userTags = await fetchUserTags(id);
  //         // Step 3: Fetch reviews for each matched user
  //         const reviews = await fetchRecentReviews(id);
  //         // Step 4: Map reviews to testimonials
  //         const testimonialsData = await Promise.all(
  //           reviews.map(async (review: any) => {
  //             const authorDetails = await fetchUserDetails(review.ratedBy_Id);
  //             const authorName = authorDetails?.name || "Unknown author"; // Handle no name scenario
  //             return {
  //               text: review.review || "No review text",
  //               author: `${authorName}, Reviewer`, // Customizable format
  //             };
  //           })
  //         );

  //         const card = {
  //           id: userDetails.user_Id,
  //           name: userDetails.name,
  //           description: userDetails.description || "No description available.",
  //           aboutMe: userDetails.bio || "No bio available.",
  //           imageUrl: imageResponse.length > 0 ? imageResponse[0].s3_url : null, // Extract profile image
  //           age: userTags.age || "unknown",
  //           interest: userTags.work_Field || "empty",
  //           testimonials: testimonialsData,
  //         };

  //         console.log("Fetched card:", card); // Log each card
  //         return card;
  //       });

  //       // Step 3: Resolve all user data and set state
  //       const cardsData = await Promise.all(cardPromises);
  //       console.log("All cards fetched:", cardsData);
  //       setCards(cardsData);
  //     } catch (error: any) {
  //       console.error("Error loading cards:", error);
  //     }
  //     setLoading(false);
  //   };

  //   loadCards();
  // }, [userId]);

  const fetchCardData = async (id: string) => {
    try {
      const [userDetails, imageResponse, userTags, reviews] = await Promise.all(
        [
          fetchUserDetails(id),
          fetchUserProfileImage(id),
          fetchUserTags(id),
          fetchRecentReviews(id),
        ]
      );

      const testimonialsData = await Promise.all(
        reviews.map(async (review: any) => {
          const authorDetails = await fetchUserDetails(review.ratedBy_Id);
          return {
            text: review.review || "No review text",
            author: `${authorDetails?.name || "Unknown author"}, Reviewer`,
          };
        })
      );

      return {
        id: userDetails.user_Id,
        name: userDetails.name,
        description: userDetails.description || "No description available.",
        aboutMe: userDetails.bio || "No bio available.",
        imageUrl: imageResponse?.[0]?.s3_url || null,
        age: userTags.age || "unknown",
        interest: userTags.work_Field || "empty",
        testimonials: testimonialsData,
      };
    } catch (error) {
      console.error(`Error fetching card data for ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const userIds = await fetchMatchedUserIds(userId);
        const cardsData = await Promise.all(userIds.map(fetchCardData));
        const filteredCards = cardsData.filter(Boolean); // Remove null values
        setCards(filteredCards);

        setCurrentIndex(filteredCards.length - 1);
        // Log the fetched cards
        console.log("Loaded Cards:", filteredCards);
      } catch (error) {
        console.error("Error loading cards:", error);
      }
      setLoading(false);
    };

    loadCards();
  }, [userId]); // Dependency array ensures it runs when userId changes

  const navigateCards = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAccept = () => {
    const currentCard = cards[currentIndex];
    setSavedCards([...savedCards, currentCard]);
    toast.success(`${currentCard.name} has been added to your matches! 💕`, {
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
              alt={`${card.name}, ${card.age}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {card.name}, {card.age}
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

            <div>
              <h2 className="mb-4 text-xl font-bold md:text-2xl">
                Testimonials
              </h2>
              <div className="space-y-4">
                {card.testimonials.map((testimonial, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    key={index}
                    className="rounded-lg bg-gray-50 p-4 md:p-6"
                  >
                    <p className="text-base text-gray-700 md:text-lg">
                      {testimonial.text}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 md:text-base">
                      - {testimonial.author}
                    </p>
                  </motion.div>
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
  age,
  description,
  setCards,
  currentIndex,
  index,
  onSelect,
}: {
  id: number;
  url: string;
  name: string;
  age: number;
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
        alt={`${name}, ${age}`}
        className="h-full w-full rounded-2xl object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
        <h3 className="text-xl font-bold text-white md:text-2xl">
          {name}, {age}
        </h3>
        <p className="mt-2 text-sm text-gray-200 md:text-base">{description}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;

type Testimonial = {
  text: string;
  author: string;
};

type Card = {
  id: number;
  url: string;
  name: string;
  age: number;
  description: string;
  aboutMe: string;
  interests: string[];
  testimonials: Testimonial[];
};

const cardData: Card[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    name: "Emma",
    age: 28,
    description:
      "Photography enthusiast and coffee lover. Always up for an adventure!",
    aboutMe:
      "Hey there! I'm a professional photographer with a passion for capturing life's beautiful moments. When I'm not behind the camera, you'll find me exploring new coffee shops or planning my next adventure. I believe in living life to the fullest and finding beauty in the everyday moments.",
    interests: [
      "Photography",
      "Coffee",
      "Travel",
      "Art",
      "Hiking",
      "Jazz Music",
    ],
    testimonials: [
      {
        text: "Emma has such a creative eye! She helped me see beauty in places I never noticed before.",
        author: "Sarah, Friend",
      },
      {
        text: "One of the most genuine people I've ever met. Her passion for photography is contagious!",
        author: "Mike, Photography Client",
      },
    ],
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    name: "Sophie",
    age: 25,
    description: "Travel blogger exploring the world one city at a time. 🌎✈️",
    aboutMe:
      "Travel writer and digital nomad with a mission to explore every corner of the world. I've visited 45 countries and counting! I love sharing stories and connecting with fellow adventurers. My blog has inspired thousands to step out of their comfort zones and embrace new experiences.",
    interests: [
      "Travel Writing",
      "Photography",
      "Languages",
      "Culture",
      "Food",
      "Adventure Sports",
    ],
    testimonials: [
      {
        text: "Sophie's travel stories are incredibly inspiring. She has a way of making you feel like you're right there with her!",
        author: "Lisa, Blog Reader",
      },
      {
        text: "Her passion for different cultures and authentic experiences is truly remarkable.",
        author: "David, Travel Companion",
      },
    ],
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    name: "Olivia",
    age: 27,
    description:
      "Yoga instructor and plant mom. Looking for genuine connections.",
    aboutMe:
      "Certified yoga instructor with a deep passion for mindfulness and personal growth. I believe in the power of movement and meditation to transform lives. When I'm not teaching, I'm tending to my indoor jungle of 50+ plants or practicing new recipes in my kitchen.",
    interests: [
      "Yoga",
      "Meditation",
      "Plant Care",
      "Cooking",
      "Sustainability",
      "Reading",
    ],
    testimonials: [
      {
        text: "Olivia's yoga classes are transformative. She has a gift for making everyone feel comfortable and capable.",
        author: "Rachel, Yoga Student",
      },
      {
        text: "Her positive energy is infectious! She's helped me develop both strength and inner peace.",
        author: "Tom, Meditation Group Member",
      },
    ],
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    name: "Isabella",
    age: 26,
    description:
      "Art curator with a passion for contemporary design and music festivals.",
    aboutMe:
      "Contemporary art curator working with emerging artists. I'm passionate about making art accessible to everyone and creating immersive gallery experiences. My weekends are split between gallery openings and underground music venues. Always seeking new perspectives and creative inspiration.",
    interests: [
      "Contemporary Art",
      "Music Festivals",
      "Design",
      "Fashion",
      "Photography",
      "Street Art",
    ],
    testimonials: [
      {
        text: "Isabella has an incredible eye for emerging talent. Her exhibitions always tell a compelling story.",
        author: "James, Gallery Owner",
      },
      {
        text: "She brings such fresh energy to the art world. Her passion for supporting new artists is admirable.",
        author: "Maria, Artist",
      },
    ],
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    name: "Mia",
    age: 29,
    description:
      "Tech entrepreneur who loves hiking and trying new restaurants.",
    aboutMe:
      "Founder of a successful tech startup focused on sustainable solutions. I believe in using technology to make the world a better place. When I'm not coding or in meetings, you'll find me hiking trails or exploring new restaurants. I love combining my passion for tech with outdoor adventures.",
    interests: [
      "Technology",
      "Entrepreneurship",
      "Hiking",
      "Food",
      "Sustainability",
      "Innovation",
    ],
    testimonials: [
      {
        text: "Mia is a brilliant innovator with a heart of gold. She truly cares about making a positive impact.",
        author: "Alex, Co-founder",
      },
      {
        text: "Working with her has been inspiring. She brings both vision and practicality to everything she does.",
        author: "Jennifer, Team Member",
      },
    ],
  },
];
