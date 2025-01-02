import { useState, useRef, useEffect } from 'react';

interface CardProps {
    id: number;
    name: string;
    age: number;
    bio: string;
    imageUrl: string;
    isActive: boolean;
    index: number;
    onSwipe: (direction: 'left' | 'right') => void;
    isSwipeable?: boolean;
}

const Card = ({ name, bio, imageUrl, isActive, index, onSwipe, isSwipeable = false }: CardProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: TouchEvent) => {
        if (!isSwipeable) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX - offsetX);
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (!isSwipeable) return;
        setIsDragging(true);
        setStartX(e.clientX - offsetX);
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !isSwipeable) return;
        const currentX = e.touches[0].clientX - startX;
        setOffsetX(currentX);
        setDirection(currentX > 0 ? 'right' : 'left');
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !isSwipeable) return;
        const currentX = e.clientX - startX;
        setOffsetX(currentX);
        setDirection(currentX > 0 ? 'right' : 'left');
    };

    const handleDragEnd = () => {
        if (!isDragging || !isSwipeable) return;
        setIsDragging(false);

        if (Math.abs(offsetX) > 100) {
            onSwipe(direction || 'left');
            if (direction === 'left') {
                cardRef.current?.classList.add('swipe-left');
            } else {
                cardRef.current?.classList.add('swipe-right');
            }
        } else {
            setOffsetX(0);
            if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.4s ease-out';
            }
        }
        setDirection(null);
    };

    useEffect(() => {
        if (!isActive) return;

        const card = cardRef.current;
        if (!card) return;

        card.addEventListener('touchstart', handleTouchStart);
        card.addEventListener('touchmove', handleTouchMove);
        card.addEventListener('touchend', handleDragEnd);
        card.addEventListener('mousedown', handleMouseDown);
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseup', handleDragEnd);
        card.addEventListener('mouseleave', handleDragEnd);

        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchend', handleDragEnd);
            card.removeEventListener('mousedown', handleMouseDown);
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseup', handleDragEnd);
            card.removeEventListener('mouseleave', handleDragEnd);
        };
    }, [isActive, isDragging]);

    return (
        <div
            ref={cardRef}
            className={`absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden ${
                isDragging && isSwipeable ? 'cursor-grabbing' : isSwipeable ? 'cursor-grab' : ''
            } ${isSwipeable ? 'touch-pan-y' : ''}`}
            style={{
                transform: isSwipeable ? `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)` : 'none',
                transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                willChange: 'transform',
                zIndex: isDragging ? 10 : 1,
            }}
        >
            <div className="h-full flex flex-col">
                <div className="relative h-full bg-gray-200">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                        <h2 className="text-2xl font-bold">{name}</h2>
                        <p className="text-gray-600">Fitness Model</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;