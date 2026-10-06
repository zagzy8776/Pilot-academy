-- Meridian Aviation Academy seed (PostgreSQL / Neon)
-- Partner names must match the logo files served from public/partners/<name>.svg
delete from partners;
insert into partners (name, tier, sort) values
('EASA', 'platinum', 1),
('FAA', 'platinum', 2),
('ICAO', 'platinum', 3),
('IATA', 'platinum', 4);
delete from jobs;
insert into jobs (title, firm_alias, location, comp_band, engagement, clearance, status, sort) values
('First Officer - A320 Family', 'European Flag Carrier', 'Madrid (Base Roster)', '€68k - €94k + per diem', 'Line', 'Type-rated', 'active', 1),
('Senior Cabin Crew / Purser', 'Gulf Hub Airline', 'Dubai (Base Roster)', '$46k - $62k + housing', 'Line', 'Safety-trained', 'active', 2),
('Ground Operations Supervisor', 'Regional Airport Group', 'London Heathrow (Shift)', '£38k - £48k + shift pay', 'Shift', 'Airside', 'active', 3),
('Type Rating Instructor - B737', 'Approved Training Organisation', 'Frankfurt (Simulator)', '€92k - €118k', 'Training', 'TRI / IRE', 'active', 4),
('Flight Dispatcher', 'International Cargo Carrier', 'Leipzig (Hybrid)', '€54k - €70k', 'Roster', 'Dispatch licence', 'active', 5),
('Cabin Safety Instructor', 'Aviation Training Academy', 'Dublin (On-site)', '€58k - €72k', 'Training', 'CRM-qualified', 'active', 6);
delete from slots;
insert into slots (starts_at, ends_at, partner) values
(now() + interval '2 days' + interval '9 hours', now() + interval '2 days' + interval '9 hours 30 minutes', 'Senior Partner Panel'),
(now() + interval '2 days' + interval '11 hours', now() + interval '2 days' + interval '11 hours 30 minutes', 'Training Captain Review'),
(now() + interval '3 days' + interval '10 hours', now() + interval '3 days' + interval '10 hours 30 minutes', 'Flight Standards Panel'),
(now() + interval '4 days' + interval '14 hours', now() + interval '4 days' + interval '14 hours 30 minutes', 'Senior Partner Panel'),
(now() + interval '5 days' + interval '9 hours', now() + interval '5 days' + interval '9 hours 30 minutes', 'Training Captain Review'),
(now() + interval '5 days' + interval '15 hours', now() + interval '5 days' + interval '15 hours 30 minutes', 'Flight Standards Panel');
-- Academy catalogue, served to /programs, /program-details and /about via lib/queries.ts
delete from programs;
insert into programs (id, slug, name, summary, min_hours, typical_hours, price_low, price_high, price_note, featured, sort) values
(1, 'private', 'Private pilot', 'Your first certificate. Fly for personal travel and build the base for every rating after it.', '40 (Part 61) or 35 (Part 141)', '50 to 70 hours', 12000, 20000, 'Typical U.S. range. Intensive academy programs often run higher.', false, 1),
(2, 'instrument', 'Instrument rating', 'Fly in cloud and low visibility. Required for most professional flying.', '40 hours of instrument time', '40 to 55 hours', 21000, 26000, 'Full-time program range.', true, 2),
(3, 'commercial', 'Commercial certificate', 'Fly for pay. Includes complex aircraft and advanced maneuvers.', '250 total flight hours', '250 total hours', 25000, 29000, 'Full-time program range.', false, 3),
(4, 'career', 'Zero to airline career', 'Every certificate and rating an airline requires, in one structured path.', '1,500 hours for airline transport', '1,500 total hours', 80000, 130000, 'Typical range for a complete professional path, often more.', false, 4),
(5, 'cabin-crew', 'Cabin crew', 'Safety, service and emergency procedures for airline cabin crew, including aircraft-specific training.', 'No flight hours required', '8 weeks', null, null, 'Academy cohort pricing on request.', false, 5),
(6, 'ground-ops', 'Ground operations', 'Ramp safety, aircraft marshalling, baggage handling and ground support equipment.', 'No flight hours required', '6 weeks', null, null, 'Academy cohort pricing on request.', false, 6);
delete from rates;
insert into rates (id, label, low, high, unit, sort) values
(1, 'Single-engine aircraft rental', 130, 220, 'per hour', 1),
(2, 'Multi-engine aircraft rental', 275, 375, 'per hour', 2),
(3, 'Flight instructor', 50, 100, 'per hour', 3),
(4, 'Simulator session', 60, 120, 'per hour', 4),
(5, 'Ground school', 300, 1500, 'per course', 5),
(6, 'Medical certificate', 100, 225, 'one time', 6),
(7, 'FAA written test', 175, 200, 'one time', 7),
(8, 'Checkride examiner', 500, 900, 'one time', 8);
delete from faqs;
insert into faqs (id, question, answer, sort) values
(1, 'Do I need flying experience?', 'No. Most students begin with zero hours.', 1),
(2, 'How many hours will I need?', 'The FAA minimum for a private certificate is 40 hours (35 at a Part 141 school). Most students need 50 to 70.', 2),
(3, 'What does training really cost?', 'Aircraft rental is the largest cost, followed by instructor time. Ask us for a written estimate before you start.', 3),
(4, 'Do I need a medical certificate?', 'Yes. Book an FAA medical exam early so nothing delays your first solo.', 4),
(5, 'Can I train around a full-time job?', 'Yes. Flying two to three times a week is the most efficient schedule for most working students.', 5);
delete from training_steps;
insert into training_steps (id, title, body, sort) values
(1, 'Discovery flight', 'Fly with an instructor, tour the fleet and agree a training plan and budget.', 1),
(2, 'Ground school and first solo', 'Study weather, navigation and regulations while building toward your first solo flight.', 2),
(3, 'Cross-country and night', 'Plan flights between airports and complete your night and solo cross-country requirements.', 3),
(4, 'Checkride', 'Complete a mock checkride, then fly your practical test with an FAA examiner.', 4);
