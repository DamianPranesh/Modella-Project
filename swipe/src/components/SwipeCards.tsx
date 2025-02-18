import { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

const SwipeCards = () => {
    const [cards, setCards] = useState<Card[]>(cardData);
    const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
    const [savedCards, setSavedCards] = useState<Card[]>([]);
    const [rejectedCards, setRejectedCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const navigateCards = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'next' && currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleAccept = () => {
        const currentCard = cards[currentIndex];
        setSavedCards([...savedCards, currentCard]);
        toast.success(`${currentCard.name} has been added to your matches! 💕`, {
            icon: '✅',
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
            icon: '❌',
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
            <div className="mx-auto max-w-2xl">
                <div className="relative mb-12 flex items-center justify-center">
                    <button
                        onClick={() => navigateCards('prev')}
                        className="absolute left-[-20px] z-10 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 md:left-[-60px] md:p-4"
                        disabled={currentIndex === 0}
                    >
                        <span className="text-xl md:text-2xl">⬅️</span>
                    </button>

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

                    <button
                        onClick={() => navigateCards('next')}
                        className="absolute right-[-20px] z-10 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 md:right-[-60px] md:p-4"
                        disabled={currentIndex === cards.length - 1}
                    >
                        <span className="text-xl md:text-2xl">➡️</span>
                    </button>
                </div>

                <div className="flex justify-center gap-6 md:gap-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleReject}
                        className="rounded-full bg-white p-4 shadow-lg hover:bg-red-50 disabled:opacity-50 md:p-6"
                        disabled={cards.length === 0}
                    >
                        <span className="text-2xl md:text-3xl">❌</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAccept}
                        className="rounded-full bg-white p-4 shadow-lg hover:bg-green-50 disabled:opacity-50 md:p-6"
                        disabled={cards.length === 0}
                    >
                        <span className="text-2xl md:text-3xl">✅</span>
                    </motion.button>
                </div>
            </div>
            <Toaster position="bottom-center" />
        </div>
    );
};

const DetailedView = ({ card, onClose }: { card: Card; onClose: () => void }) => {
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
                    className="mb-6 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100 md:p-4"
                >
                    <span className="text-xl md:text-2xl">⬅️ Back</span>
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
                            <p className="text-base text-gray-700 md:text-lg">{card.aboutMe}</p>
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
                            <h2 className="mb-4 text-xl font-bold md:text-2xl">Testimonials</h2>
                            <div className="space-y-4">
                                {card.testimonials.map((testimonial, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        key={index}
                                        className="rounded-lg bg-gray-50 p-4 md:p-6"
                                    >
                                        <p className="text-base text-gray-700 md:text-lg">{testimonial.text}</p>
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
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
        >
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
        description: "Photography enthusiast and coffee lover. Always up for an adventure!",
        aboutMe: "Hey there! I'm a professional photographer with a passion for capturing life's beautiful moments. When I'm not behind the camera, you'll find me exploring new coffee shops or planning my next adventure. I believe in living life to the fullest and finding beauty in the everyday moments.",
        interests: ["Photography", "Coffee", "Travel", "Art", "Hiking", "Jazz Music"],
        testimonials: [
            {
                text: "Emma has such a creative eye! She helped me see beauty in places I never noticed before.",
                author: "Sarah, Friend"
            },
            {
                text: "One of the most genuine people I've ever met. Her passion for photography is contagious!",
                author: "Mike, Photography Client"
            }
        ]
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Sophie",
        age: 25,
        description: "Travel blogger exploring the world one city at a time. 🌎✈️",
        aboutMe: "Travel writer and digital nomad with a mission to explore every corner of the world. I've visited 45 countries and counting! I love sharing stories and connecting with fellow adventurers. My blog has inspired thousands to step out of their comfort zones and embrace new experiences.",
        interests: ["Travel Writing", "Photography", "Languages", "Culture", "Food", "Adventure Sports"],
        testimonials: [
            {
                text: "Sophie's travel stories are incredibly inspiring. She has a way of making you feel like you're right there with her!",
                author: "Lisa, Blog Reader"
            },
            {
                text: "Her passion for different cultures and authentic experiences is truly remarkable.",
                author: "David, Travel Companion"
            }
        ]
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Olivia",
        age: 27,
        description: "Yoga instructor and plant mom. Looking for genuine connections.",
        aboutMe: "Certified yoga instructor with a deep passion for mindfulness and personal growth. I believe in the power of movement and meditation to transform lives. When I'm not teaching, I'm tending to my indoor jungle of 50+ plants or practicing new recipes in my kitchen.",
        interests: ["Yoga", "Meditation", "Plant Care", "Cooking", "Sustainability", "Reading"],
        testimonials: [
            {
                text: "Olivia's yoga classes are transformative. She has a gift for making everyone feel comfortable and capable.",
                author: "Rachel, Yoga Student"
            },
            {
                text: "Her positive energy is infectious! She's helped me develop both strength and inner peace.",
                author: "Tom, Meditation Group Member"
            }
        ]
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Isabella",
        age: 26,
        description: "Art curator with a passion for contemporary design and music festivals.",
        aboutMe: "Contemporary art curator working with emerging artists. I'm passionate about making art accessible to everyone and creating immersive gallery experiences. My weekends are split between gallery openings and underground music venues. Always seeking new perspectives and creative inspiration.",
        interests: ["Contemporary Art", "Music Festivals", "Design", "Fashion", "Photography", "Street Art"],
        testimonials: [
            {
                text: "Isabella has an incredible eye for emerging talent. Her exhibitions always tell a compelling story.",
                author: "James, Gallery Owner"
            },
            {
                text: "She brings such fresh energy to the art world. Her passion for supporting new artists is admirable.",
                author: "Maria, Artist"
            }
        ]
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Mia",
        age: 29,
        description: "Tech entrepreneur who loves hiking and trying new restaurants.",
        aboutMe: "Founder of a successful tech startup focused on sustainable solutions. I believe in using technology to make the world a better place. When I'm not coding or in meetings, you'll find me hiking trails or exploring new restaurants. I love combining my passion for tech with outdoor adventures.",
        interests: ["Technology", "Entrepreneurship", "Hiking", "Food", "Sustainability", "Innovation"],
        testimonials: [
            {
                text: "Mia is a brilliant innovator with a heart of gold. She truly cares about making a positive impact.",
                author: "Alex, Co-founder"
            },
            {
                text: "Working with her has been inspiring. She brings both vision and practicality to everything she does.",
                author: "Jennifer, Team Member"
            }
        ]
    }
];