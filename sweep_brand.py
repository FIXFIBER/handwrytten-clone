#!/usr/bin/env python3
"""Brand-sweep every page: Handwrytten/Handwritten -> TOP10 NG, fix phone/email/logo.
Safe: never touches the invisible theme asset path /wp-content/themes/handwrytten/."""
import re, glob

PAGES = glob.glob("/home/darkaxis/websites/handwrytten-full/pages/**/*.html", recursive=True)

brand = re.compile(r"(?<![\w/])(?:handwrytten|handwritten)(?!/)(?!\w)", re.I)
phone = re.compile(r"\+1\s*\(?\s*888\s*\)?\s*[-]?\s*284\s*[-]?\s*5197")
email = re.compile(r"contact@/?\s*(?=[\"'> )]|$)|contact@handwrytten\.com", re.I)
ext_link = re.compile(r'href=["\']https?://(www\.)?handwrytten\.com[^"\']*["\']', re.I)
copyright_re = re.compile(r"(?i)(©\s*\d{4}\s*)handwrytten(\s*\.)")
logo_dsk = re.compile(r'<div class="logo sized dsk"><a href="/"><img[^>]*logo@2x\.png[^>]*></a></div>')
logo_stk = re.compile(r'<div class="logo sized stk">.*?</a></div>', re.S)
logo_mob = re.compile(r'<div class="logo sized"><a href="/"><img[^>]*logo@2x\.png[^>]*></a></div>')
logo_black = re.compile(r'<img[^>]*logo-black\.svg[^>]*class="cta-logo mob">')
logo_white = re.compile(r'<img[^>]*logo-white@2x\.png[^>]*class="logo">')

def repl_logo_dsk(m):    return '<div class="logo sized dsk"><a href="/" class="dx-logo">TOP10 <span class="dx-ng">NG</span></a></div>'
def repl_logo_stk(m):    return '<div class="logo sized stk"><a href="/" class="dx-logo dx-logo-sm">TOP10 <span class="dx-ng">NG</span></a></div>'
def repl_logo_mob(m):    return '<div class="logo sized"><a href="/" class="dx-logo">TOP10 <span class="dx-ng">NG</span></a></div>'
def repl_logo_black(m):  return '<span class="dx-logo dx-logo-dark cta-logo mob">TOP10 <span class="dx-ng">NG</span></span>'
def repl_logo_white(m):  return '<span class="dx-logo dx-logo-white logo">TOP10 <span class="dx-ng">NG</span></span>'
def repl_copyright(m):   return m.group(1) + "TOP10 NG."

total = 0
for p in PAGES:
    t = open(p).read()
    before = t
    t = brand.sub("TOP10 NG", t)
    t = phone.sub("+234 800 867 1064", t)
    t = email.sub("hello@top10.ng", t)
    t = ext_link.sub('href="/"', t)
    t = copyright_re.sub(repl_copyright, t)
    t = logo_dsk.sub(repl_logo_dsk, t)
    t = logo_stk.sub(repl_logo_stk, t)
    t = logo_mob.sub(repl_logo_mob, t)
    t = logo_black.sub(repl_logo_black, t)
    t = logo_white.sub(repl_logo_white, t)
    if t != before:
        open(p, "w").write(t)
        total += 1

print(f"Pages modified: {total} / {len(PAGES)}")
