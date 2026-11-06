#!/usr/bin/env python3
"""
Search CLI for the free-for-dev catalog.
Allows querying 1,370+ free-tier developer services, tools, and platforms.
"""

import argparse
import json
import os
import re
import sys

def load_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, 'data', 'free-for-dev.json')
    if not os.path.exists(json_path):
        print(f"Error: Catalog data not found at {json_path}", file=sys.stderr)
        sys.exit(1)
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def list_categories(data):
    cats = {}
    for item in data:
        cat = item['category']
        cats[cat] = cats.get(cat, 0) + 1
    print("Available categories in free-for-dev:")
    for cat, count in sorted(cats.items(), key=lambda x: x[0].lower()):
        print(f"  - {cat} ({count} services)")

def search_catalog(data, query='', category='', limit=10):
    query_tokens = [t.lower() for t in query.strip().split()] if query else []
    cat_filter = category.lower().strip() if category else ''

    results = []
    for item in data:
        cat = item['category'].lower()
        if cat_filter and cat_filter not in cat:
            continue

        name = item['name'].lower()
        desc = item['description'].lower()

        score = 0
        if not query_tokens:
            score = 1
        else:
            matches_all = True
            for token in query_tokens:
                token_score = 0
                if token in name:
                    token_score += 40
                    if name.startswith(token) or token == name:
                        token_score += 20
                if token in cat:
                    token_score += 15
                if token in desc:
                    token_score += 5 + min(desc.count(token) * 2, 10)

                if token_score == 0:
                    matches_all = False
                    break
                score += token_score

            if not matches_all:
                continue

        results.append((score, item))

    results.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in results[:limit]]

def main():
    parser = argparse.ArgumentParser(description="Search free-for-dev cloud services and developer free tiers.")
    parser.add_argument('query', nargs='*', help='Keywords to search for (e.g. postgres, redis, auth, vps)')
    parser.add_argument('-c', '--category', help='Filter by category name (e.g. "Managed Data Services", "Hosting")')
    parser.add_argument('--categories', action='store_true', help='List all available categories')
    parser.add_argument('-l', '--limit', type=int, default=10, help='Maximum number of results to display (default: 10)')
    parser.add_argument('--json', action='store_true', help='Output results as JSON')

    args = parser.parse_args()
    data = load_data()

    if args.categories:
        list_categories(data)
        return

    query_str = ' '.join(args.query).strip() if args.query else ''
    if not query_str and not args.category:
        parser.print_help()
        print("\nTip: Run with --categories to see all categories, or search e.g.: python search.py postgres")
        return

    results = search_catalog(data, query=query_str, category=args.category, limit=args.limit)

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
        return

    if not results:
        print(f"No matching free services found for query: \"{query_str}\" (Category: {args.category or 'Any'})")
        return

    print(f"\n=== Found {len(results)} matching free service(s) ===\n")
    for i, item in enumerate(results, 1):
        print(f"{i}. {item['name']} [{item['category']}]")
        print(f"   URL: {item['url']}")
        print(f"   Free Tier: {item['description']}")
        print()

if __name__ == '__main__':
    main()

