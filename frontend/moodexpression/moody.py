import cv2
import torch
import torch.nn as nn
import numpy as np
from torchvision import models, transforms
from pymongo import MongoClient
from datetime import datetime

# MongoDB Connection
client = MongoClient("mongodb+srv://harshaagarwal820:qwerty123@cluster0.wenoafq.mongodb.net/")
db = client['mood_database']
collection = db['emotion_logs']

# Emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Load the trained ResNet18 model
model = models.resnet18()
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 7)

model.load_state_dict(torch.load('D:/moodexpression/emotion_model.pth', map_location=torch.device('cpu')))
model.eval()

# Transform pipeline
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((48, 48)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor()
])

# Face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = gray[y:y+h, x:x+w]
        if roi.size == 0:
            continue

        face_tensor = transform(roi).unsqueeze(0)

        with torch.no_grad():
            outputs = model(face_tensor)
            _, predicted = torch.max(outputs, 1)
            emotion = emotion_labels[predicted.item()]

        # Save to MongoDB
        document = {
            "timestamp": datetime.utcnow(),
            "emotion": emotion
        }
        collection.insert_one(document)

        # Annotate frame
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(frame, emotion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('Emotion Detection with MongoDB Logging', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
