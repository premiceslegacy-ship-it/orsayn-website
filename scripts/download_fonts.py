
import re
import os
import urllib.request

# Create directory if not exists
if not os.path.exists('app/fonts'):
    os.makedirs('app/fonts')

with open('fonts.css', 'r') as f:
    content = f.read()

# Regex to find font-family, src url (woff2), and font-weight
# Note: The regex needs to handle the multiline nature and the specific format from FontShare
pattern = r"@font-face\s*{\s*font-family:\s*'([^']+)';\s*src:\s*url\('([^']+)'\)\s*format\('woff2'\).*?font-weight:\s*(\d+);"

matches = re.findall(pattern, content, re.DOTALL)

print(f"Found {len(matches)} font files to download.")

for font_family, url, weight in matches:
    # Clean font family name
    family_name = font_family.replace(' ', '')
    filename = f"app/fonts/{family_name}-{weight}.woff2"
    
    # Download
    if not url.startswith('http'):
        url = 'https:' + url
        
    print(f"Downloading {filename} from {url}...")
    try:
        urllib.request.urlretrieve(url, filename)
        print("Done.")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
