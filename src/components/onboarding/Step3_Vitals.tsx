'use client';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/hooks/useOnboarding';

interface StepProps {
    onNext: () => void;
}

const INDIAN_CITIES = [
    "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad",
    "Pune", "Chennai", "Kolkata", "Goa", "Ahmedabad", "Jaipur"
];

export default function Step3_Vitals({ onNext }: StepProps) {
    const { data, saveStepData, saving } = useOnboarding();
    const [age, setAge] = useState<number | ''>(data.age || '');
    const [city, setCity] = useState(data.city || INDIAN_CITIES[0]);
    const [bio, setBio] = useState(data.bio || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setAge(data.age || '');
        setCity(data.city || INDIAN_CITIES[0]);
        setBio(data.bio || '');
    }, [data.age, data.city, data.bio]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const generateBio = () => {
        setIsGenerating(true);
        const fullBio = "Deeply appreciative of culture and elegance. Based in India but with a global mindset. Looking for meaningful connections with someone who values discretion and sophistication.";
        let i = 0;
        setBio('');

        intervalRef.current = setInterval(() => {
            setBio((prev) => prev + fullBio.charAt(i));
            i++;
            if (i >= fullBio.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsGenerating(false);
            }
        }, 25);
    };

    const handleNext = async () => {
        const ageNum = typeof age === 'number' ? age : parseInt(age as string, 10);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) return;

        const success = await saveStepData({
            age: ageNum,
            city,
            bio,
        });
        if (success) {
            onNext();
        }
    };

    const isValid = age && Number(age) >= 18 && Number(age) <= 99 && city;

    return (
        <div className="space-y-12">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-serif tracking-tight">Vitals</h2>
                <p className="text-zinc-500 text-sm italic">"The basics, elevated."</p>
            </header>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <Calendar size={12} /> Age
                        </label>
                        <Input
                            type="number"
                            placeholder="21"
                            value={age}
                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                            min={18}
                            max={99}
                            className="bg-zinc-900 border-zinc-800 text-center text-lg focus:border-[#F7E7CE]"
                        />
                        {age && (Number(age) < 18 || Number(age) > 99) && (
                            <p className="text-[10px] text-red-400">Age must be 18-99</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <MapPin size={12} /> City
                        </label>
                        <div className="relative">
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-md text-white px-3 text-sm focus:outline-none focus:border-[#F7E7CE] appearance-none"
                            >
                                {INDIAN_CITIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <MapPin size={14} className="text-zinc-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500">About Me</label>
                        <button
                            onClick={generateBio}
                            disabled={isGenerating}
                            className="flex items-center gap-1 text-[10px] text-[#F7E7CE] hover:text-white transition-colors disabled:opacity-50"
                        >
                            <Sparkles size={10} />
                            {isGenerating ? 'Generating...' : 'Auto-Generate'}
                        </button>
                    </div>

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell your story..."
                        maxLength={500}
                        className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:border-[#F7E7CE]/50 transition-colors resize-none"
                    />
                    <p className="text-[9px] text-zinc-600 text-right">{bio.length}/500</p>
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!isValid || saving}
                className="w-full py-5 bg-white text-black text-xs font-black tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? 'Saving...' : 'Continue'}
            </button>
        </div>
    );
}
