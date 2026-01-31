import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';
import { searchCourses, type Course } from './api';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query) return;

    setLoading(true);
    setHasSearched(true);
    setCourses([]); // Clear previous results to trigger animation for new ones? Or keep?
    // User flow implies new search -> replace results.

    try {
      const results = await searchCourses(query);
      setCourses(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background text-text transition-colors duration-300 overflow-hidden flex flex-col selection:bg-primary/30 relative">
      <ThemeToggle />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 h-full flex flex-col relative z-10 max-w-7xl">

        {/* Search Section */}
        <motion.div
          layout
          className={`flex flex-col items-center w-full ${hasSearched ? 'pt-8 shrink-0' : 'flex-1 justify-center'}`}
        >
          <motion.div layout className="w-full flex flex-col items-center">
            {!hasSearched && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center"
              >
                Find Your Next Course
              </motion.h1>
            )}

            <SearchBar onSearch={handleSearch} isSearching={loading} />
          </motion.div>
        </motion.div>

        {/* Results Section - Scrollable Area */}
        {hasSearched && (
          <div className="flex-1 w-full mt-8 overflow-y-auto px-2 pb-8 scrollbar-hide">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && courses.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {courses.map((course, index) => (
                    <CourseCard key={`${course.title}-${index}`} course={course} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && courses.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-text/50">
                <p className="text-xl">No courses found. Try a different query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
