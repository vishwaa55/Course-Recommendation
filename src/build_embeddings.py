import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# ----------------------------
# Paths
# ----------------------------
from pathlib import Path

# Base directory (project root)
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "udemy_courses.csv"
EMBEDDINGS_DIR = BASE_DIR / "embeddings"
EMBEDDINGS_PATH = EMBEDDINGS_DIR / "course_embeddings.npy"
METADATA_PATH = EMBEDDINGS_DIR / "course_metadata.csv"

EMBEDDINGS_DIR.mkdir(exist_ok=True)


# ----------------------------
# Load dataset
# ----------------------------
df = pd.read_csv(DATA_PATH)

print(f"Loaded dataset with {len(df)} courses")

# ----------------------------
# Build semantic text
# ----------------------------
df["semantic_text"] = (
    df["title"].astype(str) + " " +
    df["headline"].astype(str) + " " +
    df["objectives"].astype(str) + " " +
    df["curriculum"].astype(str) + " " +
    "Level: " + df["instructional_level"].astype(str) + " " +
    "Category: " + df["category"].astype(str)
)

# Truncate to avoid unnecessary transformer cost
MAX_CHARS = 1500
df["semantic_text"] = df["semantic_text"].str.slice(0, MAX_CHARS)

# Drop rows with missing critical data
df = df.dropna(subset=["semantic_text", "title", "url"]).reset_index(drop=True)

print("Semantic text prepared")

# ----------------------------
# Load model (CPU-friendly)
# ----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# ----------------------------
# Generate embeddings (OFFLINE)
# ----------------------------
print("Generating embeddings...")

course_embeddings = model.encode(
    df["semantic_text"].tolist(),
    batch_size=64,
    show_progress_bar=True,
    normalize_embeddings=True
)

print("Embedding generation completed")

# ----------------------------
# Save embeddings + metadata
# ----------------------------
np.save(EMBEDDINGS_PATH, course_embeddings)

df.to_csv(METADATA_PATH, index=False)

print(f"Embeddings saved to: {EMBEDDINGS_PATH}")
print(f"Metadata saved to: {METADATA_PATH}")
