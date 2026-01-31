import numpy as np
import pandas as pd
import streamlit as st
from sentence_transformers import SentenceTransformer
from pathlib import Path

# ----------------------------
# Page config
# ----------------------------
st.set_page_config(
    page_title="Course Recommendation System",
    layout="wide"
)

# ----------------------------
# Paths
# ----------------------------
BASE_DIR = Path(__file__).resolve().parent
EMBEDDINGS_PATH = BASE_DIR / "embeddings" / "course_embeddings.npy"
METADATA_PATH = BASE_DIR / "embeddings" / "course_metadata.csv"

# ----------------------------
# Load data (cached)
# ----------------------------
@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

@st.cache_data
def load_data():
    embeddings = np.load(EMBEDDINGS_PATH)
    df = pd.read_csv(METADATA_PATH)
    return embeddings, df

model = load_model()
course_embeddings, df = load_data()

# ----------------------------
# Helper: rating stars
# ----------------------------
def rating_to_stars(rating):
    full = int(rating)
    half = rating - full >= 0.5
    stars = "★" * full
    if half:
        stars += "½"
    return stars

# ----------------------------
# UI: Title
# ----------------------------
st.markdown(
    "<h1 style='text-align: center;'>Course Recommendation System</h1>",
    unsafe_allow_html=True
)

# ----------------------------
# Search Bar (centered initially)
# ----------------------------
search_container = st.container()

with search_container:
    user_query = st.text_input(
        "",
        placeholder="Describe the course you want to learn (e.g. beginner python, easy to understand, short duration...)",
        key="search_query"
    )

# ----------------------------
# Search Logic
# ----------------------------
if user_query.strip():

    # Slight spacing so search bar appears higher
    st.markdown("<br>", unsafe_allow_html=True)

    # Encode query
    query_embedding = model.encode(
        user_query,
        normalize_embeddings=True
    )

    # Cosine similarity
    df["similarity"] = np.dot(course_embeddings, query_embedding)

    # Quality signals
    df["rating_norm"] = df["rating"] / 5.0
    df["reviews_norm"] = np.log1p(df["num_reviews"])

    # Final score
    df["final_score"] = (
        0.6 * df["similarity"] +
        0.25 * df["rating_norm"] +
        0.15 * df["reviews_norm"]
    )

    # Top 6 results
    results = (
        df.sort_values(by="final_score", ascending=False)
          .head(6)
    )

    st.markdown("## Recommended Courses")

    # ----------------------------
    # Display cards (2 rows × 3 columns)
    # ----------------------------
    cols = st.columns(3)

    for idx, row in enumerate(results.itertuples()):
        with cols[idx % 3]:
            st.markdown(
                f"""
                <div style="
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    padding: 16px;
                    height: 260px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                ">
                    <div>
                        <h3 style="margin-bottom: 10px;">{row.title}</h3>
                        <p><b>Level:</b> {row.instructional_level}</p>
                        <p><b>Paid:</b> {"Yes" if row.is_paid else "Free"}</p>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 18px; color: #f5a623;">
                            {rating_to_stars(row.rating)}
                        </span>
                        <a href="{row.url}" target="_blank">
                            <button style="
                                padding: 8px 14px;
                                border-radius: 8px;
                                border: none;
                                background-color: #4CAF50;
                                color: white;
                                cursor: pointer;
                            ">
                                Go to Course
                            </button>
                        </a>
                    </div>
                </div>
                """,
                unsafe_allow_html=True
            )
