// School accent colors optimized for dark backgrounds.
// "accent" replaces gold (#c9a96e) in the SJSU design system.
// When a school's primary color is too dark for a dark bg, we use their secondary.

const MAP = {
  // ── NorCal ─────────────────────────────────────────────────────────────────
  "San Jose State University":               { accent: "#E5A823", accentHi: "#F0C050", accentGlow: "rgba(229,168,35,.15)" },
  "Bla University":                          { accent: "#7B68EE", accentHi: "#9580FF", accentGlow: "rgba(123,104,238,.15)" },
  "UC Berkeley":                             { accent: "#FDB515", accentHi: "#FDCA50", accentGlow: "rgba(253,181,21,.15)" },
  "Stanford University":                     { accent: "#C41230", accentHi: "#E03050", accentGlow: "rgba(196,18,48,.15)" },
  "UC Davis":                                { accent: "#C5922D", accentHi: "#DBA840", accentGlow: "rgba(197,146,45,.15)" },
  "UC Santa Cruz":                           { accent: "#C8A045", accentHi: "#DFB85C", accentGlow: "rgba(200,160,69,.15)" },
  "Santa Clara University":                  { accent: "#C41230", accentHi: "#E03050", accentGlow: "rgba(196,18,48,.15)" },
  "San Francisco State University":          { accent: "#DDA020", accentHi: "#EDB840", accentGlow: "rgba(221,160,32,.15)" },
  "St. Mary's College of California":        { accent: "#B03A30", accentHi: "#CC5044", accentGlow: "rgba(176,58,48,.15)" },
  "UC Merced":                               { accent: "#D4AA00", accentHi: "#E8C020", accentGlow: "rgba(212,170,0,.15)" },
  "California State University, Fresno":     { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "Sacramento State University":             { accent: "#C3A03C", accentHi: "#D8B855", accentGlow: "rgba(195,160,60,.15)" },
  "California State University, East Bay":   { accent: "#CFB87C", accentHi: "#DEC897", accentGlow: "rgba(207,184,124,.15)" },
  "University of the Pacific":               { accent: "#F47920", accentHi: "#FF9040", accentGlow: "rgba(244,121,32,.15)" },
  "Northeastern University Oakland":         { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },

  // ── SoCal ───────────────────────────────────────────────────────────────────
  "UCLA":                                    { accent: "#FFD100", accentHi: "#FFE050", accentGlow: "rgba(255,209,0,.15)" },
  "University of Southern California":       { accent: "#CC2200", accentHi: "#E84020", accentGlow: "rgba(204,34,0,.15)" },
  "UC San Diego":                            { accent: "#C69214", accentHi: "#DBA830", accentGlow: "rgba(198,146,20,.15)" },
  "UC Riverside":                            { accent: "#D4AA00", accentHi: "#E8C020", accentGlow: "rgba(212,170,0,.15)" },
  "UC Santa Barbara":                        { accent: "#FEBC11", accentHi: "#FFD040", accentGlow: "rgba(254,188,17,.15)" },
  "UC Irvine":                               { accent: "#FFD200", accentHi: "#FFE040", accentGlow: "rgba(255,210,0,.15)" },
  "Cal Poly San Luis Obispo":                { accent: "#C69214", accentHi: "#DBA830", accentGlow: "rgba(198,146,20,.15)" },
  "California State University, Long Beach": { accent: "#C8A830", accentHi: "#DEC050", accentGlow: "rgba(200,168,48,.15)" },
  "California State University, Fullerton":  { accent: "#F6921E", accentHi: "#FFA838", accentGlow: "rgba(246,146,30,.15)" },
  "California State University, Northridge": { accent: "#CC2200", accentHi: "#E84020", accentGlow: "rgba(204,34,0,.15)" },
  "Loyola Marymount University":             { accent: "#960A2C", accentHi: "#B83050", accentGlow: "rgba(150,10,44,.15)" },
  "University of San Diego":                 { accent: "#D4B96A", accentHi: "#E8CC80", accentGlow: "rgba(212,185,106,.15)" },
  "Pepperdine University":                   { accent: "#F36B21", accentHi: "#FF8840", accentGlow: "rgba(243,107,33,.15)" },
  "San Diego State University":              { accent: "#CC0033", accentHi: "#E83050", accentGlow: "rgba(204,0,51,.15)" },

  // ── Pacific Northwest ────────────────────────────────────────────────────────
  "University of Washington":                { accent: "#E8D3A2", accentHi: "#F0E0B8", accentGlow: "rgba(232,211,162,.15)" },
  "Washington State University":             { accent: "#981E32", accentHi: "#B84050", accentGlow: "rgba(152,30,50,.15)" },
  "University of Oregon":                    { accent: "#FEE123", accentHi: "#FFE958", accentGlow: "rgba(254,225,35,.15)" },
  "Oregon State University":                 { accent: "#DC4405", accentHi: "#F06025", accentGlow: "rgba(220,68,5,.15)" },
  "University of Portland":                  { accent: "#7B3FBF", accentHi: "#9355D5", accentGlow: "rgba(123,63,191,.15)" },
  "Gonzaga University":                      { accent: "#CC0033", accentHi: "#E83050", accentGlow: "rgba(204,0,51,.15)" },

  // ── Nevada / Arizona ─────────────────────────────────────────────────────────
  "University of Nevada, Reno":              { accent: "#5B92C9", accentHi: "#7AADDF", accentGlow: "rgba(91,146,201,.15)" },
  "University of Nevada, Las Vegas":         { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "University of Arizona":                   { accent: "#CC0033", accentHi: "#E83050", accentGlow: "rgba(204,0,51,.15)" },
  "Arizona State University":                { accent: "#FFC627", accentHi: "#FFD660", accentGlow: "rgba(255,198,39,.15)" },
  "Northern Arizona University":             { accent: "#FFC72C", accentHi: "#FFD960", accentGlow: "rgba(255,199,44,.15)" },
  "Grand Canyon University":                 { accent: "#9B59B6", accentHi: "#B372CC", accentGlow: "rgba(155,89,182,.15)" },

  // ── Mountain West ────────────────────────────────────────────────────────────
  "University of Utah":                      { accent: "#CC2222", accentHi: "#E84040", accentGlow: "rgba(204,34,34,.15)" },
  "Utah State University":                   { accent: "#A69358", accentHi: "#BDAC74", accentGlow: "rgba(166,147,88,.15)" },
  "Brigham Young University":                { accent: "#4A7FC1", accentHi: "#6497D9", accentGlow: "rgba(74,127,193,.15)" },
  "University of Colorado Boulder":          { accent: "#CFB87C", accentHi: "#DEC897", accentGlow: "rgba(207,184,124,.15)" },
  "Colorado State University":               { accent: "#C8C372", accentHi: "#DAD58A", accentGlow: "rgba(200,195,114,.15)" },
  "University of Denver":                    { accent: "#8B2131", accentHi: "#A84050", accentGlow: "rgba(139,33,49,.15)" },
  "University of New Mexico":                { accent: "#C5392A", accentHi: "#DC5040", accentGlow: "rgba(197,57,42,.15)" },

  // ── Texas ────────────────────────────────────────────────────────────────────
  "University of Texas at Austin":           { accent: "#BF5700", accentHi: "#D97020", accentGlow: "rgba(191,87,0,.15)" },
  "Texas A&M University":                    { accent: "#8A2C2C", accentHi: "#A44040", accentGlow: "rgba(138,44,44,.15)" },
  "University of Houston":                   { accent: "#C8102E", accentHi: "#E03050", accentGlow: "rgba(200,16,46,.15)" },
  "Rice University":                         { accent: "#5B6770", accentHi: "#7A8890", accentGlow: "rgba(91,103,112,.15)" },
  "Texas Christian University":              { accent: "#7B4FA6", accentHi: "#9468BE", accentGlow: "rgba(123,79,166,.15)" },
  "Southern Methodist University":           { accent: "#CC0033", accentHi: "#E83050", accentGlow: "rgba(204,0,51,.15)" },
  "Baylor University":                       { accent: "#FFB81C", accentHi: "#FFCC50", accentGlow: "rgba(255,184,28,.15)" },
  "Texas Tech University":                   { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "University of North Texas":               { accent: "#00853E", accentHi: "#20A058", accentGlow: "rgba(0,133,62,.15)" },

  // ── Florida ──────────────────────────────────────────────────────────────────
  "University of Florida":                   { accent: "#FA4616", accentHi: "#FF6638", accentGlow: "rgba(250,70,22,.15)" },
  "Florida State University":                { accent: "#CEB888", accentHi: "#DDCAA0", accentGlow: "rgba(206,184,136,.15)" },
  "University of Miami":                     { accent: "#F47321", accentHi: "#FF8A40", accentGlow: "rgba(244,115,33,.15)" },
  "University of South Florida":             { accent: "#CFC493", accentHi: "#DDD4AB", accentGlow: "rgba(207,196,147,.15)" },
  "University of Central Florida":           { accent: "#FFC904", accentHi: "#FFD93C", accentGlow: "rgba(255,201,4,.15)" },

  // ── Georgia ──────────────────────────────────────────────────────────────────
  "Georgia Institute of Technology":         { accent: "#B3A369", accentHi: "#C8BB84", accentGlow: "rgba(179,163,105,.15)" },
  "University of Georgia":                   { accent: "#BA0C2F", accentHi: "#D83050", accentGlow: "rgba(186,12,47,.15)" },
  "Emory University":                        { accent: "#0075BE", accentHi: "#2090D8", accentGlow: "rgba(0,117,190,.15)" },
  "Kennesaw State University":               { accent: "#F0BF38", accentHi: "#FFD060", accentGlow: "rgba(240,191,56,.15)" },

  // ── Carolinas ────────────────────────────────────────────────────────────────
  "Duke University":                         { accent: "#1F4F9E", accentHi: "#3A68B8", accentGlow: "rgba(31,79,158,.15)" },
  "University of North Carolina":            { accent: "#4B9CD3", accentHi: "#68B4E8", accentGlow: "rgba(75,156,211,.15)" },
  "NC State University":                     { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "Wake Forest University":                  { accent: "#9E7E38", accentHi: "#B89950", accentGlow: "rgba(158,126,56,.15)" },
  "Clemson University":                      { accent: "#F66733", accentHi: "#FF8050", accentGlow: "rgba(246,103,51,.15)" },
  "University of South Carolina":            { accent: "#990011", accentHi: "#BB2030", accentGlow: "rgba(153,0,17,.15)" },

  // ── Virginia / Tennessee ──────────────────────────────────────────────────────
  "University of Virginia":                  { accent: "#F84C1E", accentHi: "#FF6A3A", accentGlow: "rgba(248,76,30,.15)" },
  "Virginia Tech":                           { accent: "#E5751F", accentHi: "#FF9040", accentGlow: "rgba(229,117,31,.15)" },
  "George Mason University":                 { accent: "#FFCC33", accentHi: "#FFD966", accentGlow: "rgba(255,204,51,.15)" },
  "Vanderbilt University":                   { accent: "#CFAE70", accentHi: "#E0C488", accentGlow: "rgba(207,174,112,.15)" },
  "University of Tennessee":                 { accent: "#FF8200", accentHi: "#FFA030", accentGlow: "rgba(255,130,0,.15)" },
  "University of Kentucky":                  { accent: "#1D5FA8", accentHi: "#3878C4", accentGlow: "rgba(29,95,168,.15)" },
  "University of Louisville":                { accent: "#AD0000", accentHi: "#CC2020", accentGlow: "rgba(173,0,0,.15)" },

  // ── Deep South ───────────────────────────────────────────────────────────────
  "University of Alabama":                   { accent: "#CC2244", accentHi: "#E04060", accentGlow: "rgba(204,34,68,.15)" },
  "Auburn University":                       { accent: "#E87722", accentHi: "#FF9040", accentGlow: "rgba(232,119,34,.15)" },
  "Louisiana State University":              { accent: "#FDD023", accentHi: "#FFE058", accentGlow: "rgba(253,208,35,.15)" },
  "Tulane University":                       { accent: "#41B6E6", accentHi: "#5ECFFF", accentGlow: "rgba(65,182,230,.15)" },
  "University of Mississippi":               { accent: "#CE1126", accentHi: "#E83040", accentGlow: "rgba(206,17,38,.15)" },

  // ── Midwest ──────────────────────────────────────────────────────────────────
  "University of Michigan":                  { accent: "#FFCB05", accentHi: "#FFD940", accentGlow: "rgba(255,203,5,.15)" },
  "Michigan State University":               { accent: "#24A65B", accentHi: "#40BC74", accentGlow: "rgba(36,166,91,.15)" },
  "Ohio State University":                   { accent: "#BB0000", accentHi: "#D82020", accentGlow: "rgba(187,0,0,.15)" },
  "Purdue University":                       { accent: "#CEB888", accentHi: "#DECA9E", accentGlow: "rgba(206,184,136,.15)" },
  "Indiana University":                      { accent: "#990000", accentHi: "#BB2020", accentGlow: "rgba(153,0,0,.15)" },
  "University of Notre Dame":                { accent: "#C99700", accentHi: "#E0B020", accentGlow: "rgba(201,151,0,.15)" },
  "Northwestern University":                 { accent: "#7B3FBF", accentHi: "#9355D5", accentGlow: "rgba(123,63,191,.15)" },
  "University of Illinois Urbana-Champaign": { accent: "#E84A27", accentHi: "#FF6040", accentGlow: "rgba(232,74,39,.15)" },
  "University of Wisconsin-Madison":         { accent: "#C5050C", accentHi: "#DF2030", accentGlow: "rgba(197,5,12,.15)" },
  "University of Minnesota":                 { accent: "#FFB71B", accentHi: "#FFCA50", accentGlow: "rgba(255,183,27,.15)" },
  "Iowa State University":                   { accent: "#F1BE48", accentHi: "#FFCC60", accentGlow: "rgba(241,190,72,.15)" },
  "University of Iowa":                      { accent: "#FFCD00", accentHi: "#FFE040", accentGlow: "rgba(255,205,0,.15)" },
  "University of Kansas":                    { accent: "#0051A5", accentHi: "#2070C0", accentGlow: "rgba(0,81,165,.15)" },
  "Kansas State University":                 { accent: "#7B3FBF", accentHi: "#9355D5", accentGlow: "rgba(123,63,191,.15)" },
  "University of Nebraska-Lincoln":          { accent: "#E41C38", accentHi: "#FF3850", accentGlow: "rgba(228,28,56,.15)" },
  "University of Missouri":                  { accent: "#F1B82D", accentHi: "#FFCC50", accentGlow: "rgba(241,184,45,.15)" },
  "Washington University in St. Louis":      { accent: "#A51417", accentHi: "#C03030", accentGlow: "rgba(165,20,23,.15)" },
  "Saint Louis University":                  { accent: "#FFB81C", accentHi: "#FFCC50", accentGlow: "rgba(255,184,28,.15)" },

  // ── Mid-Atlantic ─────────────────────────────────────────────────────────────
  "University of Maryland":                  { accent: "#FFD520", accentHi: "#FFE050", accentGlow: "rgba(255,213,32,.15)" },
  "Georgetown University":                   { accent: "#4A6FA5", accentHi: "#6388BE", accentGlow: "rgba(74,111,165,.15)" },
  "George Washington University":            { accent: "#EAAA00", accentHi: "#FFB820", accentGlow: "rgba(234,170,0,.15)" },
  "Pennsylvania State University":           { accent: "#315598", accentHi: "#4A6EB8", accentGlow: "rgba(49,85,152,.15)" },
  "Drexel University":                       { accent: "#F2C200", accentHi: "#FFD030", accentGlow: "rgba(242,194,0,.15)" },
  "University of Delaware":                  { accent: "#FFD200", accentHi: "#FFE040", accentGlow: "rgba(255,210,0,.15)" },
  "Rutgers University":                      { accent: "#CC0033", accentHi: "#E83050", accentGlow: "rgba(204,0,51,.15)" },

  // ── Ivy League & Elite NE ─────────────────────────────────────────────────────
  "Harvard University":                      { accent: "#C9485B", accentHi: "#E06070", accentGlow: "rgba(201,72,91,.15)" },
  "Yale University":                         { accent: "#4A90D0", accentHi: "#60A8E8", accentGlow: "rgba(74,144,208,.15)" },
  "Princeton University":                    { accent: "#F58025", accentHi: "#FF9840", accentGlow: "rgba(245,128,37,.15)" },
  "Columbia University":                     { accent: "#4B9CD3", accentHi: "#68B4E8", accentGlow: "rgba(75,156,211,.15)" },
  "Cornell University":                      { accent: "#B31B1B", accentHi: "#CC3030", accentGlow: "rgba(179,27,27,.15)" },
  "Dartmouth College":                       { accent: "#00693E", accentHi: "#20884E", accentGlow: "rgba(0,105,62,.15)" },
  "Brown University":                        { accent: "#A52422", accentHi: "#C04040", accentGlow: "rgba(165,36,34,.15)" },

  // ── New England ──────────────────────────────────────────────────────────────
  "Boston University":                       { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "Boston College":                          { accent: "#D4AF37", accentHi: "#E8C850", accentGlow: "rgba(212,175,55,.15)" },
  "Northeastern University":                 { accent: "#CC0000", accentHi: "#E83030", accentGlow: "rgba(204,0,0,.15)" },
  "University of Connecticut":               { accent: "#2B6CB0", accentHi: "#4488CC", accentGlow: "rgba(43,108,176,.15)" },
  "Syracuse University":                     { accent: "#F76900", accentHi: "#FF8A30", accentGlow: "rgba(247,105,0,.15)" },

  // ── New York ─────────────────────────────────────────────────────────────────
  "New York University":                     { accent: "#9B59B6", accentHi: "#B372CC", accentGlow: "rgba(155,89,182,.15)" },
  "Fordham University":                      { accent: "#7B1113", accentHi: "#9B3030", accentGlow: "rgba(123,17,19,.15)" },
  "University at Buffalo":                   { accent: "#005BBB", accentHi: "#2075D5", accentGlow: "rgba(0,91,187,.15)" },
  "Rochester Institute of Technology":       { accent: "#F76902", accentHi: "#FF8830", accentGlow: "rgba(247,105,2,.15)" },
  "University of Rochester":                 { accent: "#F5AA00", accentHi: "#FFBF30", accentGlow: "rgba(245,170,0,.15)" },
  "Hofstra University":                      { accent: "#C9A227", accentHi: "#DDBA40", accentGlow: "rgba(201,162,39,.15)" },
};

// Curated dark-theme accent palette for unlisted schools
const RANDOM_PALETTES = [
  { accent: "#7B68EE", accentHi: "#9580FF", accentGlow: "rgba(123,104,238,.15)" },
  { accent: "#20B2AA", accentHi: "#3DD6CE", accentGlow: "rgba(32,178,170,.15)" },
  { accent: "#FF7F50", accentHi: "#FF9970", accentGlow: "rgba(255,127,80,.15)" },
  { accent: "#BA55D3", accentHi: "#CF80E6", accentGlow: "rgba(186,85,211,.15)" },
  { accent: "#5BA3D9", accentHi: "#7BBDEE", accentGlow: "rgba(91,163,217,.15)" },
  { accent: "#E67E22", accentHi: "#F0964C", accentGlow: "rgba(230,126,34,.15)" },
  { accent: "#2ECC71", accentHi: "#52D98E", accentGlow: "rgba(46,204,113,.15)" },
  { accent: "#E74C3C", accentHi: "#F06C5E", accentGlow: "rgba(231,76,60,.15)" },
  { accent: "#F1C40F", accentHi: "#F5D14A", accentGlow: "rgba(241,196,15,.15)" },
  { accent: "#1ABC9C", accentHi: "#40D4B8", accentGlow: "rgba(26,188,156,.15)" },
  { accent: "#9B59B6", accentHi: "#B380CC", accentGlow: "rgba(155,89,182,.15)" },
  { accent: "#3498DB", accentHi: "#5BAEE8", accentGlow: "rgba(52,152,219,.15)" },
  { accent: "#E91E63", accentHi: "#F04B80", accentGlow: "rgba(233,30,99,.15)" },
  { accent: "#00BCD4", accentHi: "#26D4E8", accentGlow: "rgba(0,188,212,.15)" },
  { accent: "#FF5722", accentHi: "#FF7547", accentGlow: "rgba(255,87,34,.15)" },
  { accent: "#4CAF50", accentHi: "#6DC56F", accentGlow: "rgba(76,175,80,.15)" },
];

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getSchoolColors(name) {
  if (MAP[name]) return MAP[name];
  return RANDOM_PALETTES[hashName(name) % RANDOM_PALETTES.length];
}

export default MAP;
