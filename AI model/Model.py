from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_similarity_score(image: Image.Image, prompt: str):
    inputs = processor(text=[prompt], images=image, return_tensors="pt", padding=True)
    outputs = model(**inputs)

    # Get embeddings
    image_emb = outputs.image_embeds
    text_emb = outputs.text_embeds

    # Cosine similarity
    score = torch.nn.functional.cosine_similarity(image_emb, text_emb)
    return score.item()

image = Image.open("Untitled_3.png")
prompt = "A cat riding a skateboard"
score = get_similarity_score(image, prompt)
print(f"Similarity score for the prompt '{prompt}': {score}")