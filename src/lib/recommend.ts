import type { Hall, UserConditions, Venue } from "./types";

export type Candidate = { venue: Venue; hall: Hall | null; score: number; reasons: string[] };

export function recommend(venues: Venue[], halls: Hall[], brightnessPreference: number, conditions: UserConditions): Candidate[] {
  const hallByVenue = new Map<string, Hall[]>();
  for (const hall of halls) hallByVenue.set(hall.venue_id, [...(hallByVenue.get(hall.venue_id) ?? []), hall]);

  return venues
    .filter((venue) => venue.recommendation_ready)
    .map((venue) => {
      const venueHalls = hallByVenue.get(venue.venue_id) ?? [];
      let best: Candidate = { venue, hall: null, score: 0, reasons: [] };
      for (const hall of venueHalls.length ? venueHalls : [null]) {
        let score = 0;
        const reasons: string[] = [];
        if (!conditions.districts.length || conditions.districts.includes(venue.district)) {
          score += 20;
          if (conditions.districts.length) reasons.push("희망 지역");
        }
        if (hall?.seated_capacity && conditions.guestCount) {
          const fits = hall.seated_capacity >= conditions.guestCount;
          score += fits ? 20 : -100;
          if (fits) reasons.push(`${conditions.guestCount}명 수용 가능`);
        }
        if (hall?.atmosphere && brightnessPreference !== 0) {
          const hallValue = hall.atmosphere === "bright" ? 1 : -1;
          const taste = 1 - Math.abs(hallValue - brightnessPreference) / 2;
          score += taste * 40;
          if (taste > 0.75) reasons.push(hall.atmosphere === "bright" ? "밝은 홀 취향" : "어두운 홀 취향");
        }
        if (hall?.meal_won || hall?.rental_won) score += 10;
        if (venue.source_count >= 3) score += 10;
        if (score > best.score) best = { venue, hall, score, reasons };
      }
      return best;
    })
    .filter((candidate) => candidate.score > -50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
