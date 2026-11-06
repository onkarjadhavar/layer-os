#!/usr/bin/env python3
"""
Sync script to update the free-for-dev catalog from the official upstream repository.
Parses both top-level and nested offerings (e.g. Cloudflare -> R2, GCP -> Compute Engine)
into a structured JSON catalog.
"""

import json
import os
import re
import urllib.request

REPO_URL = 'https://raw.githubusercontent.com/ripienaar/free-for-dev/master/README.md'

def parse_markdown(text):
    sections = re.split(r'\n##\s+', text)
    all_items = []

    for sec in sections[1:]:
        lines = sec.split('\n')
        cat = lines[0].strip()
        if cat.startswith('#'):
            continue

        parent_name = None
        parent_url = None

        for line in lines[1:]:
            indent = len(line) - len(line.lstrip(' '))
            stripped = line.strip()
            if not (stripped.startswith('*') or stripped.startswith('-')):
                continue

            content = stripped.lstrip('*-').strip()
            if not content:
                continue

            if indent <= 2:
                m = re.match(r'\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)', content)
                if m:
                    p_name, p_url, p_desc = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
                    parent_name = p_name
                    parent_url = p_url
                    if p_desc:
                        all_items.append({
                            'category': cat,
                            'name': p_name,
                            'url': p_url,
                            'description': re.sub(r'\s+', ' ', p_desc)
                        })
                else:
                    parent_name = content
                    parent_url = ''
            else:
                m = re.match(r'\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)', content)
                if m:
                    c_name, c_url, c_desc = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
                    full_name = f"{parent_name} - {c_name}" if parent_name else c_name
                    all_items.append({
                        'category': cat,
                        'name': full_name,
                        'url': c_url,
                        'description': re.sub(r'\s+', ' ', c_desc)
                    })
                else:
                    m2 = re.match(r'([^–—\-:]+)\s*[-–—:]\s*(.*)', content)
                    if m2:
                        c_name, c_desc = m2.group(1).strip(), m2.group(2).strip()
                        full_name = f"{parent_name} - {c_name}" if parent_name else c_name
                        all_items.append({
                            'category': cat,
                            'name': full_name,
                            'url': parent_url or '',
                            'description': re.sub(r'\s+', ' ', c_desc)
                        })

    return all_items

def sync():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Fetching latest catalog from {REPO_URL}...")
    raw = urllib.request.urlopen(REPO_URL, timeout=30).read().decode('utf-8')

    items = parse_markdown(raw)

    json_path = os.path.join(base_dir, 'data', 'free-for-dev.json')
    ref_path = os.path.join(base_dir, 'references', 'README.md')

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    with open(ref_path, 'w', encoding='utf-8') as f:
        f.write(raw)

    print(f"Successfully synced: {len(items)} free services saved to {json_path}")

if __name__ == '__main__':
    sync()
