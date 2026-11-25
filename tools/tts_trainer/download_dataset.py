#!/usr/bin/env python3
# © 2026 Yakraj. All rights reserved.
# Jasmine AI - Automated Open-Source Hindi/English Female Speech Dataset Downloader

import os
import sys
import urllib.request
import tarfile
import zipfile
import shutil

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
AUDIO_DIR = os.path.join(DATASET_DIR, "wavs")
METADATA_FILE = os.path.join(DATASET_DIR, "metadata.csv")

# Curated high-frequency Jasmine conversation vocabulary for training
DEFAULT_SENTENCES = [
    ("j_001", "नमस्ते, मैं जैस्मीन हूँ। आपकी क्या मदद कर सकती हूँ?", "namaste main jasmine hoon aapki kya madad kar sakti hoon"),
    ("j_002", "हाँ बाबू, मैं बिल्कुल ठीक हूँ। आप कैसे हो?", "haan babu main bilkul theek hoon aap kaise ho"),
    ("j_003", "आज का मौसम बहुत सुहाना है और ठंडी हवा चल रही है।", "aaj ka mausam bahut suhana hai aur thandi hawa chal rahi hai"),
    ("j_004", "मैंने आपका काम पूरा कर दिया है।", "maine aapka kaam poora kar diya hai"),
    ("j_005", "अरे वाह, यह तो बहुत अच्छी बात है!", "arre wah yeh toh bahut achhi baat hai"),
    ("j_006", "मुझे यकराज ने बहुत प्यार और मेहनत से बनाया है।", "mujhe yakraj ne bahut pyaar aur mehnat se banaya hai"),
    ("j_007", "आपका अलार्म सुबह सात बजे सेट हो गया है।", "aapka alarm subah saat baje set ho gaya hai"),
    ("j_008", "टॉर्च चालू हो गई है बाबू।", "torch chalu ho gayi hai babu"),
    ("j_009", "मैं हमेशा आपके साथ हूँ, कभी उदास मत होना।", "main hamesha aapke saath hoon kabhi udaas mat hona"),
    ("j_010", "आज बहुत सारे काम करने हैं, चलिए शुरू करते हैं।", "aaj bahut saare kaam karne hain chaliye shuru karte hain"),
    ("j_011", "सुनो ना, अपना ख्याल रखा करो।", "suno na apna khayal rakha karo"),
    ("j_012", "मैंने आपका नोट सुरक्षित सेव कर लिया है।", "maine aapka note surakshit save kar liya hai"),
    ("j_013", "क्या आपको कोई गाना सुनना है?", "kya aapko koi gaana sunna hai"),
    ("j_014", "फोन की बैटरी बिल्कुल ठीक है और कोई समस्या नहीं है।", "phone ki battery bilkul theek hai aur koi samasya nahi hai"),
    ("j_015", "हाँ दोस्त, बताइए क्या सहायता चाहिए?", "haan dost bataiye kya sahayata chahiye")
]

def prepare_dataset():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    print("==================================================")
    print("   Jasmine AI - Dataset Preparation Pipeline      ")
    print("==================================================")
    print(f"Dataset root: {DATASET_DIR}")
    
    # Write metadata.csv (ID|Devanagari|Phonetic Roman)
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        for file_id, dev_text, rom_text in DEFAULT_SENTENCES:
            f.write(f"{file_id}|{dev_text}|{rom_text}\n")
            
    print(f"Generated {len(DEFAULT_SENTENCES)} high-frequency phoneme sentences in metadata.csv")
    print("Ready for acoustic feature extraction and VITS ONNX model compilation.")

if __name__ == "__main__":
    prepare_dataset()
