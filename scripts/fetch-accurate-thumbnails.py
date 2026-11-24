import urllib.request
import urllib.parse
import json
import time
import os

HEADERS = {
    "User-Agent": "FarmSaathiApp/1.0 (https://github.com/singhkrish0059-png/farmsaathi; singhkrish0059@gmail.com)"
}

WIKI_FILES = {
    "coconut.jpg": "File:Coconuts_-_single_and_cracked_open.jpg",
    "tomatoes.jpg": "File:Tomato_je.jpg",
    "bananas.jpg": "File:Bananas.jpg",
    "onions.jpg": "File:Fresh_Red_Onion.jpg",
    "brinjal.jpg": "File:Solanum_melongena_24_08_2012_(1).JPG",
    "green-chilli.jpg": "File:Green_chillies_variety.jpg",
    "groundnuts.jpg": "File:Dried_groundnuts.jpg",
    "rice.jpg": "File:WhiteRice.jpg",
    "tur-dal.jpg": "File:Pigeon_Pea_(Toor_Dal)_(49683602388).jpg",
    "ragi.jpg": "File:Eleusine_coracana_(L.)_Gaertn._(2934263357).jpg",
    "ragi-seeds.jpg": "File:Finger_Millet_Seed.jpg",
    "jowar.jpg": "File:Sorghum_bicolor_Moderne_MHNT.BOT.2015.34.152.jpg",
    "mangoes.jpg": "File:Mango(Totapuri).jpg",
    "honey.jpg": "File:Runny_hunny.jpg",
    "turmeric.jpg": "File:Grounded_turmeric.jpg",
    "vermicompost.jpg": "File:Organik-gubre-cesitleri.jpg",
    "neem-cake.jpg": "File:Azadirachta_indica_-_Neem_at_Tenkasi_2014_(1).jpg",
    "cow-dung-manure.jpg": "File:Cow_dung_34.jpg",
    "organic-compost.jpg": "File:Compost_site_germany.JPG",
    "bio-fertilizer.jpg": "File:Root_Nodules_with_leghaemoglobin_'pink'_visible.JPG"
}

dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "products"))
os.makedirs(dest_dir, exist_ok=True)

# Query Wikimedia API for all titles in batches
titles = "|".join(WIKI_FILES.values())
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json"

print("Querying Wikimedia API for accurate product image thumbnails...", flush=True)
req = urllib.request.Request(api_url, headers=HEADERS)
with urllib.request.urlopen(req, timeout=15) as r:
    data = json.loads(r.read().decode())

title_to_thumb = {}
for page in data.get("query", {}).get("pages", {}).values():
    title = page.get("title")
    info = page.get("imageinfo", [{}])[0]
    thumb = info.get("thumburl") or info.get("url")
    if title and thumb:
        # Normalize title key
        norm_title = title.replace(" ", "_")
        title_to_thumb[norm_title] = thumb
        title_to_thumb[title] = thumb

print(f"Retrieved {len(title_to_thumb)} thumbnails from Wikimedia API.", flush=True)

success_count = 0
for filename, wiki_title in WIKI_FILES.items():
    thumb_url = title_to_thumb.get(wiki_title) or title_to_thumb.get(wiki_title.replace(" ", "_"))
    if not thumb_url:
        print(f"FAILED to find thumbnail for {filename} ({wiki_title})", flush=True)
        continue

    dest_path = os.path.join(dest_dir, filename)
    print(f"Downloading {filename} from {thumb_url}...", flush=True)
    
    img_req = urllib.request.Request(thumb_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(img_req, timeout=15) as resp:
            content = resp.read()
            if len(content) > 5000 and (content.startswith(b"\xff\xd8\xff") or content.startswith(b"\x89PNG") or content.startswith(b"RIFF")):
                with open(dest_path, "wb") as f:
                    f.write(content)
                print(f"  -> SAVED {filename} ({len(content)} bytes)", flush=True)
                success_count += 1
            else:
                print(f"  -> INVALID content for {filename} (length {len(content)})", flush=True)
    except Exception as e:
        print(f"  -> ERROR downloading {filename}: {e}", flush=True)
    
    time.sleep(0.5)

print(f"\nFinal: {success_count}/{len(WIKI_FILES)} accurate images successfully saved to {dest_dir}", flush=True)
