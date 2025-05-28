import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models

# Define dataset directory path (use raw string to avoid escape errors)
data_dir = "D:\\moodexpression\\train"



# Define image transformations
transform = transforms.Compose([
    transforms.Resize((48, 48)),
    transforms.Grayscale(num_output_channels=3),  # If dataset is grayscale, convert to 3 channels
    transforms.ToTensor()
])

# Load training data
train_data = datasets.ImageFolder(root=data_dir, transform=transform)
train_loader = torch.utils.data.DataLoader(train_data, batch_size=32, shuffle=True)

# Show class names
print("Classes:", train_data.classes)

# Load pre-trained ResNet18 model
model = models.resnet18(pretrained=True)

# Modify the last layer for emotion classification (7 classes)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 7)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# Loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, labels)

        # Backward pass and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {running_loss / len(train_loader):.4f}")

# Save the trained model
save_path = "D:\\moodexpression\\emotion_model.pth"
try:
    torch.save(model.state_dict(), save_path)
    print(f"✅ Model saved to: {save_path}")
except Exception as e:
    print("❌ Error saving model:", e)
