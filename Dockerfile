# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# We strictly pin versions if possible, but for now we trust the existing file + uvicorn
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Create a writable directory for cache if needed (Sentence Transformers downloads models)
# We set the cache folder to a writable location
ENV SENTENCE_TRANSFORMERS_HOME=/app/cache
RUN mkdir -p /app/cache && chmod 777 /app/cache

# Hugging Face Spaces serves on port 7860 by default
EXPOSE 7860

# Run server.py when the container launches
# We use command line uvicorn to ensure we bind to 0.0.0.0 and port 7860
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]
