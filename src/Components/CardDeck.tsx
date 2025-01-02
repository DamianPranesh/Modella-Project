import { useState } from 'react';
import Card from './Card';

interface Profile {
    id: number;
    name: string;
    age: number;
    bio: string;
    imageUrl: string;
    testimonial?: string;
    author?: string;
}

const initialProfiles: Profile[] = [
    {
        id: 1,
        name: "Leanne",
        age: 28,
        bio: "Hi, I'm Leanne! I've had the pleasure of working with top brands in Sri Lanka, bringing creativity and energy to every project. I'm passionate about what I do and love collaborating to make each shoot unique and impactful.",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        testimonial: "As a satisfied customer, I want to share my positive experience with others. Their software is amazing!",
        author: "Savannah Nguyen"
    },
    {
        id: 2,
        name: "Sofia",
        age: 26,
        bio: "Professional model with 5 years of experience in fashion and commercial modeling. Passionate about creating art through photography.",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        testimonial: "Working with this team has been an absolute pleasure. They're professional and creative!",
        author: "Marcus Chen"
    },
    {
        id: 3,
        name: "Elena",
        age: 24,
        bio: "International model based in Paris. Specializing in haute couture and editorial work. Always seeking new creative collaborations.",
        imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
        testimonial: "The results exceeded my expectations. Highly recommended!",
        author: "Jessica Williams"
    },
];

const CardDeck = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profiles] = useState(initialProfiles);

    const handleSwipe = (direction: 'left' | 'right') => {
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
        }, 300);
    };

    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[(currentIndex + 1) % profiles.length];

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 items-center">
                {/* Left side content */}
                <div className="space-y-6">
                    <div className="bg-[#E88D67]/20 rounded-3xl p-6">
                        <h2 className="text-2xl font-bold mb-4">ABOUT ME</h2>
                        <p className="text-gray-600">{currentProfile.bio}</p>
                    </div>
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden">
                        <img
                            src={currentProfile.imageUrl}
                            alt="Additional shot"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Center card - swipeable */}
                <div className="h-[600px] relative">
                    <div className="absolute inset-0">
                        <Card
                            {...currentProfile}
                            isActive={true}
                            index={0}
                            onSwipe={handleSwipe}
                            isSwipeable={true}
                        />
                    </div>
                </div>

                {/* Right side content */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden">
                        <img
                            src={nextProfile.imageUrl}
                            alt="Additional shot"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="bg-[#E88D67] rounded-3xl p-6 text-white">
                        <h2 className="text-2xl font-bold mb-4">TESTIMONIALS</h2>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star}>★</span>
                            ))}
                        </div>
                        <p className="mb-4">{currentProfile.testimonial}</p>
                        <p className="font-semibold">{currentProfile.author}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDeck;