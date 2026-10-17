# Affordable Cambridge

Static site, same setup as the Miller site: one self-contained HTML file per page, shared header and footer copied into each, Netlify form, `_headers` for caching.

index.html        The story, V4: hook, neighbors, the past (scroll story: 1930 to 2024 map, West Cambridge mansions, 2025 win), one lot nine families, the record year, the rollback, pushed out, we all pay, the ask
numbers.html      Sources and method for every figure, plus the three tabbed maps (banned, diversity, new homes) moved from the homepage
stories.html      Build your card: photo upload with drag and zoom, 7 designs, live preview (Netlify Forms; sends layout, photo_x, photo_y, photo_zoom)
storycards.js     The 7 story card layouts, shared by index.html and stories.html
act.html          Email the Council (editable letter), Pledge to be there (Netlify form), what happens next
thanks.html       Where the story form lands after submit
pledged.html      Where the pledge form lands after submit; shows Add to calendar for each event
events.js         Upcoming events list, shared by index.html, act.html and pledged.html
privacy.html      Short privacy note for the form
images/           Portrait photos go here

## Design
Visual system follows DESIGN.md (Porch Teal): Anton for headlines, DM Serif Display italic for residents' words, DM Sans for everything else. Tokens live in :root and the "Porch Teal design system" block at the end of each page's <style>. The alert band style is still in the CSS for hearing weeks; the band itself is removed until a hearing date is set.

## How the animations work
The past (#past) is no longer scroll-driven. It plays on its own once half of it is on screen, in about 14 seconds: the map runs 1930 to 2024 as the ban spreads out from West Cambridge, the 1942 quote appears, and the four building cards flip from Legal to Illegal to build as the red reaches their pins; then the map zooms into West Cambridge and houses merge into single mansions while the counter runs to -46; then it zooms out and the city turns green from East Cambridge for 2025. A progress bar sits under it, a Replay button appears at the end, and a "The story keeps going" cue points to the next section. Timings are in the story script (progress p from 0 to 1; DUR sets the length). Visitors with reduced motion turned on get the finished state. The rollback (#now) plays once when it scrolls into view: the rules light up one at a time, then the example building shrinks from 12 homes to 3 (SVG scene ported from 05-now-buildings), then the whole block shrinks.

Everything else plays once when it scrolls into view. The "We want to live here" row drifts sideways on its own and freezes while hovered, focused or touched. Resident cards fade up, the porch lights come on with the affordable-homes counter, numbered pins drop onto the zoning map, and the home value chart draws. Visitors with reduced motion turned on see the finished state.

## Deploy
Drag the folder onto app.netlify.com/drop, or push to a repo linked to Netlify.
After the first deploy, turn on form detection: Site settings > Forms.

## Editing numbers
All homepage numbers live in one block at the top of the last <script> in index.html (`var DATA = {...}`): affordable (porch lights and the win counter; 134, A Better Cambridge's pipeline tracker), conversions (the West Cambridge counter; 46, from city permits), resident photos in the porch grid, and the Zillow home value series (homeValue). Every figure and its source is listed on numbers.html; update both together.

## Before launch
Checked against public sources in October 2026; see numbers.html. Still needs a human:
- Contact email and "Paid for by" line in the footer of every page (contact is hello@affordablecambridge.org; check the paid-for line with OCPF)
- Resident stories and photos (index.html DATA.stories, images/neighbor-*.jpg, stories.html): names, neighborhoods and quotes must be real, with consent
- Background video images/cambridge-aerial.mp4 is YouTube drone footage; confirm rights
- og:image and og:url once the Netlify URL exists
- If a newer count of affordable homes than 134 exists, change DATA.affordable and the numbers.html row
- Update the timeline (index.html section 7, act.html, events.js) when the city sets dates

## Swapping photos in the claude.ai preview
photo-edit.js only runs inside the claude.ai preview. Drag an image onto any photo, or press Edit photos and click one; it uploads and saves for everyone who opens the preview. Swaps are keyed by the original path (images/garden-st.jpg), so the same photo changes on every page. The Before photo for 121 Rindge Ave is images/rindge-before.jpg; the drawing shows until that file exists. On Netlify the script does nothing, so ask Claude to pull the swapped photos into images/ before deploying.
