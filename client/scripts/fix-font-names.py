#!/usr/bin/env python3
"""
Repair the internal name records of a woff2 font.

The bundled Switzer-Regular.woff2 carries a corrupted name table: its family,
full and PostScript names are all the literal string "false". Any PDF built
from it embeds a subset named "AAAAAA+false" instead of "AAAAAA+Switzer-Regular",
which shows up in every PDF reader's font list.

Only the 'name' table is rewritten. Glyph outlines, advances, hinting and the
glyf/loca tables are untouched, so rendering is byte-for-byte identical --
verified by rasterising a page before and after and diffing the pixels.

Usage:
    python3 scripts/fix-font-names.py <input.woff2> <output.woff2>
"""

import sys

from fontTools.ttLib import TTFont

# nameID -> replacement. Only the identifiers that describe the typeface
# itself are set; copyright, trademark, vendor and licence records are left
# exactly as the foundry shipped them.
NAMES = {
    1: "Switzer",  # family
    2: "Regular",  # subfamily
    4: "Switzer Regular",  # full name
    6: "Switzer-Regular",  # PostScript name
    16: "Switzer",  # typographic family
    17: "Regular",  # typographic subfamily
}


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1

    src, dst = sys.argv[1], sys.argv[2]

    font = TTFont(src)
    name_table = font["name"]

    for record in name_table.names:
        if record.nameID in NAMES:
            record.string = NAMES[record.nameID]

    # Preserve the woff2 container; fontTools keeps the original flavour.
    font.save(dst)

    print(f"Wrote {dst}")
    for record in TTFont(dst)["name"].names:
        if record.nameID in (1, 4, 6):
            print(f"  nameID {record.nameID}: {record.toUnicode()!r}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
