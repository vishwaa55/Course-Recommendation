import axios from 'axios';

export interface Course {
    title: string;
    rating: number; // Float
    num_reviews: number;
    is_paid: boolean;
    url: string;
}

// Ensure this matches the backend endpoint.
const BACKEND_URL = 'https://srivishwaa55-course-recommendation-api.hf.space/search';

export const searchCourses = async (query: string): Promise<Course[]> => {
    // SIMULATION MODE: Since we might not have the backend running as an API yet.
    // We simulate the network delay and return mock data if the fetch fails or is not implemented.

    try {
        // Attempt to call the backend
        // This expects the backend to be running and accepting JSON POST or GET
        // Adjust the endpoint as per actual backend configuration
        const response = await axios.get(BACKEND_URL, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.warn("Backend connection failed or not configured. returning mock data.", error);

        // MOCK DATA adhering to the response format
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

        return [
            {
                title: "Complete Python Bootcamp: Go from zero to hero in Python 3",
                rating: 4.6,
                num_reviews: 450000,
                is_paid: true,
                url: "https://www.udemy.com/course/complete-python-bootcamp/"
            },
            {
                title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
                rating: 4.5,
                num_reviews: 180000,
                is_paid: true,
                url: "https://www.udemy.com/course/machinelearning/"
            },
            {
                title: "Python for Data Science and Machine Learning Bootcamp",
                rating: 4.7,
                num_reviews: 120000,
                is_paid: false,
                url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/"
            },
            {
                title: "The Web Developer Bootcamp 2024",
                rating: 4.8,
                num_reviews: 250000,
                is_paid: true,
                url: "https://www.udemy.com/course/the-web-developer-bootcamp/"
            },
            {
                title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
                rating: 4.7,
                num_reviews: 190000,
                is_paid: true,
                url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"
            },
            {
                title: "Angular - The Complete Guide (2024 Edition)",
                rating: 4.6,
                num_reviews: 150000,
                is_paid: true,
                url: "https://www.udemy.com/course/the-complete-guide-to-angular-2/"
            }
        ];
    }
};
