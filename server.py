import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List, Dict, Any

# ----------------------------
# Paths & Setup
# ----------------------------
BASE_DIR = Path(__file__).resolve().parent
EMBEDDINGS_PATH = BASE_DIR / "embeddings" / "course_embeddings.npy"
METADATA_PATH = BASE_DIR / "embeddings" / "course_metadata.csv"

# Global variables for caching
model = None
course_embeddings = None
df = None

def load_resources():
    global model, course_embeddings, df
    print("Loading model and data...")
    # Load Model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    # Load Data
    if not EMBEDDINGS_PATH.exists() or not METADATA_PATH.exists():
        raise FileNotFoundError(f"Data files not found. Please ensure {EMBEDDINGS_PATH} and {METADATA_PATH} exist.")
        
    course_embeddings = np.load(EMBEDDINGS_PATH)
    df = pd.read_csv(METADATA_PATH)
    print("Resources loaded successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_resources()
    yield

# ----------------------------
# Init App
# ----------------------------
app = FastAPI(title="Course Recommendation API", lifespan=lifespan)

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev; specify localhost:5173 in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# API Endpoints
# ----------------------------

@app.get("/")
async def root():
    return {"message": "Course Recommendation API is running!", "docs_url": "/docs"}

@app.get("/search")
async def search(q: str = Query(..., min_length=1)):
    """
    Semantic search for courses based on query 'q'.
    Replicates the logic from the Streamlit app.
    """
    global model, course_embeddings, df
    
    if model is None or course_embeddings is None or df is None:
        return {"error": "Server is not ready. Resources not loaded."}

    # 1. Encode query
    query_embedding = model.encode(q, normalize_embeddings=True)

    # 2. Calculate Cosine Similarity
    # course_embeddings should be shape (N, D), query is (D,)
    # Result is (N,)
    similarities = np.dot(course_embeddings, query_embedding)
    
    # Create a working copy of dataframe to avoid modifying global state continuously (though pandas is usually copy-on-write or we just make a view)
    # We'll create a new DataFrame with the scores for this request
    res_df = df.copy()
    res_df["similarity"] = similarities

    # Smart Filter: Check for "free" in query
    # If the user explicitly asks for "free", strictly filter for unpaid courses.
    if "free" in q.lower().split():
        print("Smart Filter: 'free' detected. Filtering for unpaid courses.")
        # Ensure 'is_paid' is treated as boolean. If read from CSV without specific dtype, it might be correct, 
        # but robust code handles nuances.
        res_df = res_df[res_df["is_paid"] == False]

    # 3. Quality signals (Pre-calculation could be done once, but we follow app.py flow)
    res_df["rating_norm"] = res_df["rating"] / 5.0
    res_df["reviews_norm"] = np.log1p(res_df["num_reviews"])

    # 4. Filter First: Keep only top 50 semantically relevant courses
    # This removes popular but irrelevant courses from the running
    res_df = res_df.sort_values(by="similarity", ascending=False).head(50)

    # 5. Final Score Logic (Revised to prioritize Relevance)
    # 90% Similarity, 10% Quality Signals (just as a tie-breaker for relevant courses)
    res_df["final_score"] = (
        0.90 * res_df["similarity"] +
        0.05 * res_df["rating_norm"] +
        0.05 * res_df["reviews_norm"]
    )

    # 6. Top 6 results
    top_results = res_df.sort_values(by="final_score", ascending=False).head(6)

    # Debug: Check if embeddings are working
    print(f"\n--- Search Logic Debug ---")
    print(f"Query: '{q}'")
    print("Top results raw similarity vs final score:")
    print(top_results[["title", "similarity", "final_score"]].to_string(index=False))
    print("--------------------------\n")

    # 6. Format response
    response = []
    for _, row in top_results.iterrows():
        response.append({
            "title": row["title"],
            "rating": float(row["rating"]),
            "num_reviews": int(row["num_reviews"]),
            "is_paid": bool(row["is_paid"]),
            "url": row["url"]
        })

    return response

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
