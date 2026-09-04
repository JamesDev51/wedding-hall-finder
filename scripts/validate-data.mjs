import fs from "node:fs";

const venuePath = "public/data/v1/venues.json";
const hallPath = "public/data/v1/halls.json";
if (!fs.existsSync(venuePath) || !fs.existsSync(hallPath)) {
  console.error("service dataset 미동기화: public/data/v1/venues.json, halls.json이 필요합니다.");
  console.error("Codex handoff: npm run data:sync 후 importer를 완성하세요.");
  process.exit(1);
}
const venues = JSON.parse(fs.readFileSync(venuePath, "utf8"));
const halls = JSON.parse(fs.readFileSync(hallPath, "utf8"));
const ids = new Set(venues.map((venue) => venue.venue_id));
if (venues.length !== 213) throw new Error(`Expected 213 service venues, got ${venues.length}`);
if (ids.size !== venues.length) throw new Error("Duplicate venue_id detected");
if (venues.some((venue) => venue.canonical_name?.includes("남산한남웨딩가든"))) throw new Error("Public venue leaked into service scope");
const hallIds = new Set();
for (const hall of halls) {
  if (!ids.has(hall.venue_id)) throw new Error(`Dangling hall venue_id: ${hall.venue_id}`);
  if (hallIds.has(hall.hall_id)) throw new Error(`Duplicate hall_id: ${hall.hall_id}`);
  hallIds.add(hall.hall_id);
}
console.log(`OK: ${venues.length} venues / ${halls.length} halls`);
