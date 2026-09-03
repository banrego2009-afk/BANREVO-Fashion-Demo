import os
import urllib.request
import urllib.parse
from PIL import Image
import io
import time
import shutil

products = [
  {"slug": "alina-selyem-midi-ruha", "clothing": "a minimalist silk midi dress in champagne color"},
  {"slug": "mira-noi-szett", "clothing": "a tailored ivory women's suit set"},
  {"slug": "lilla-pliszirozott-ruha", "clothing": "a flowing pleated soft pink dress"},
  {"slug": "nora-gyapjukabat", "clothing": "an elegant warm gray wool coat"},
  {"slug": "reka-kotott-szett", "clothing": "a cozy beige ribbed knit set with wide pants"},
  {"slug": "sara-strukturalt-blezer", "clothing": "a structured minimalist black blazer with architectural shoulders"},
  {"slug": "dora-szaten-szett", "clothing": "a fluid satin two-piece set in pearl white"},
  {"slug": "hanna-minimalista-top", "clothing": "a sleek minimalist white sleeveless top and tailored trousers"},
  {"slug": "boglarka-nadragos-szett", "clothing": "an elegant high-waisted wide-leg trousers set in stone color"},
  {"slug": "virag-trench-coat", "clothing": "a classic modern trench coat in light camel"}
]

accessories = [
  {"slug": "emma-len-ruha", "desc": "a minimalist linen dress"},
  {"slug": "petra-pamut-polo", "desc": "a premium white cotton t-shirt"},
  {"slug": "zsoka-wrapdress", "desc": "an elegant wrap dress"},
  {"slug": "kata-kasmirkardigan", "desc": "a soft cashmere cardigan"},
  {"slug": "juli-szeles-nadrag", "desc": "wide leg tailored trousers"},
  {"slug": "anna-selyembluz", "desc": "a smooth silk blouse"},
  {"slug": "aria-bor-szandal", "desc": "minimalist leather sandals"},
  {"slug": "luna-bortaska", "desc": "an elegant leather handbag"},
  {"slug": "sofia-bor-ov", "desc": "a classic leather belt"},
  {"slug": "elena-napszemuveg", "desc": "designer sunglasses"},
  {"slug": "flora-selyemsal", "desc": "a beautiful patterned silk scarf"},
  {"slug": "maya-arany-fulbevalo", "desc": "elegant gold earrings"},
  {"slug": "diana-sarkos-cipo", "desc": "classic high heel pumps"},
  {"slug": "vera-szovott-taska", "desc": "a woven tote bag"}
]

MODEL_DESC = "high-end editorial fashion photography of Sofia, a distinct 26-year-old female fashion model with sharp cheekbones, sleek straight dark brown hair parted in the middle, piercing hazel eyes, and fair skin, standing in a bright minimalist white photography studio, wearing"

def download_image(prompt, seed=None):
    url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) + "?width=800&height=1200&nologo=true"
    if seed:
        url += "&seed=" + str(seed)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    print("Downloading: " + url)
    try:
        with urllib.request.urlopen(req) as response:
            return response.read()
    except Exception as e:
        print("Failed to download: " + str(e))
        time.sleep(2)
        return None

def process_product(prod):
    base_dir = "public/images/products/" + prod['slug']
    os.makedirs(base_dir, exist_ok=True)
    seed = 42 + len(prod['slug'])

    views = {
        "view-1": "Full body shot, walking elegantly, side angle, looking away.",
        "view-2": "Close up shot on the fabric and upper body, looking away.",
        "view-3": "Full body shot, turning around, back view."
    }
    
    for v_name, v_desc in views.items():
        path = base_dir + "/" + v_name + ".webp"
        if os.path.exists(path):
            continue
        p = MODEL_DESC + " " + prod['clothing'] + ". " + v_desc
        img_data = download_image(p, seed)
        if img_data:
            img = Image.open(io.BytesIO(img_data))
            img.save(path, "WEBP", quality=85)
            print("Saved " + path)

    main_path = base_dir + "/main.webp"
    transparent_path = base_dir + "/transparent.webp"
    
    if not os.path.exists(main_path) or not os.path.exists(transparent_path):
        p_clothing = "High-end product photography of " + prod['clothing'] + ". The clothing is hanging vertically on a simple thin metal wire hanger. Pure solid white background. No humans, no model, no mannequin, no body parts. Studio lighting, flat lay style hanging."
        img_data = download_image(p_clothing, seed+100)
        if img_data:
            img = Image.open(io.BytesIO(img_data))
            img.save(main_path, "WEBP", quality=85)
            print("Saved " + main_path)
            
            # Since rembg failed due to space, just copy the white background image as transparent.webp
            # We will use THREE.MultiplyBlending in the 3D scene to make the white background transparent!
            shutil.copy(main_path, transparent_path)
            print("Saved " + transparent_path + " (copied from main)")

def process_accessory(acc):
    base_dir = "public/images/products/accessories/" + acc['slug']
    os.makedirs(base_dir, exist_ok=True)
    seed = 84 + len(acc['slug'])
    
    path = base_dir + "/main.webp"
    if os.path.exists(path):
        return
        
    p = "High-end product photography of " + acc['desc'] + ". Pure solid white background. No humans, no model. Studio lighting, perfectly centered."
    img_data = download_image(p, seed)
    if img_data:
        img = Image.open(io.BytesIO(img_data))
        img.save(path, "WEBP", quality=85)
        print("Saved " + path)

def main():
    print("Starting generation without rembg...")
    for prod in products:
        process_product(prod)
    for acc in accessories:
        process_accessory(acc)
    print("All done!")

if __name__ == '__main__':
    main()
