import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import type { Course } from '../api';

interface CourseCardProps {
    course: Course;
    index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
    // Helper to render stars
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />);
            } else if (i === fullStars && hasHalfStar) {
                // Approximate half star with a different opacity or a specific icon if available, 
                // but standard Star doesn't support half easily without SVG manipulation.
                // We'll use a filled star with 50% width masking or just a lighter color for simplicity/visuals.
                // Or better: Render a star but with a gradient or just a partial fill SVG manually 
                // For simplicity in this prompt, a full star with a different color or just full stars is common,
                // but let's try to be precise.
                stars.push(
                    <div key={i} className="relative">
                        <Star size={16} className="text-gray-600" />
                        <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                            <Star size={16} className="fill-yellow-500 text-yellow-500" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} size={16} className="text-gray-600 dark:text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-surface border border-white/10 dark:border-black/5 rounded-2xl p-6 overflow-hidden flex flex-col justify-between h-[280px] shadow-2xl transition-colors duration-300"
        >
            {/* Glow Edges / Accent Lines - Using Theme Colors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Vertical Accent - Tech look */}
            <div className="absolute top-1/4 -left-[1px] h-1/2 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-30 group-hover:opacity-100 transition-all" />
            <div className="absolute top-1/4 -right-[1px] h-1/2 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-30 group-hover:opacity-100 transition-all" />

            {/* Content */}
            <div className="z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${course.is_paid ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {course.is_paid ? 'Paid' : 'Free'}
                    </span>
                    <span className="text-xs text-text/60">
                        {course.num_reviews.toLocaleString()} reviews
                    </span>
                </div>

                <h3 className="text-xl font-bold text-text line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                    {course.title}
                </h3>

                <div className="flex items-center space-x-1 mb-4">
                    <span className="text-lg font-bold text-accent mr-1">{course.rating.toFixed(1)}</span>
                    <div className="flex text-accent">
                        {renderStars(course.rating)}
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="mt-auto">
                <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-text/5 hover:bg-text/10 border border-text/10 transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_15px_var(--glow-color)]"
                >
                    <span className="mr-2 font-semibold text-text">Go to Course</span>
                    <ExternalLink size={16} className="text-text group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            {/* Background Glow on Hover */}
            <div className="absolute -inset-[100px] bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
};

export default CourseCard;
