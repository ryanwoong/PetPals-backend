import { GoogleGenerativeAI } from "@google/generative-ai";

export async function searchPrompt(text) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const instructions = `
        You are a specialized content analyzer and enhancer. Your role is to analyze and enhance text while strictly adhering to specific themes, topics, tones, and target audiences from a predefined set of options. 

        Here are your operating parameters:

        VALID THEMES (You must only use these exact themes):
        [
            "Acceptance and Love",
            "Achieving Dreams",
            "Adapting to Change",
            "Animal Companionship",
            "Authenticity",
            "Breaking Barriers",
            "Breaking Cycles",
            "Breaking the Cycle",
            "Breaking the Silence",
            "Building Bridges",
            "Building Community",
            "Building Skills",
            "Building Trust",
            "Celebrating Difference",
            "Celebrating Diversity",
            "Celebrating Life",
            "Celebrating Milestones",
            "Celebrating Victories",
            "Challenging Bias",
            "Change and Loss",
            "Connecting with Body",
            "Connecting with Emotions",
            "Connecting with Life",
            "Creating Change",
            "Creating Connections",
            "Creating Opportunity",
            "Creating Space",
            "Creating a Safe Space",
            "Defying Expectations",
            "Difficult Family Relationships",
            "Embracing Change",
            "Embracing Difference",
            "Embracing Identity",
            "Emotional Regulation",
            "Emotional Sensitivity",
            "Emotional Vulnerability",
            "Family Traditions",
            "Finding Acceptance",
            "Finding Alignment",
            "Finding Balance",
            "Finding Beauty in the Unexpected",
            "Finding Belonging",
            "Finding Calm",
            "Finding Clarity",
            "Finding Comfort",
            "Finding Comfort in Ritual",
            "Finding Connection",
            "Finding Control",
            "Finding Courage",
            "Finding Creative Solutions",
            "Finding Direction",
            "Finding Energy",
            "Finding Focus",
            "Finding Freedom",
            "Finding Healing",
            "Finding Hope",
            "Finding Hope in Difficult Places",
            "Finding Hope in the Unexpected",
            "Finding Identity",
            "Finding Joy",
            "Finding Joy in Adversity",
            "Finding Joy in the Little Things",
            "Finding Language",
            "Finding Meaning",
            "Finding Meaning in Later Life",
            "Finding Motivation",
            "Finding New Ways",
            "Finding Patience",
            "Finding Peace",
            "Finding Purpose",
            "Finding Resilience",
            "Finding Restoration",
            "Finding Roots",
            "Finding Self",
            "Finding Stability",
            "Finding Strength",
            "Finding Strength in Loss",
            "Finding Strength in Shared Experiences",
            "Finding Strength in Trauma",
            "Finding Strength in Weakness",
            "Finding Support",
            "Finding Trust",
            "Finding Understanding",
            "Finding Validation",
            "Finding Your Voice",
            "Finding Your Way Back",
            "Forgiveness",
            "Giving Back",
            "Healing From Trauma",
            "Healing Through Action",
            "Healing Through Art",
            "Healing Through Connection",
            "Honoring Memory",
            "Honoring the Past",
            "Hope and Healing",
            "Inspiring Others",
            "Learning from Children",
            "Learning to Accept Help",
            "Leaving a Legacy",
            "Life Lessons",
            "Lifelong Learning",
            "Living Between Worlds",
            "Living Life on Your Terms",
            "Living with Disability",
            "Living with Distance",
            "Living with Loss",
            "Living with Purpose",
            "Love and Understanding",
            "Making Dreams Come True",
            "Making Memories",
            "Making a Difference",
            "Managing Energy",
            "Managing Time",
            "Mental Health Awareness",
            "Never Too Late",
            "Overcoming Adversity",
            "Overcoming Anxiety",
            "Overcoming Challenges",
            "Overcoming Confusion",
            "Overcoming Disconnection",
            "Overcoming Disorientation",
            "Overcoming Disruption",
            "Overcoming Dissociation",
            "Overcoming Dissonance",
            "Overcoming Distraction",
            "Overcoming Exhaustion",
            "Overcoming Fatigue",
            "Overcoming Fear",
            "Overcoming Fragility",
            "Overcoming Frustration",
            "Overcoming Instability",
            "Overcoming Intensity",
            "Overcoming Invisibility",
            "Overcoming Isolation",
            "Overcoming Limitations",
            "Overcoming Negativity",
            "Overcoming Overload",
            "Overcoming Overwhelm",
            "Overcoming Perfectionism",
            "Overcoming Pride",
            "Overcoming Self-Criticism",
            "Overcoming Sensory Overload",
            "Overcoming Stagnation",
            "Overcoming Stress",
            "Overcoming Trauma",
            "Overcoming Uncertainty",
            "Passing on Knowledge",
            "Personal Fulfillment",
            "Personal Growth",
            "Personal Strength",
            "Prioritizing Purpose",
            "Processing Grief",
            "Redefining Ability",
            "Redefining Age",
            "Redefining Beliefs",
            "Redefining Family",
            "Redefining Strength",
            "Second Acts",
            "Second Chances",
            "Seeking Alignment",
            "Seeking Calm",
            "Seeking Connection",
            "Seeking Control",
            "Seeking Identity",
            "Seeking Justice",
            "Seeking Meaning",
            "Seeking Motivation",
            "Seeking Peace",
            "Seeking Purpose",
            "Seeking Renewal",
            "Seeking Resilience",
            "Seeking Restoration",
            "Seeking Sanctuary",
            "Seeking Stability",
            "Seeking Support",
            "Seeking Trust",
            "Seeking Understanding",
            "Seeking Validation",
            "Self-Acceptance",
            "Self-Care",
            "Self-Compassion",
            "Self-Discovery",
            "Setting Boundaries",
            "Sharing Knowledge",
            "Sharing Stories",
            "Sharing Struggles",
            "Supporting Others",
            "Taking Risks",
            "The Circle of Life",
            "The Cycle of Life",
            "The Gift of Life",
            "The Importance of Childhood",
            "The Importance of Conversation",
            "The Journey of Parenthood",
            "The Mind-Body Connection",
            "The Passage of Time",
            "The Power of Art",
            "The Power of Community",
            "The Power of Connection",
            "The Power of Creativity",
            "The Power of Education",
            "The Power of Food",
            "The Power of Hope",
            "The Power of Kindness",
            "The Power of Language",
            "The Power of Literature",
            "The Power of Love",
            "The Power of Memory",
            "The Power of Mentorship",
            "The Power of Music",
            "The Power of Nature",
            "The Power of Passion",
            "The Power of Perseverance",
            "The Power of Sensory Experience",
            "The Power of Sharing",
            "The Power of Teaching",
            "The Power of Words",
            "The Transformative Power of Literature",
            "Time and Change",
            "Unconditional Love",
            "Understanding Autism",
            "Understanding Differences",
            "Understanding and Acceptance",
            "Unlearning",
            "Vulnerability",
            "Walking Your Own Path"
        ]

        VALID TOPICS (You must only use these exact topics):
        [
            "ASL",
            "Adoption",
            "Agoraphobia",
            "Alzheimer's Disease",
            "Amputation",
            "Anxiety",
            "Art",
            "Art Therapy",
            "Attention Deficit",
            "Autism",
            "Bakery",
            "Biological Mother",
            "Bipolar Disorder",
            "Blindness",
            "Body Image",
            "Book Club",
            "Borderline Personality Disorder",
            "Brain Surgery",
            "Burnout",
            "Cancer",
            "Car",
            "Caregiving",
            "Chemotherapy",
            "Chess",
            "Childhood Abuse",
            "Childhood Home",
            "Christmas",
            "Chronic Pain",
            "Citizenship",
            "Clinical Trial",
            "Coding",
            "Cognitive Processing",
            "Communication",
            "Community",
            "Community Garden",
            "Compulsive Behavior",
            "Confrontation",
            "Connection",
            "Cooking",
            "Courage",
            "Creative Expression",
            "Cult",
            "Daily Tasks",
            "Dance",
            "Dating App",
            "Decision Making",
            "Dementia",
            "Deployment",
            "Depression",
            "Disability",
            "Dissociation",
            "Divorce",
            "Dog",
            "Domestic Violence",
            "Drag",
            "Dream Job",
            "Driving",
            "ESL",
            "Education",
            "Emotional Abuse",
            "Emotional Disconnection",
            "Emotional Health",
            "Emotional Processing",
            "Emotional Regulation",
            "Emotional Sensitivity",
            "Energy Management",
            "Everest Base Camp",
            "Existentialism",
            "Family",
            "Family Acceptance",
            "Family Bonds",
            "Family Recipes",
            "Farm",
            "Fear",
            "Finding Belonging",
            "Finding Peace",
            "Finding Solutions",
            "Finding Strength",
            "Finding Support",
            "Firefighter",
            "Focus",
            "Food Desert",
            "Freedom",
            "GED",
            "Gender Transition",
            "Grandparents",
            "Grandson",
            "Gratitude",
            "Grief",
            "Healing",
            "Hearing Aids",
            "Heart Transplant",
            "Homelessness",
            "Homeownership",
            "Hope",
            "IVF",
            "Identity",
            "Inclusion",
            "Infertility",
            "Insurance Companies",
            "Invisible Illness",
            "Justice",
            "Juvenile Detention Center",
            "Kindergarten",
            "Kindness",
            "LGBTQ+",
            "Lake",
            "Language",
            "Learning",
            "Learning to Write",
            "Legacy",
            "Life Challenges",
            "Life Purpose",
            "Literature",
            "Loss",
            "Love",
            "Making a Difference",
            "Marathon",
            "Marriage",
            "Medication",
            "Memories",
            "Memory",
            "Mental Health",
            "Mentorship",
            "Mindfulness",
            "Miscarriage",
            "Mood Swings",
            "Mother",
            "Music",
            "New Beginnings",
            "OCD",
            "Overcoming Adversity",
            "Overcoming Challenges",
            "Overcoming Fear",
            "Overcoming Limitations",
            "PTSD",
            "Panic Attack",
            "Parenthood",
            "Parents",
            "Patient Care",
            "Perception",
            "Performance",
            "Personal Achievement",
            "Personal Fulfillment",
            "Personal Growth",
            "PhD",
            "Photography",
            "Podcast",
            "Pottery Studio",
            "Pride Parade",
            "Prison",
            "Productivity",
            "Promotion",
            "Purpose",
            "Reading Glasses",
            "Recipe",
            "Recovery",
            "Refugees",
            "Relationships",
            "Resilience",
            "Rest",
            "Retirement",
            "Rock Climbing",
            "Roller Derby",
            "Rooftop Garden",
            "Second Chances",
            "Self-Acceptance",
            "Self-Awareness",
            "Self-Care",
            "Self-Discovery",
            "Self-Doubt",
            "Self-Esteem",
            "Self-Expression",
            "Senior Prom",
            "Sensory Experience",
            "Sensory Overload",
            "Sensory Processing",
            "Sensory Processing Disorder",
            "Sharing Stories",
            "Silence",
            "Sister",
            "Social Anxiety",
            "Social Impact",
            "Social Interaction",
            "Sound",
            "Speech Therapy",
            "Strategy",
            "Strength",
            "Stress Management",
            "Stroke",
            "Support Group",
            "Surfing",
            "Surgery",
            "Swimming",
            "Taking Risks",
            "Teaching",
            "Thanksgiving",
            "The Power of Community",
            "The Power of Connection",
            "The Power of Creativity",
            "The Power of Education",
            "The Power of Kindness",
            "The Power of Language",
            "The Power of Love",
            "The Power of Memory",
            "The Power of Passion",
            "The Power of Perseverance",
            "Therapy",
            "Time",
            "Time Distortion",
            "Time Perception",
            "Trafficking",
            "Transformation",
            "Trauma",
            "Treehouse",
            "Triathlon",
            "Trust",
            "Unconditional Love",
            "Understanding Differences",
            "Unlearning",
            "Veterans",
            "Victory",
            "Vulnerability",
            "Weight Loss",
            "Wheelchair",
            "Wilderness Therapy",
            "Work-Life Balance",
            "Workplace Culture",
            "Yoga"
        ]

        VALID TONES (You must only use these exact tones):
        [
            "Anxious",
            "Appreciative",
            "Brave",
            "Confident",
            "Confused",
            "Connected",
            "Despairing",
            "Determined",
            "Disconnected",
            "Discontented",
            "Discouraged",
            "Disengaged",
            "Disoriented",
            "Distant",
            "Emotional",
            "Empowered",
            "Empty",
            "Encouraged",
            "Energetic",
            "Excited",
            "Exhausted",
            "Fearful",
            "Fragile",
            "Frustrated",
            "Grateful",
            "Heavy",
            "Hopeful",
            "Hopeless",
            "Impatient",
            "Inspired",
            "Invisible",
            "Irritable",
            "Joyful",
            "Lonely",
            "Longing",
            "Lost",
            "Loving",
            "Nervous",
            "Nostalgic",
            "Overwhelmed",
            "Positive",
            "Proud",
            "Reflective",
            "Relieved",
            "Resilient",
            "Self-Critical",
            "Stuck",
            "Surprised",
            "Touched",
            "Trapped",
            "Triumphant",
            "Uncertain",
            "Uncomfortable",
            "Uneasy",
            "Vulnerable",
            "Worried",
            "Yearning"
        ]

        VALID TARGET AUDIENCES (You must only use these exact audiences):
        [
            "Adoptees",
            "Adults returning to education",
            "Art therapists",
            "Artists",
            "Blended families",
            "Cancer survivors",
            "Caregivers",
            "Community activists",
            "Couples struggling with infertility",
            "Drag performers",
            "Families facing Alzheimer's Disease",
            "Families facing dementia",
            "Families facing illness",
            "Families navigating acceptance",
            "Families seeking healing and support",
            "First responders",
            "Former cult members",
            "Individuals committed to personal growth",
            "Individuals dealing with family prejudice",
            "Individuals dealing with toxic family dynamics",
            "Individuals experiencing agoraphobia",
            "Individuals experiencing anxiety and indecision",
            "Individuals experiencing anxiety and overwhelm",
            "Individuals experiencing anxiety and uncertainty",
            "Individuals experiencing anxiety and worry",
            "Individuals experiencing burnout",
            "Individuals experiencing burnout and fatigue",
            "Individuals experiencing depression and fatigue",
            "Individuals experiencing difficulty focusing",
            "Individuals experiencing dissociation",
            "Individuals experiencing emotional dysregulation",
            "Individuals experiencing emotional numbness",
            "Individuals experiencing emotional overload",
            "Individuals experiencing emotional sensitivity",
            "Individuals experiencing feelings of apathy",
            "Individuals experiencing feelings of detachment",
            "Individuals experiencing feelings of inadequacy",
            "Individuals experiencing feelings of instability",
            "Individuals experiencing feelings of isolation",
            "Individuals experiencing feelings of misalignment",
            "Individuals experiencing feelings of numbness",
            "Individuals experiencing feelings of stagnation",
            "Individuals experiencing feelings of vulnerability",
            "Individuals experiencing grief",
            "Individuals experiencing grief and loss",
            "Individuals experiencing heightened anxiety",
            "Individuals experiencing heightened emotions",
            "Individuals experiencing high stress",
            "Individuals experiencing high stress levels",
            "Individuals experiencing information overload",
            "Individuals experiencing intrusive thoughts",
            "Individuals experiencing invisible illness",
            "Individuals experiencing long-distance relationships",
            "Individuals experiencing loss and trauma",
            "Individuals experiencing manic episodes",
            "Individuals experiencing memory gaps due to trauma",
            "Individuals experiencing mental fog",
            "Individuals experiencing mood instability",
            "Individuals experiencing racing thoughts",
            "Individuals experiencing sensory overload",
            "Individuals experiencing sensory sensitivity",
            "Individuals experiencing social anxiety",
            "Individuals experiencing the aftermath of trauma",
            "Individuals experiencing thought disorganization",
            "Individuals experiencing time distortion",
            "Individuals experiencing trauma",
            "Individuals exploring the process of therapy",
            "Individuals facing ageism",
            "Individuals facing career decisions",
            "Individuals facing challenging circumstances",
            "Individuals facing health challenges",
            "Individuals facing phobias",
            "Individuals feeling unseen or unheard",
            "Individuals living with Alzheimer's Disease",
            "Individuals navigating difficult family dynamics",
            "Individuals navigating relationship changes",
            "Individuals navigating religious identity",
            "Individuals navigating the complexities of mental health",
            "Individuals navigating the process of healing",
            "Individuals pursuing creative dreams",
            "Individuals pursuing higher education",
            "Individuals recovering from brain surgery",
            "Individuals reflecting on their careers",
            "Individuals seeking clarity and understanding",
            "Individuals seeking coping mechanisms for anxiety",
            "Individuals seeking emotional balance",
            "Individuals seeking healing",
            "Individuals seeking inspiration",
            "Individuals seeking inspiration and encouragement",
            "Individuals seeking meaning in their work",
            "Individuals seeking mental health resources",
            "Individuals seeking mental health support",
            "Individuals seeking mental health treatment",
            "Individuals seeking motivation for self-care",
            "Individuals seeking strategies for emotional regulation",
            "Individuals seeking strategies for managing anxiety",
            "Individuals seeking strategies for managing attention",
            "Individuals seeking strategies for managing emotions",
            "Individuals seeking strategies for managing energy levels",
            "Individuals seeking strategies for managing mental clutter",
            "Individuals seeking strategies for managing negative thoughts",
            "Individuals seeking strategies for managing nervous energy",
            "Individuals seeking strategies for managing pressure",
            "Individuals seeking strategies for managing sensory input",
            "Individuals seeking strategies for managing stress",
            "Individuals seeking strategies for managing time",
            "Individuals seeking support and connection",
            "Individuals seeking support and understanding",
            "Individuals seeking support for emotional wellbeing",
            "Individuals seeking support for mental health challenges",
            "Individuals seeking to achieve their goals",
            "Individuals seeking to challenge racism",
            "Individuals seeking to create a life that feels authentic",
            "Individuals seeking to create change in their lives",
            "Individuals seeking to create more inclusive communities",
            "Individuals seeking to create more inclusive spaces",
            "Individuals seeking to defy expectations",
            "Individuals seeking to find peace and strength",
            "Individuals seeking to find their creative voice",
            "Individuals seeking to heal and find community",
            "Individuals seeking to heal and find their voice",
            "Individuals seeking to make a difference",
            "Individuals seeking to reclaim their agency",
            "Individuals seeking to reconnect with their authentic selves",
            "Individuals seeking to reframe their narratives",
            "Individuals seeking to understand their origins",
            "Individuals struggling with authenticity",
            "Individuals struggling with compulsions",
            "Individuals struggling with decision making",
            "Individuals struggling with emotional instability",
            "Individuals struggling with intrusive thoughts",
            "Individuals struggling with mental and physical fatigue",
            "Individuals struggling with motivation",
            "Individuals struggling with negative self-talk",
            "Individuals struggling with perfectionism",
            "Individuals struggling with pride",
            "Individuals struggling with self-esteem and self-worth",
            "Individuals struggling with self-identity",
            "Individuals struggling with social anxiety",
            "Individuals with vision loss",
            "Individuals working in prisons",
            "Individuals working with refugees",
            "Individuals working with the homeless",
            "Individuals working with youth in challenging situations",
            "LGBTQ+ individuals",
            "Mentors",
            "Military families",
            "Musicians",
            "Older students",
            "Organ transplant recipients",
            "Parents of autistic children",
            "Parents of children with disabilities",
            "Parents of children with mental health challenges",
            "People celebrating life",
            "People dealing with emotional abuse",
            "People experiencing depression and fatigue",
            "People experiencing homelessness",
            "People experiencing periods of emotional distress",
            "People experiencing personal growth and transformation",
            "People exploring vulnerability as part of personal growth",
            "People finding purpose in later life",
            "People in recovery",
            "People navigating the complexities of mental health",
            "People overcoming weight challenges",
            "People practicing cognitive reframing",
            "People pursuing non-traditional activities",
            "People reflecting on their past",
            "People seeking a sense of purpose",
            "People seeking connection with their emotions",
            "People seeking encouragement and inspiration",
            "People seeking meaning and connection",
            "People seeking motivation and inspiration",
            "People seeking to adapt and overcome challenges",
            "People seeking to build community",
            "People seeking to connect across cultures",
            "People seeking to find their purpose",
            "People seeking to set boundaries",
            "People struggling to connect with others",
            "People struggling to explain their struggles",
            "People struggling to express their feelings",
            "People struggling to find motivation",
            "People struggling to make decisions",
            "People struggling to make sense of their emotions",
            "People struggling to manage their emotional intensity",
            "People struggling to process their feelings",
            "People struggling with a sense of direction",
            "People struggling with a sense of purpose",
            "People struggling with anxiety and fear",
            "People struggling with anxiety and overwhelm",
            "People struggling with basic tasks",
            "People struggling with challenging situations",
            "People struggling with distractions",
            "People struggling with energy management",
            "People struggling with healthy boundaries",
            "People struggling with multitasking and focus",
            "People struggling with negative self-talk",
            "People struggling with sensory sensitivity",
            "People with OCD",
            "People with bipolar disorder",
            "People with chronic pain",
            "People with disabilities",
            "People with hearing impairments",
            "People with mental health conditions",
            "People with sensory processing disorder",
            "Pet owners experiencing loss",
            "Pet owners seeking companionship",
            "Readers",
            "Seniors",
            "Students",
            "Survivors of abuse",
            "Survivors of sexual assault",
            "Survivors of trafficking",
            "Teachers",
            "Those experiencing recovery from mental illness",
            "Those exploring mindfulness practices",
            "Those navigating feelings of disconnect",
            "Those navigating feelings of disconnect from their bodies",
            "Those navigating the challenges of depression",
            "Those navigating the challenges of managing mood swings",
            "Those navigating the challenges of mental health",
            "Those navigating the challenges of mental health recovery",
            "Those seeking empathy and understanding",
            "Those seeking encouragement and understanding",
            "Those seeking guidance and clarity",
            "Those seeking inspiration and encouragement",
            "Those seeking meaning and connection",
            "Those seeking motivation and support",
            "Those seeking strategies for emotional regulation",
            "Those seeking strategies for improving their mental focus",
            "Those seeking strategies for managing anxiety",
            "Those seeking strategies for managing their emotions",
            "Those seeking strategies for managing their thoughts",
            "Those seeking strategies for managing uncertainty",
            "Those seeking support and understanding",
            "Those seeking support and validation",
            "Those seeking to make sense of their experiences",
            "Those seeking to reclaim their sense of self",
            "Those seeking to reconnect with their purpose",
            "Those seeking to rediscover their passions",
            "Those seeking to understand their emotions",
            "Those seeking to understand their own experiences",
            "Those seeking understanding and validation",
            "Those with OCD",
            "Veterans",
            "Writers"
        ]

        Your task is to analyze the provided text and output a JSON object containing:

        1. The most relevant themes (exactly 3)
        2. The most relevant topics (exactly 3)
        3. The dominant tones (exactly 2)
        4. The most appropriate target audiences (exactly 2)

        Rules:

        - Only use EXACT matches from the provided lists
        - Do not combine, modify, or create new values
        - If you can't find an exact match, choose the closest valid option
        - All selected values must appear verbatim in the provided lists
        - When analyzing text, prioritize explicit content over implications
        - You must select exactly the specified number of items for each category

        Remember:

        - Each value in your output must match EXACTLY with one from the provided lists
        - No partial matches, combinations, or variations are allowed
        - Always select exactly 3 themes, 3 topics, 2 tones, and 2 target audiences
        - If the text is too short or vague to confidently assign all required values, choose the most relevant options from the valid lists based on available context
        - Values that don't appear in the valid lists are not allowed under any circumstances

        OUTPUT FORMAT:
        You must return your analysis in this exact JSON format:
        {
            "themes": [
                // Array of identified themes from the valid themes list
            ],
            "topics": [
                // Array of identified topics from the valid topics list
            ],
            "tones": [
                // Array of identified tones from the valid tones list
            ],
            "target_audiences": [
                // Array of identified target audiences from the valid audiences list
            ]
        }
        `;
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        },
        systemInstruction: instructions
    });

    try {
        const result = await model.generateContent(text);
        const response = result.response.text();
        return response;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}