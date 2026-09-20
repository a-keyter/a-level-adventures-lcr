export type Subject = {
  name: string;
  group: string;
  /** Short, pre-written summary of what studying this A level involves. */
  learn: string;
  /** Historic and present connection between the subject and the Liverpool City Region. */
  lcr: string;
};

/**
 * A curated list of A levels commonly offered across Liverpool City Region
 * colleges and sixth forms.
 */
export const SUBJECTS: Subject[] = [
  {
    name: "Mathematics",
    group: "Maths & Computing",
    learn:
      "Algebra, calculus, trigonometry, mechanics and statistics — and, more than anything, how to model a messy real-world situation as something you can actually solve.",
    lcr:
      "Liverpool's docks ran on mathematics long before computers: tide tables, cargo tonnage, insurance and marine risk were all worked out by hand here, and the city's Victorian insurance houses were early homes of actuarial maths. Today the same skills sit behind the region's finance, logistics and data roles.",
  },
  {
    name: "Further Mathematics",
    group: "Maths & Computing",
    learn:
      "A second helping of maths: complex numbers, matrices, differential equations and deeper mechanics or statistics, taken alongside A level Mathematics.",
    lcr:
      "The region's engineering heritage — from Cammell Laird's shipbuilding on the Mersey to modern advanced manufacturing at Halewood and Speke — has always needed people comfortable with maths well beyond the basics.",
  },
  {
    name: "Statistics",
    group: "Maths & Computing",
    learn:
      "How to collect, summarise and test data honestly: sampling, probability, distributions, correlation and the difference between a real pattern and a fluke.",
    lcr:
      "Liverpool has a long public-health data tradition, from William Duncan — Britain's first Medical Officer of Health, appointed here in 1847 — counting deaths street by street, to today's work at the Liverpool School of Tropical Medicine and the region's health data partnerships.",
  },
  {
    name: "Computer Science",
    group: "Maths & Computing",
    learn:
      "Programming, algorithms, data structures, how computers actually work underneath, plus databases, networks and the ethics of building software.",
    lcr:
      "The Baltic Triangle grew from empty warehouses into one of the North West's densest clusters of digital and games studios, and Liverpool's Sensor City and AI work continue that story. Digital and AI skills are the cross-cutting priority in the region's skills plan.",
  },

  {
    name: "Biology",
    group: "Sciences",
    learn:
      "Cells, genetics, ecosystems, the human body and disease — plus a lot of practical work and careful experimental design.",
    lcr:
      "Liverpool founded the world's first School of Tropical Medicine in 1898, and the city region is now a major life-sciences cluster around the Knowledge Quarter, vaccine research and NHS trusts.",
  },
  {
    name: "Chemistry",
    group: "Sciences",
    learn:
      "Atomic structure, bonding, reactions, organic and physical chemistry, and the lab technique to test ideas safely and accurately.",
    lcr:
      "The chemical industry along the Mersey — soap, glass at St Helens, and the huge works at Runcorn and Widnes that gave Britain much of its early chemicals trade — was built on this subject, and it now underpins clean-energy and materials work in the region.",
  },
  {
    name: "Physics",
    group: "Sciences",
    learn:
      "Forces, energy, waves, electricity, fields, particles and quantum ideas — and how to reason from measurement to conclusion.",
    lcr:
      "The Liverpool–Manchester Railway, Mersey tunnels and dock engineering were physics in practice, and today the University of Liverpool's particle physics group works on experiments at CERN.",
  },
  {
    name: "Applied Science",
    group: "Sciences",
    learn:
      "Science aimed at the workplace: laboratory techniques, scientific investigation, health and safety, and how science is used in industry.",
    lcr:
      "The region's manufacturing, pharmaceutical and NHS laboratories have always needed skilled technicians as much as researchers — one of the biggest skills gaps identified locally.",
  },
  {
    name: "Environmental Science",
    group: "Sciences",
    learn:
      "Ecosystems, pollution, climate change, energy and sustainability, and how environmental data is gathered and argued over.",
    lcr:
      "The Mersey went from one of Europe's most polluted rivers to a celebrated recovery story, and the region now hosts major offshore wind, tidal and net-zero ambitions.",
  },
  {
    name: "Psychology",
    group: "Sciences",
    learn:
      "Memory, development, social influence, mental health and research methods — a science subject that leans heavily on statistics and study design.",
    lcr:
      "Liverpool's community mental health services, and research into the effects of poverty and deprivation on wellbeing across Merseyside, have shaped national thinking on health inequality.",
  },

  {
    name: "Engineering",
    group: "Technical & Applied",
    learn:
      "Design, materials, mechanical and electrical principles, manufacturing processes and working to a real brief.",
    lcr:
      "Shipbuilding at Cammell Laird, car making at Halewood and the vast dock machinery of the Mersey made engineering the region's signature trade, and advanced manufacturing remains one of its growth priorities.",
  },
  {
    name: "Design & Technology (Product Design)",
    group: "Technical & Applied",
    learn:
      "Designing and prototyping products: user needs, materials, sustainability, CAD and iterative making.",
    lcr:
      "From ship fittings to modern design studios in the Baltic Triangle, the region has a long habit of making things, and product design sits between its manufacturing and creative sectors.",
  },
  {
    name: "Health & Social Care",
    group: "Technical & Applied",
    learn:
      "How care services work, human development across a lifetime, safeguarding, communication and the values behind good care.",
    lcr:
      "Health and care is one of the city region's largest employers, and Liverpool's public-health pioneers — district nursing began here in 1859 — set patterns still followed nationally.",
  },
  {
    name: "Construction & the Built Environment",
    group: "Technical & Applied",
    learn:
      "How buildings are designed, costed and built: structures, materials, surveying, regulations and sustainable construction.",
    lcr:
      "Liverpool built the world's first enclosed commercial wet dock in 1715 and Britain's first council housing, and construction is now a priority sector as the region retrofits homes and regenerates its waterfront.",
  },

  {
    name: "Business Studies",
    group: "Business & Economics",
    learn:
      "Marketing, finance, operations, people management and strategy — how an organisation decides what to do and whether it worked.",
    lcr:
      "Liverpool's merchant houses, shipping lines and the Liverpool Chamber of Commerce (founded 1774, one of the oldest in the world) made the city a centre of commercial practice; professional and business services remain a leading local sector.",
  },
  {
    name: "Economics",
    group: "Business & Economics",
    learn:
      "Markets, prices, competition, unemployment, inflation, trade and the arguments about what governments should do.",
    lcr:
      "As Britain's Atlantic port, Liverpool was a global trading hub — including in the transatlantic slave trade, a history the city now confronts openly — and questions of trade, inequality and regeneration remain live here.",
  },
  {
    name: "Accounting",
    group: "Business & Economics",
    learn:
      "Recording and interpreting financial information: accounts, budgeting, cash flow and what the numbers say about a business.",
    lcr:
      "The city's shipping and insurance trade created an early professional accounting community, and finance and professional services still employ tens of thousands across the city region.",
  },
  {
    name: "Law",
    group: "Business & Economics",
    learn:
      "How the legal system works, contract, tort and criminal law, and how to build an argument from evidence and precedent.",
    lcr:
      "Maritime and insurance law grew up around the port, and Liverpool's civil and criminal courts, legal quarter and community law centres continue that tradition.",
  },

  {
    name: "Geography",
    group: "Humanities & Social Sciences",
    learn:
      "Physical processes like rivers, coasts and climate alongside human geography — cities, migration, development — plus fieldwork and mapping.",
    lcr:
      "Few places make better geography: the Mersey estuary, port-led growth, post-industrial decline and regeneration are textbook case studies, and Liverpool's migration history shaped the whole region.",
  },
  {
    name: "History",
    group: "Humanities & Social Sciences",
    learn:
      "How to read sources critically, weigh interpretations and write a sustained, evidenced argument about the past.",
    lcr:
      "Liverpool's history is world history: transatlantic trade and slavery, mass Irish migration, wartime bombing and the Battle of the Atlantic, and the docks' rise and fall — much of it documented in the city's archives and museums.",
  },
  {
    name: "Politics",
    group: "Humanities & Social Sciences",
    learn:
      "Parliament, elections, parties, pressure groups, political ideas and how power is actually exercised.",
    lcr:
      "Merseyside has been a political proving ground — from municipal reform and the 1911 transport strike to devolution and today's Combined Authority and elected mayors.",
  },
  {
    name: "Sociology",
    group: "Humanities & Social Sciences",
    learn:
      "Families, education, crime, inequality and the media, and how sociologists gather and challenge evidence about society.",
    lcr:
      "Studies of class, community and deprivation on Merseyside have long informed national debate, and the region's regeneration raises fresh questions about who benefits.",
  },
  {
    name: "Philosophy",
    group: "Humanities & Social Sciences",
    learn:
      "Arguments about knowledge, ethics, religion and mind — and the discipline of making your own reasoning watertight.",
    lcr:
      "Liverpool's civic and religious institutions, and its long tradition of public debate and free lectures for working people, gave the city an unusually strong culture of argument.",
  },
  {
    name: "Religious Studies",
    group: "Humanities & Social Sciences",
    learn:
      "Religious beliefs and practice, ethical theory and philosophy of religion, taught through texts and debate.",
    lcr:
      "Liverpool holds Britain's oldest Chinese community and one of its oldest mosques, two landmark cathedrals at either end of Hope Street, and a well-known record of interfaith cooperation.",
  },
  {
    name: "Criminology",
    group: "Humanities & Social Sciences",
    learn:
      "Types of crime, why crime is reported or hidden, how the justice system responds, and how campaigns change the law.",
    lcr:
      "Merseyside has been at the centre of major debates on policing, justice and community safety, including the long Hillsborough campaign, which changed how inquests and public bodies operate.",
  },

  {
    name: "English Language",
    group: "English & Languages",
    learn:
      "How language works and changes: grammar, accent and dialect, how children acquire speech, and how power shows up in words.",
    lcr:
      "Scouse is one of the most studied accents in Britain, shaped by Irish, Welsh and Lancashire speech — a living case study in language contact and identity.",
  },
  {
    name: "English Literature",
    group: "English & Languages",
    learn:
      "Close reading of poetry, prose and drama across periods, and writing comparative, evidenced critical essays.",
    lcr:
      "Liverpool is a UNESCO City of Literature, home of the Liverpool Poets of the 1960s and a strong tradition of working-class writing and playwriting.",
  },
  {
    name: "English Language & Literature",
    group: "English & Languages",
    learn:
      "A combined course: literary analysis alongside linguistic study, plus your own creative and analytical writing.",
    lcr:
      "The region's writers, from Willy Russell to contemporary spoken-word artists, constantly mix voice, dialect and literary form.",
  },
  {
    name: "French",
    group: "English & Languages",
    learn:
      "Speaking, listening, reading and writing to a high level, plus film, literature and the society of French-speaking countries.",
    lcr:
      "Liverpool's port traded constantly with France and it remains twinned with Marseille — a reminder that the city's outlook was always continental.",
  },
  {
    name: "Spanish",
    group: "English & Languages",
    learn:
      "Fluency in Spanish across all four skills, with study of Hispanic culture, history and current affairs.",
    lcr:
      "Trade with Spain and Latin America ran through the Mersey for centuries, and the region's tourism, logistics and higher education links keep those ties alive.",
  },
  {
    name: "German",
    group: "English & Languages",
    learn:
      "German language to an advanced level, alongside German-speaking culture, politics and history.",
    lcr:
      "Liverpool's Victorian German merchant community left its mark on the city's commerce and music, and modern engineering and manufacturing links continue it — Liverpool is twinned with Cologne.",
  },
  {
    name: "Chinese (Mandarin)",
    group: "English & Languages",
    learn:
      "Mandarin speaking, listening, characters and writing, plus contemporary Chinese society and culture.",
    lcr:
      "Liverpool is home to Europe's oldest Chinese community, dating from the 1860s Blue Funnel shipping line, and has a long-standing partnership with Shanghai.",
  },

  {
    name: "Art & Design (Fine Art)",
    group: "Creative & Performing",
    learn:
      "Developing your own visual practice — drawing, painting, sculpture or mixed media — with research, experimentation and a personal project.",
    lcr:
      "Liverpool has the largest collection of national museums and galleries outside London, the Walker, Tate Liverpool and the Liverpool Biennial, Britain's biggest contemporary art festival.",
  },
  {
    name: "Graphic Communication",
    group: "Creative & Performing",
    learn:
      "Typography, branding, layout and illustration, working to briefs and presenting design thinking.",
    lcr:
      "From shipping-line posters and Cunard advertising to today's studios in the Baltic Triangle, design has long been part of how the city sells itself.",
  },
  {
    name: "Photography",
    group: "Creative & Performing",
    learn:
      "Camera technique, lighting, editing and the critical study of images — building a body of work around an idea.",
    lcr:
      "Documentary photography of the docks, the Blitz and 1980s Merseyside shaped how Britain pictured industrial change, and Open Eye Gallery keeps that tradition going.",
  },
  {
    name: "Textile Design",
    group: "Creative & Performing",
    learn:
      "Fabric, print, stitch and construction, from material experiments to a finished collection.",
    lcr:
      "Cotton from the Mersey fed Lancashire's mills, making the region central to Britain's textile trade, and sustainable fashion is now a growing local scene.",
  },
  {
    name: "Film Studies",
    group: "Creative & Performing",
    learn:
      "How films make meaning — form, genre, ideology and industry — plus your own short production work.",
    lcr:
      "Liverpool is the UK's most filmed city outside London, with its own long-established film office standing in for everywhere from New York to Moscow.",
  },
  {
    name: "Media Studies",
    group: "Creative & Performing",
    learn:
      "Analysing media industries, audiences and representation, and producing your own media to a brief.",
    lcr:
      "The region has strong broadcast and production roots, and questions of how Liverpool is represented in the national press are part of the city's own story.",
  },
  {
    name: "Music",
    group: "Creative & Performing",
    learn:
      "Performing, composing and analysing music across classical, popular and world traditions.",
    lcr:
      "Liverpool is a UNESCO City of Music, birthplace of The Beatles and Merseybeat, and home to the Royal Liverpool Philharmonic, one of Britain's oldest orchestras.",
  },
  {
    name: "Music Technology",
    group: "Creative & Performing",
    learn:
      "Recording, mixing, sequencing and sound design, with the technical theory of audio behind it.",
    lcr:
      "The region's studios, venues and festivals — from Parr Street's history to today's independent scene — make it an unusually practical place to learn production.",
  },
  {
    name: "Drama & Theatre",
    group: "Creative & Performing",
    learn:
      "Acting, devising, directing and design, alongside the study of playwrights and theatre practitioners.",
    lcr:
      "The Everyman and Playhouse are among the most influential theatres in Britain, with a strong tradition of new writing rooted in local life.",
  },
  {
    name: "Dance",
    group: "Creative & Performing",
    learn:
      "Technique, choreography and performance, plus critical study of dance works and their context.",
    lcr:
      "Liverpool's dance scene runs from community groups to companies working nationally, supported by venues and the region's festival culture.",
  },

  {
    name: "Physical Education",
    group: "Sport & Wellbeing",
    learn:
      "Anatomy, physiology, biomechanics, sport psychology and the social side of sport, alongside your own performance.",
    lcr:
      "Merseyside is one of the most football-obsessed places on earth, and Liverpool hosts the Grand National at Aintree and the Open at Royal Birkdale — sport is a real local industry.",
  },
  {
    name: "Sport & Exercise Science",
    group: "Sport & Wellbeing",
    learn:
      "The science of training and performance: physiology, nutrition, testing and data analysis.",
    lcr:
      "Liverpool John Moores University's sport science department is internationally known and works with elite clubs and athletes across the region.",
  },
  {
    name: "Food Science & Nutrition",
    group: "Sport & Wellbeing",
    learn:
      "Nutrition, food safety, the science of cooking and how diet affects health across a lifetime.",
    lcr:
      "Liverpool's food history runs from ships' provisioning to a thriving independent food scene, while local work on food poverty and healthy eating remains urgent.",
  },
];

export const SUBJECT_NAMES = SUBJECTS.map((subject) => subject.name);

export const SUBJECT_GROUPS = Array.from(new Set(SUBJECTS.map((s) => s.group)));

export function comboKey(subjects: string[]): string {
  return [...subjects]
    .map((s) => s.trim().toLowerCase())
    .sort()
    .join("|");
}
