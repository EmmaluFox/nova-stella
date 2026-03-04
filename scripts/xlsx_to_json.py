#!/usr/bin/env python3
"""
Simple XLSX -> JSON converter for Nova Stella events.

Usage:
  pip install pandas openpyxl
  python scripts/xlsx_to_json.py --input "path/to/Nova Stella Evants.xlsx" --output src/events/data.json

The script maps common column names (case-insensitive) to the expected
JSON keys used by the front-end. Unknown columns are preserved as-is.
"""
import argparse
import json
import os
import sys

try:
    import pandas as pd
except Exception as e:
    print('Missing dependency: run `pip install pandas openpyxl`')
    raise


COMMON_KEYS = [
    'Talk Title','Speaker','Talk Blurb','Image','In Person Eventbrite Link',
    'Online Eventbrite Link','Date','Start Time','Venue','Address','City','Postcode','Status','Link'
]


def normalize_col(col):
    return ''.join(ch for ch in col.lower() if ch.isalnum())


def pick_key(colname):
    n = normalize_col(colname)
    for k in COMMON_KEYS:
        if normalize_col(k) == n:
            return k
    # heuristics
    if 'title' in n:
        return 'Talk Title'
    if 'speaker' in n:
        return 'Speaker'
    if 'blurb' in n or 'description' in n or 'summary' in n:
        return 'Talk Blurb'
    if 'image' in n or 'img' in n or 'photo' in n:
        return 'Image'
    if 'eventbrite' in n or 'booking' in n or 'link' in n:
        return 'Link'
    if 'date' in n:
        return 'Date'
    if 'time' in n:
        return 'Start Time'
    if 'venue' in n or 'location' in n:
        return 'Venue'
    return colname


def row_to_obj(row, cols):
    out = {}
    for c in cols:
        val = row.get(c)
        if pd.isna(val):
            continue
        # convert numpy types
        if hasattr(val, 'tolist') and not isinstance(val, str):
            try:
                val = val.tolist()
            except Exception:
                pass
        out[c] = val
    return out


def serialize_val(val):
    import datetime
    import numpy as _np
    if val is None:
        return None
    # pandas timestamp/date
    try:
        if isinstance(val, (pd.Timestamp, datetime.date, datetime.datetime)):
            return val.isoformat()
    except Exception:
        pass
    # datetime.time
    try:
        if isinstance(val, datetime.time):
            return val.isoformat()
    except Exception:
        pass
    # numpy scalar
    if isinstance(val, (_np.integer, _np.floating, _np.bool_)):
        return val.item()
    # bytes
    if isinstance(val, (bytes, bytearray)):
        try:
            return val.decode('utf-8')
        except Exception:
            return str(val)
    # fallback
    return val


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', '-i', required=True)
    p.add_argument('--sheet', '-s', default=0, help='Sheet name or index')
    p.add_argument('--output', '-o', default='src/events/data.json')
    p.add_argument('--backup', action='store_true', help='Backup existing output file')
    args = p.parse_args()

    if not os.path.exists(args.input):
        print('Input file not found:', args.input)
        sys.exit(2)

    df = pd.read_excel(args.input, sheet_name=args.sheet)
    if df.empty:
        print('No data found in sheet.')
        sys.exit(0)

    # map columns
    original_cols = list(df.columns)
    mapped = {}
    for col in original_cols:
        mapped[col] = pick_key(str(col))

    # build output rows preserving mapped keys
    out_rows = []
    for _, r in df.iterrows():
        obj = {}
        for col in original_cols:
            key = mapped[col]
            val = r[col]
            if pd.isna(val):
                continue
            val = serialize_val(val)
            # if key collides, prefer first occurrence
            if key in obj:
                # store under original column name as fallback
                obj[col] = val
            else:
                obj[key] = val
        out_rows.append(obj)

    out_path = args.output
    if args.backup and os.path.exists(out_path):
        bak = out_path + '.bak'
        os.replace(out_path, bak)
        print('Backed up', out_path, 'to', bak)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out_rows, f, ensure_ascii=False, indent=2)

    print('Wrote', len(out_rows), 'rows to', out_path)


if __name__ == '__main__':
    main()
