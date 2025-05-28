from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import models, transforms
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'emotion_model.pth')

# Load the trained ResNet18 model once at startup
model = models.resnet18()
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 7)
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()

# Define image transformations (resize, grayscale, to tensor)
transform = transforms.Compose([
    transforms.Resize((48, 48)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor()
])

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    # Log request details
    print("Request received")
    print("Files in request:", request.files)
    print("Form data:", request.form)
    print("Headers:", dict(request.headers))

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image file selected'}), 400

    try:
        # Read image file bytes and open as PIL Image in grayscale
        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('L')

        # Apply transforms and add batch dimension
        img_tensor = transform(pil_img).unsqueeze(0)

        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            emotion = emotion_labels[predicted.item()]

        # Return detected emotion as JSON
        return jsonify({'detected_emotion': emotion})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
