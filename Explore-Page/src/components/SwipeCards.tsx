import { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check, X, Menu, Star } from "lucide-react";

// Define a Testimonial type.
type Testimonial = {
  rating: number; // 1 to 5
  comment: string;
  brand?: string;
};

// Extend the Card type to include testimonials.
type Card = {
  id: number;
  url: string;
  name: string;
  age: number;
  description: string;
  tags: string[];
  projectCount: number;
  testimonials: Testimonial[];
};

const cardData: Card[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    name: "Emma",
    age: 28,
    description:
      "Photography enthusiast and coffee lover. Always up for an adventure!",
    tags: ["Commercial Modeling", "Beauty Modeling"],
    projectCount: 12,
    testimonials: [
      {
        rating: 5,
        comment:
          "Emma is a true professional. She took direction well, improvised when needed, and delivered top-tier shots. Her expressions were authentic, and her energy on set was contagious. Highly recommended!",
        brand: "Luxury Fashion",
      },
    ],
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    name: "Sophie",
    age: 25,
    description: "Travel blogger exploring the world one city at a time. 🌎✈️",
    tags: ["Fashion/Runway Modeling", "Fitness Modeling"],
    projectCount: 8,
    testimonials: [
      {
        rating: 1,
        comment:
          "Unfortunately, Sophia canceled last minute, leaving us scrambling for a replacement. No communication or explanation given. Very unprofessional.",
        brand: "Runway Star",
      },
    ],
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    name: "Olivia",
    age: 27,
    description:
      "Yoga instructor and plant mom. Looking for genuine connections.",
    tags: ["Beauty Modeling"],
    projectCount: 10,
    testimonials: [],
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    name: "Isabella",
    age: 26,
    description:
      "Art curator with a passion for contemporary design and music festivals.",
    tags: [
      "Commercial Modeling",
      "Fashion/Runway Modeling",
      "Fitness Modeling",
      "Lingerie/Swimsuit Modeling",
      "Commercial Modeling",
      "Beauty Modeling",
    ],
    projectCount: 15,
    testimonials: [
      {
        rating: 2,
        comment:
          "While Isabella has a great look, she arrived late to the shoot, and her communication was lacking. We had to do multiple retakes because she struggled to follow directions. Needs improvement on professionalism.",
        brand: "Elite Vogue",
      },
      {
        rating: 4,
        comment:
          "Very reliable and creative. Need to work on arrival time and communication.",
        brand: "Design House",
      },
    ],
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    name: "Mia",
    age: 29,
    description:
      "Tech entrepreneur who loves hiking and trying new restaurants.",
    tags: [
      "Fitness Modeling",
      "Lingerie/Swimsuit Modeling",
      "Commercial Modeling",
      "Beauty Modeling",
      "Fitness Modeling",
      "Commercial Print Modeling",
      "Virtual Modeling",
      "Lifestyle Modeling",
    ],
    projectCount: 5,
    testimonials: [
      {
        rating: 3,
        comment:
          "Mia has a stunning look and radiant skin, perfect for beauty shoots. However, she seemed a bit uncomfortable with close-up shots, which made it difficult to capture the right angles. Needs more experience in this area.",
        brand: "Glow Beauty Cosmetics",
      },
    ],
  },
];

const SwipeCards = ({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) => {
  const [cards, setCards] = useState<Card[]>(cardData);

  // Determine the current (top) card to display in the details section.
  const currentCard = cards[cards.length - 1];

  return (
    <div className="w-full bg-neutral-100 min-h-screen p-4">
      {/* Hamburger Menu for Mobile */}
      <button className="md:hidden mb-4 cursor-pointer" onClick={toggleSidebar}>
        <Menu
          className={`w-6 h-6 ${
            isSidebarOpen ? "text-white" : "text-[#DD8560]"
          }`}
        />
      </button>

      {/* Layout: for screens below xl, details stack vertically; on xl+ screens, side-by-side */}
      <div className="flex flex-col xl:flex-row">
        {/* Swipe Cards Section */}
        <div className="flex-1 flex justify-center items-center relative mx-auto xl:ml-[-40px]">
          <div className="grid">
            {cards.map((card) => (
              <CardComponent
                key={card.id}
                cards={cards}
                setCards={setCards}
                {...card}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-4">
          {currentCard ? (
            <div className="flex flex-col gap-6">
              {/* About Us Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold">
                    About {currentCard.name}
                  </h2>
                  <p className="text-gray-700">{currentCard.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentCard.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-fit px-4 py-2 bg-[#DD8560] text-white rounded hover:bg-[#c46b4b] cursor-pointer">
                    Projects: {currentCard.projectCount}
                  </button>
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Testimonials</h3>
                {currentCard.testimonials &&
                currentCard.testimonials.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {currentCard.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-start gap-2 border p-2 rounded"
                      >
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{testimonial.comment}</p>
                        {testimonial.brand && (
                          <p className="text-sm text-gray-500">
                            - {testimonial.brand}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No testimonials available.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No more cards</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CardComponent = ({
  id,
  url,
  name,
  age,
  description,
  setCards,
  cards,
}: {
  id: number;
  url: string;
  name: string;
  age: number;
  description: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
}) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const isFront = id === cards[cards.length - 1].id;

  // Original swipe rotation calculation.
  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const checkmarkOpacity = useTransform(x, [0, 100], [0, 1]);
  const xMarkOpacity = useTransform(x, [-100, 0], [1, 0]);
  const iconScale = useTransform(
    x,
    [-150, -100, 0, 100, 150],
    [1, 1.2, 0, 1.2, 1]
  );

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      className="relative h-[600px] w-[400px] rounded-2xl bg-white shadow-xl"
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
      }}
      animate={{ scale: isFront ? 1 : 0.98 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="absolute top-8 right-8 z-10"
        style={{ opacity: checkmarkOpacity, scale: iconScale }}
      >
        <Check className="w-16 h-16 text-green-500 stroke-[4]" />
      </motion.div>

      <motion.div
        className="absolute top-8 left-8 z-10"
        style={{ opacity: xMarkOpacity, scale: iconScale }}
      >
        <X className="w-16 h-16 text-red-500 stroke-[4]" />
      </motion.div>

      <img
        src={url}
        alt={`${name}, ${age}`}
        className="h-full w-full rounded-2xl object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <h3 className="text-2xl font-bold">
          {name}, {age}
        </h3>
        <p className="mt-2 text-sm text-gray-200">{description}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;
