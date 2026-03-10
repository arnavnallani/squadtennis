// ─── DETERMINISTIC CODE GENERATION ───────────────────────────────────────────
// FNV-1a 32-bit hash — deterministic per school name, collision-resistant
function fnv32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // 31 chars, no ambiguous 0/O/I/1/L

function makeCode(name, salt = 0) {
  let h = fnv32(name + '\0' + salt);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[h % CODE_CHARS.length];
    h = ((h >>> 5) | (h << 27)) >>> 0;
    h = (h ^ ((i + 1) * 0x9E3779B9)) >>> 0;
  }
  return code;
}

// ─── SCHOOL DEFINITIONS ───────────────────────────────────────────────────────
// enrolled: true = has an active Squad Tennis page
// slug:     URL path for enrolled schools (e.g. "sjsu" → /sjsu)
const DEFS = [
  // ── NorCal ──────────────────────────────────────────────────────────────────
  { name: "San Jose State University", enrolled: true,  slug: "sjsu" },
  { name: "Bla University" },
  { name: "UC Berkeley" },
  { name: "Stanford University" },
  { name: "UC Davis" },
  { name: "UC Santa Cruz" },
  { name: "Santa Clara University" },
  { name: "San Francisco State University" },
  { name: "St. Mary's College of California" },
  { name: "UC Merced" },
  { name: "California State University, Fresno" },
  { name: "Sacramento State University" },
  { name: "California State University, East Bay" },
  { name: "University of the Pacific" },
  { name: "Dominican University of California" },
  { name: "Northeastern University Oakland" },
  { name: "Menlo College" },

  // ── SoCal ───────────────────────────────────────────────────────────────────
  { name: "UCLA" },
  { name: "University of Southern California" },
  { name: "UC San Diego" },
  { name: "UC Riverside" },
  { name: "UC Santa Barbara" },
  { name: "UC Irvine" },
  { name: "Cal Poly San Luis Obispo" },
  { name: "California State University, Long Beach" },
  { name: "California State University, Fullerton" },
  { name: "California State University, Northridge" },
  { name: "Loyola Marymount University" },
  { name: "University of San Diego" },
  { name: "Pepperdine University" },
  { name: "Chapman University" },
  { name: "Cal Poly Pomona" },
  { name: "San Diego State University" },
  { name: "Azusa Pacific University" },

  // ── Pacific Northwest ────────────────────────────────────────────────────────
  { name: "University of Washington" },
  { name: "Washington State University" },
  { name: "University of Oregon" },
  { name: "Oregon State University" },
  { name: "Portland State University" },
  { name: "University of Portland" },
  { name: "Gonzaga University" },
  { name: "Western Washington University" },
  { name: "University of Idaho" },

  // ── Nevada / Arizona ─────────────────────────────────────────────────────────
  { name: "University of Nevada, Reno" },
  { name: "University of Nevada, Las Vegas" },
  { name: "University of Arizona" },
  { name: "Arizona State University" },
  { name: "Northern Arizona University" },
  { name: "Grand Canyon University" },

  // ── Mountain West ────────────────────────────────────────────────────────────
  { name: "University of Utah" },
  { name: "Utah State University" },
  { name: "Brigham Young University" },
  { name: "Utah Valley University" },
  { name: "University of Colorado Boulder" },
  { name: "Colorado State University" },
  { name: "University of Denver" },
  { name: "Colorado School of Mines" },
  { name: "University of New Mexico" },
  { name: "New Mexico State University" },

  // ── Texas ────────────────────────────────────────────────────────────────────
  { name: "University of Texas at Austin" },
  { name: "Texas A&M University" },
  { name: "University of Houston" },
  { name: "Rice University" },
  { name: "Texas Christian University" },
  { name: "Southern Methodist University" },
  { name: "Baylor University" },
  { name: "Texas Tech University" },
  { name: "University of North Texas" },
  { name: "Texas State University" },
  { name: "UT Dallas" },
  { name: "UT San Antonio" },

  // ── Florida ──────────────────────────────────────────────────────────────────
  { name: "University of Florida" },
  { name: "Florida State University" },
  { name: "University of Miami" },
  { name: "Florida International University" },
  { name: "University of South Florida" },
  { name: "University of Central Florida" },
  { name: "Florida Atlantic University" },
  { name: "Rollins College" },
  { name: "Stetson University" },
  { name: "Florida Gulf Coast University" },

  // ── Georgia ──────────────────────────────────────────────────────────────────
  { name: "Georgia Institute of Technology" },
  { name: "University of Georgia" },
  { name: "Georgia State University" },
  { name: "Emory University" },
  { name: "Kennesaw State University" },

  // ── Carolinas ────────────────────────────────────────────────────────────────
  { name: "Duke University" },
  { name: "University of North Carolina" },
  { name: "NC State University" },
  { name: "Wake Forest University" },
  { name: "Davidson College" },
  { name: "Clemson University" },
  { name: "University of South Carolina" },
  { name: "College of Charleston" },
  { name: "Elon University" },

  // ── Virginia ─────────────────────────────────────────────────────────────────
  { name: "University of Virginia" },
  { name: "Virginia Tech" },
  { name: "George Mason University" },
  { name: "James Madison University" },
  { name: "William & Mary" },
  { name: "Virginia Commonwealth University" },

  // ── Tennessee / Kentucky ──────────────────────────────────────────────────────
  { name: "Vanderbilt University" },
  { name: "University of Tennessee" },
  { name: "University of Kentucky" },
  { name: "University of Louisville" },

  // ── Deep South ───────────────────────────────────────────────────────────────
  { name: "University of Alabama" },
  { name: "Auburn University" },
  { name: "Louisiana State University" },
  { name: "Tulane University" },
  { name: "University of Mississippi" },
  { name: "Mississippi State University" },

  // ── Midwest ──────────────────────────────────────────────────────────────────
  { name: "University of Michigan" },
  { name: "Michigan State University" },
  { name: "Ohio State University" },
  { name: "Purdue University" },
  { name: "Indiana University" },
  { name: "University of Notre Dame" },
  { name: "Northwestern University" },
  { name: "University of Illinois Urbana-Champaign" },
  { name: "University of Chicago" },
  { name: "DePaul University" },
  { name: "Loyola University Chicago" },
  { name: "University of Wisconsin-Madison" },
  { name: "University of Wisconsin-Milwaukee" },
  { name: "University of Minnesota" },
  { name: "Iowa State University" },
  { name: "University of Iowa" },
  { name: "University of Kansas" },
  { name: "Kansas State University" },
  { name: "University of Nebraska-Lincoln" },
  { name: "University of Missouri" },
  { name: "Washington University in St. Louis" },
  { name: "Saint Louis University" },
  { name: "Creighton University" },
  { name: "University of Cincinnati" },
  { name: "Case Western Reserve University" },
  { name: "Miami University" },
  { name: "Michigan Technological University" },
  { name: "Grand Valley State University" },

  // ── Mid-Atlantic ─────────────────────────────────────────────────────────────
  { name: "University of Maryland" },
  { name: "Georgetown University" },
  { name: "American University" },
  { name: "George Washington University" },
  { name: "Pennsylvania State University" },
  { name: "Villanova University" },
  { name: "Temple University" },
  { name: "Drexel University" },
  { name: "University of Delaware" },
  { name: "Rutgers University" },
  { name: "Lehigh University" },
  { name: "Stevens Institute of Technology" },

  // ── Ivy League & elite NE ────────────────────────────────────────────────────
  { name: "Harvard University" },
  { name: "Yale University" },
  { name: "Princeton University" },
  { name: "Columbia University" },
  { name: "Cornell University" },
  { name: "Dartmouth College" },
  { name: "Brown University" },
  { name: "University of Pennsylvania" },
  { name: "MIT" },

  // ── New England ──────────────────────────────────────────────────────────────
  { name: "Boston University" },
  { name: "Boston College" },
  { name: "Northeastern University" },
  { name: "Tufts University" },
  { name: "University of Connecticut" },
  { name: "University of Massachusetts Amherst" },
  { name: "University of Vermont" },
  { name: "University of New Hampshire" },
  { name: "University of Maine" },
  { name: "Quinnipiac University" },
  { name: "Fairfield University" },

  // ── New York ─────────────────────────────────────────────────────────────────
  { name: "New York University" },
  { name: "Fordham University" },
  { name: "Stony Brook University" },
  { name: "University at Buffalo" },
  { name: "Binghamton University" },
  { name: "Syracuse University" },
  { name: "Rochester Institute of Technology" },
  { name: "University of Rochester" },
  { name: "Hofstra University" },
  { name: "Colgate University" },

  // ── Liberal Arts ─────────────────────────────────────────────────────────────
  { name: "Amherst College" },
  { name: "Williams College" },
  { name: "Middlebury College" },
  { name: "Swarthmore College" },
  { name: "Pomona-Pitzer Colleges" },
  { name: "Bowdoin College" },
  { name: "Colby College" },
  { name: "Hamilton College" },
  { name: "Wesleyan University" },
  { name: "Haverford College" },
  { name: "Macalester College" },
  { name: "Kenyon College" },
  { name: "Oberlin College" },
  { name: "Denison University" },
  { name: "Trinity College" },
  { name: "Carleton College" },
  { name: "Grinnell College" },

  { name: "Epic University" },
  { name: "Cool University" },
  { name: "Nice University" },

  // ── Other ────────────────────────────────────────────────────────────────────
  { name: "Grand View University" },
  { name: "Bethel University" },
  { name: "Indiana University Southeast" },
  { name: "Lindsey Wilson College" },
  { name: "William Jessup University" },
  { name: "Westmont College" },
];

// ─── BUILD SCHOOLS WITH GENERATED CODES ─────────────────────────────────────
const usedCodes = new Set();

const SCHOOLS = DEFS.map(def => {
  let code = makeCode(def.name);
  let salt = 1;
  while (usedCodes.has(code)) {
    code = makeCode(def.name, salt++);
  }
  usedCodes.add(code);
  return {
    name:     def.name,
    enrolled: def.enrolled || false,
    slug:     def.slug || null,
    code,
    colors:   {},
  };
});

export default SCHOOLS;
