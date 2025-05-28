# database.py

import mysql.connector
from datetime import datetime

# Replace with your actual DB credentials
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',
    'database': 'moodtracker'
}

def log_emotion(emotion):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO emotion_logs (timestamp, emotion) VALUES (%s, %s)"
        cursor.execute(query, (timestamp, emotion))
        conn.commit()
        conn.close()
        print(f"Logged emotion: {emotion} at {timestamp}")
    except mysql.connector.Error as err:
        print("Error:", err)
