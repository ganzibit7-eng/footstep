# 2026-10-03 evening expansion and course addresses

- Inserted 3 original-GPX walking courses and 1,052 pet-friendly places. Approved totals after import: 215 courses and 2,575 places.
- Places: 971 campsites, 64 parks/attractions, 9 lodging properties, 7 shopping venues and 1 restaurant/cafe. GoCamping detail pages were individually read for address, coordinates, pet access, camping type, operating period/days and phone. Of 999 detailed camp records, 16 lacked confirmed pet permission, 11 matched an existing/selected campsite and 1 had invalid coordinates. They were excluded.
- Small-dog-only permissions are preserved explicitly. A campsite's access field does not imply all cabins/glamping rooms permit pets; descriptions retain booking/zone restrictions. KTO partial permissions without a specific allowed area/condition are withheld, as are uncertain forest permissions.
- KTO public pet fields and active content/address/coordinates were checked. Existing and user-owned records were preserved; this SQL inserts only and aborts each transaction on mismatched IDs.
- c430: Jeju-si Dakmeoreu coastal trail. The original official GPX supplies approximately 1.0 km of the advertised 1.8 km course. The name and description explicitly label the supplied section. Durunubi's city metadata incorrectly says Seogwipo; official KTO address and point geocoding identify Jeju-si.
- c431: Yeo-gang trail course 4. Original GPX has two alternative full tracks with the same endpoints and over 85% sample overlap. The first complete original track (13.40 km) is used. Both originals and the processing decision are retained in compressed evidence; duplicate alternatives are not concatenated.
- c432: Incheon Dulle-gil course 13 Wolmisan, 4.89 km original GPX. Location and full pet permission matched; its geometry was checked against existing courses.
- Name collisions across distant cities, duplicate paths, uncertain partial pet permissions and the national-park portion of Windy Hill were rejected. Actual source hashes and accepted coordinates are retained.

## Address display and search

215 GPX first points were resolved with Kakao coordinate-to-address lookup. Road addresses are preferred; otherwise the returned parcel address is used. Five offshore/beach first points return no parcel; the next original GPX point with a valid address within 200 metres is explicitly labelled “start vicinity” with its distance. No street numbers are fabricated, and no parking entrance claim is made.

Address data is bound to the course ID and start coordinates, so moving the course cannot silently reuse a stale address. Cards replace the official-source link with the address. Official sources remain in course details. Address matching searches road and parcel forms, handles province-name aliases and multiple search terms, and shares results with the map. Static search/detail pages and metadata also include addresses; search-engine crawl timing is outside this deployment.

## Verification

`node tests/expansion-evening.cjs`, `node tests/expansion-integrity.cjs`, `node tests/feature-quality.cjs`, JS syntax checks, SEO generation, guarded database inserts and count/ID verification. Evidence records are factual public sources; source review is not an on-site visit. Existing homepage layout, centered mobile carousel, page numbers, login, reviews and recording are preserved.

Production browser verification: homepage displayed 215 courses and 2,575 places; every home card showed its start address. Searching `신촌리 3403-2` returned only c430, with the matching Jeju-si parcel address and explicit partial-GPX title. `address-search-proof.jpg` records that result after successful Pages deployment.
