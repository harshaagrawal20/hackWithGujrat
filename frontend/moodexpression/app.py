from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from torchvision import models, transforms
from PIL import Image
import io
import os
from pymongo import MongoClient
from collections import defaultdict
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# MongoDB setup (replace URI with your own)
client = MongoClient("mongodb+srv://harshaagarwal820:qwerty123@cluster0.wenoafq.mongodb.net/")
db = client['mood_database']
collection = db['emotion_logs']  # Or your Atlas URI


# Emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Model loading
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'emotion_model.pth')

model = models.resnet18()
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 7)
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()

transform = transforms.Compose([
    transforms.Resize((48, 48)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor()
])

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image file selected'}), 400

    try:
        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('L')
        img_tensor = transform(pil_img).unsqueeze(0)

        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            emotion = emotion_labels[predicted.item()]

        # Save prediction with timestamp to MongoDB
        collection.insert_one({
            "emotion": emotion,
            "timestamp": datetime.utcnow()
        })

        return jsonify({'detected_emotion': emotion})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mood_graph_data')
def mood_graph_data():
    now = datetime.utcnow()
    start = now - timedelta(hours=24)

    records = collection.find({"timestamp": {"$gte": start}})

    counts = defaultdict(lambda: defaultdict(int))
    for record in records:
        ts = record['timestamp']
        emotion = record['emotion']
        hour_str = ts.strftime("%H:00")  # Group by hour
        counts[hour_str][emotion] += 1

    hours = sorted(counts.keys())
    emotions = emotion_labels

    data = {"timestamps": hours}
    for e in emotions:
        data[e] = [counts[hour].get(e, 0) for hour in hours]

    return jsonify(data)

@app.route('/mood_graph.png')
def mood_graph_png():
    # Get aggregated data from the mood_graph_data function
    data = mood_graph_data().get_json()
    timestamps = data['timestamps']
    emotions = emotion_labels

    plt.figure(figsize=(12, 6))
    for e in emotions:
        plt.plot(timestamps, data[e], marker='o', label=e)

    plt.xlabel('Hour (UTC)')
    plt.ylabel('Count')
    plt.title('Mood Tracker - Last 24 Hours')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
