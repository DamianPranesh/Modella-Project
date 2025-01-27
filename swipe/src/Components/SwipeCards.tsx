import { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SwipeCards = () => {
    const [cards, setCards] = useState<Card[]>(cardData);

    return (
        <div className="grid h-screen w-full place-items-center bg-neutral-100">
            {cards.map((card) => (
                <Card key={card.id} cards={cards} setCards={setCards} {...card} />
            ))}
        </div>
    );
};

const Card = ({
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

    const rotate = useTransform(() => {
        const offset = isFront ? 0 : id % 2 ? 6 : -6;
        return `${rotateRaw.get() + offset}deg`;
    });

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 100) {
            setCards((pv) => pv.filter((v) => v.id !== id));
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
            animate={{
                scale: isFront ? 1 : 0.98,
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{
                left: 0,
                right: 0,
            }}
            onDragEnd={handleDragEnd}
        >
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

type Card = {
    id: number;
    url: string;
    name: string;
    age: number;
    description: string;
};

const cardData: Card[] = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Emma",
        age: 28,
        description: "Photography enthusiast and coffee lover. Always up for an adventure!",
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Sophie",
        age: 25,
        description: "Travel blogger exploring the world one city at a time. 🌎✈️",
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Olivia",
        age: 27,
        description: "Yoga instructor and plant mom. Looking for genuine connections.",
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Isabella",
        age: 26,
        description: "Art curator with a passion for contemporary design and music festivals.",
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "Mia",
        age: 29,
        description: "Tech entrepreneur who loves hiking and trying new restaurants.",
    },
];