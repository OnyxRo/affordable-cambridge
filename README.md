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
One section now pins the page while you scroll through them (V4 animatic). The past (#past, 640vh tall): the map runs 1930 to 2024 as the ban spreads out from West Cambridge, the 1942 quote appears, and the four building cards flip from Legal to Illegal to build as the red reaches their pins; then the map zooms into West Cambridge and houses turn into mansions while the counter runs to -48; then it zooms out and the city turns green from East Cambridge for 2025 and the cards flip to Legal again. Timings are listed at the top of the story script. The rollback (#now) is the earlier version: the rules light up one at a time, the 147 counter climbs, the example building shrinks from 12 homes to 9, then the whole block shrinks. Visitors with reduced motion turned on get the same states in steps, without tweening.

Everything else plays once when it scrolls into view. The "We want to live here" row drifts sideways on its own and freezes while hovered, focused or touched. Each other piece plays once when it scrolls into view: resident cards fade up, the porch lights come on with the 147 counter, numbered pins drop onto the zoning map (hovering a street photo lights its pin), the population-loss bars grow year by year and wipe out the neighbors they reach, and the cost chart draws. Visitors with reduced motion turned on see the finished state.

## Deploy
Drag the folder onto app.netlify.com/drop, or push to a repo linked to Netlify.
After the first deploy, turn on form detection: Site settings > Forms.

## Editing numbers
All homepage numbers live in one block at the top of the last <script> in index.html (`var DATA = {...}`): affordable (porch lights and the win counter), atRisk (the Now and Never built counters), conversions (the West Cambridge mansions counter), resident photos in the porch grid, and the illustrative rent/price series.

## Before launch
Search every file for TODO and [square brackets]. Main ones:
- Confirm 147 affordable homes proposed, with earlier years for comparison (David)
- Confirm the 147 at-risk figure and the method behind it (numbers.html)
- The past map: "Where apartments were banned" is built from official City of Cambridge GIS zoning polygons (March 2024, pre-ordinance). The "Diversity" tab redraws CDD p. 16 values on official neighborhood boundaries (original in images/cdd-diversity-map.jpg). The "New homes" tab redraws David's draft net-units map (images/units-permitted-since-envision-draft.jpg); confirm its time frame and credit line
- Cite the inclusionary threshold behind the 12-to-9 building example
- The past map: years before 2024 are approximate (bans start in 1943, more in 1962). Swap in historical district maps if David has them. Headline says 100 years, but the first apartment bans came in 1943
- West Cambridge conversions (-48, city permit data 1996 to 2024): confirm figure and query
- 121 Rindge Ave: confirm address and 1 to 9 homes; add the rendering of the planned house as the Before photo
- Win tiles: confirm "all-electric homes" is part of the 2025 ordinance
- Rent and home price series for We all pay (chart is illustrative)
- Pushed out chart: DATA.migration is illustrative; replace with Boston Indicators' yearly net loss of 25 to 44-year-olds (2006 to 2022) and fill in [N] residents per figure
- Illegal to build cards: photos in images/garden-st.jpg etc. are low-res crops; swap in originals, confirm each building is nonconforming, and move the map pins to exact addresses
- Nine new neighbor photos (images/neighbor-1.jpg to neighbor-9.jpg) need names, neighborhoods, quotes and written consent; they also fill the faces in the Pushed out chart
- Resident stories and photos: hook cards, Never built story card, porch grid photos, stories.html
- Background video images/cambridge-aerial.mp4 is YouTube drone footage; confirm rights
- Contact email and paid-for line (footer on every page)
- og:image and og:url once the Netlify URL exists
- Update the timeline (index.html section 7 and act.html) as the city sets dates

## Swapping photos in the claude.ai preview
photo-edit.js only runs inside the claude.ai preview. Drag an image onto any photo, or press Edit photos and click one; it uploads and saves for everyone who opens the preview. Swaps are keyed by the original path (images/garden-st.jpg), so the same photo changes on every page. The Before photo for 121 Rindge Ave is images/rindge-before.jpg; the drawing shows until that file exists. On Netlify the script does nothing, so ask Claude to pull the swapped photos into images/ before deploying.
