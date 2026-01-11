/**
 * Everyday Health Problems Data
 * Comprehensive information for common, non-critical health conditions
 * 
 * MEDICAL DISCLAIMER: This information is for educational purposes only.
 * It is not intended to diagnose, treat, cure, or prevent any disease.
 */

export const diseases = {
  'fungal-infection': {
    id: 'fungal-infection',
    slug: 'fungal-infection',
    name: 'Fungal Infection',
    emoji: '🦠',
    shortDesc: 'Common skin infections caused by fungi that thrive in warm, moist areas.',
    category: 'Skin & Hair',
    searchTerms: ['fungal infection', 'ringworm', 'athlete\'s foot', 'jock itch', 'fungus skin', 'antifungal'],
    
    overview: `Fungal infections are common skin conditions caused by microscopic organisms called fungi. They thrive in warm, moist environments and can affect various parts of the body including the skin, nails, and scalp. While usually not serious, they can be uncomfortable and persistent if not properly managed.`,
    
    causes: [
      'Warm, humid environments that promote fungal growth',
      'Wearing tight, non-breathable clothing or shoes',
      'Sharing personal items like towels or combs',
      'Walking barefoot in public showers or pools',
      'Weakened immune system',
      'Excessive sweating',
      'Poor hygiene practices',
      'Contact with infected animals or soil'
    ],
    
    symptoms: [
      'Red, itchy, scaly patches on the skin',
      'Ring-shaped rashes (ringworm)',
      'Cracking or peeling skin between toes',
      'Discolored or thickened nails',
      'White patches in mouth or throat (thrush)',
      'Burning or stinging sensation',
      'Blisters in affected areas',
      'Hair loss in affected scalp areas'
    ],
    
    homeCare: [
      'Keep the affected area clean and dry',
      'Use over-the-counter antifungal creams, powders, or sprays',
      'Wear loose, breathable cotton clothing',
      'Change socks and underwear daily',
      'Dry feet thoroughly, especially between toes',
      'Use antifungal powder in shoes',
      'Avoid sharing personal items',
      'Wash hands after touching affected areas'
    ],
    
    doNot: [
      'Do NOT scratch the affected area as it can spread infection',
      'Do NOT share towels, clothing, or personal items',
      'Do NOT walk barefoot in public areas',
      'Do NOT wear tight, synthetic clothing over affected areas',
      'Do NOT stop treatment early even if symptoms improve',
      'Do NOT ignore persistent or worsening symptoms'
    ],
    
    whenToSeeDoctor: [
      'Infection doesn\'t improve after 2 weeks of home treatment',
      'Infection spreads to other body parts',
      'Severe pain, swelling, or discharge',
      'Fever accompanies the infection',
      'You have diabetes or a weakened immune system',
      'Nail infection is severe or painful',
      'Scalp infection causes bald patches'
    ],
    
    faqs: [
      {
        question: 'Are fungal infections contagious?',
        answer: 'Yes, many fungal infections can spread through direct contact with infected skin, contaminated surfaces, or shared items. Practice good hygiene and avoid sharing personal items to prevent spread.'
      },
      {
        question: 'How long does it take to cure a fungal infection?',
        answer: 'Mild skin infections may clear in 1-2 weeks with proper treatment. Nail infections can take several months. Complete the full course of treatment even if symptoms improve to prevent recurrence.'
      },
      {
        question: 'Can fungal infections come back?',
        answer: 'Yes, fungal infections can recur, especially if the underlying conditions (moisture, warmth) persist. Preventive measures like keeping areas dry and maintaining good hygiene help reduce recurrence.'
      },
      {
        question: 'Are over-the-counter antifungals effective?',
        answer: 'OTC antifungal creams are often effective for mild skin infections. However, nail or scalp infections, or severe cases, may require prescription-strength medications from a doctor.'
      },
      {
        question: 'Can diet affect fungal infections?',
        answer: 'While not a cure, reducing sugar intake and eating probiotic-rich foods may help support your body\'s natural defenses. However, topical or oral antifungal treatment is usually necessary.'
      }
    ],
    
    relatedConditions: ['skin-rash', 'itching', 'dandruff'],
    relatedBlogs: ['skin-health', 'hygiene-tips']
  },

  'mouth-ulcer': {
    id: 'mouth-ulcer',
    slug: 'mouth-ulcer',
    name: 'Mouth Ulcer',
    emoji: '👄',
    shortDesc: 'Painful sores inside the mouth that usually heal on their own.',
    category: 'Oral Health',
    searchTerms: ['mouth ulcer', 'canker sore', 'mouth sore', 'aphthous ulcer', 'mouth pain'],
    
    overview: `Mouth ulcers (canker sores) are small, painful lesions that develop on the soft tissues inside your mouth or at the base of your gums. While uncomfortable, they are usually harmless and heal on their own within 1-2 weeks. They are not contagious and differ from cold sores which appear on the lips.`,
    
    causes: [
      'Minor mouth injuries (biting cheek, hard brushing)',
      'Stress and lack of sleep',
      'Acidic or spicy foods',
      'Nutritional deficiencies (B12, iron, folate)',
      'Hormonal changes',
      'Food sensitivities',
      'Toothpaste containing sodium lauryl sulfate',
      'Weakened immune system'
    ],
    
    symptoms: [
      'Small, round or oval sores with white/yellow center',
      'Red border around the sore',
      'Pain or burning sensation, especially when eating',
      'Difficulty eating or drinking',
      'Tingling sensation before ulcer appears',
      'Swelling around the ulcer',
      'In severe cases, fever or swollen lymph nodes'
    ],
    
    homeCare: [
      'Rinse with salt water or baking soda solution',
      'Apply over-the-counter mouth ulcer gels or pastes',
      'Avoid spicy, acidic, or rough-textured foods',
      'Use a soft-bristled toothbrush',
      'Apply honey or coconut oil to the ulcer',
      'Stay hydrated with cool water',
      'Take vitamin B12 and iron supplements if deficient',
      'Use alcohol-free mouthwash'
    ],
    
    doNot: [
      'Do NOT eat very hot, spicy, or acidic foods',
      'Do NOT touch or pick at the ulcer',
      'Do NOT use alcohol-based mouthwash',
      'Do NOT brush too hard near the ulcer',
      'Do NOT ignore ulcers lasting more than 3 weeks',
      'Do NOT smoke or use tobacco products'
    ],
    
    whenToSeeDoctor: [
      'Ulcers last longer than 3 weeks',
      'Ulcers are unusually large or spreading',
      'Severe pain not relieved by home treatment',
      'High fever accompanies ulcers',
      'Difficulty swallowing or eating',
      'Frequent recurring ulcers (more than 3-4 times a year)',
      'Ulcers extend to lips or skin'
    ],
    
    faqs: [
      {
        question: 'Are mouth ulcers contagious?',
        answer: 'No, common mouth ulcers (canker sores) are not contagious. They differ from cold sores (caused by herpes virus) which are contagious. Canker sores occur inside the mouth, while cold sores appear on lips.'
      },
      {
        question: 'How long do mouth ulcers take to heal?',
        answer: 'Most mouth ulcers heal within 1-2 weeks without treatment. Minor ulcers heal faster, while larger ones may take up to 6 weeks. If an ulcer lasts more than 3 weeks, consult a doctor.'
      },
      {
        question: 'Can stress cause mouth ulcers?',
        answer: 'Yes, stress is a known trigger for mouth ulcers. Stress can weaken the immune system and trigger inflammation. Managing stress through relaxation techniques may help prevent recurring ulcers.'
      },
      {
        question: 'What foods should I avoid with mouth ulcers?',
        answer: 'Avoid spicy foods, citrus fruits, tomatoes, coffee, chocolate, nuts, and rough-textured foods. These can irritate the ulcer and increase pain. Opt for soft, bland foods until healed.'
      },
      {
        question: 'Do vitamin deficiencies cause mouth ulcers?',
        answer: 'Yes, deficiencies in vitamin B12, iron, folate, and zinc are linked to recurring mouth ulcers. If you get frequent ulcers, consider getting your vitamin levels checked by a doctor.'
      }
    ],
    
    relatedConditions: ['acidity'],
    relatedBlogs: ['oral-health', 'nutrition-tips']
  },

  'piles': {
    id: 'piles',
    slug: 'piles',
    name: 'Piles (Hemorrhoids)',
    emoji: '🩹',
    shortDesc: 'Swollen blood vessels in the rectal area causing discomfort.',
    category: 'Digestive Health',
    searchTerms: ['piles', 'hemorrhoids', 'bawaseer', 'bleeding piles', 'rectal pain'],
    
    overview: `Piles (hemorrhoids) are swollen blood vessels in and around the rectum and anus. They can be internal (inside the rectum) or external (under the skin around the anus). While often uncomfortable and sometimes painful, they are very common and usually treatable with lifestyle changes and home remedies.`,
    
    causes: [
      'Straining during bowel movements',
      'Chronic constipation or diarrhea',
      'Sitting for long periods, especially on toilet',
      'Low-fiber diet',
      'Pregnancy and childbirth',
      'Obesity',
      'Heavy lifting',
      'Aging (weakening of tissues)'
    ],
    
    symptoms: [
      'Bright red blood during or after bowel movements',
      'Itching or irritation around the anus',
      'Pain or discomfort, especially when sitting',
      'Swelling or lump near the anus',
      'Mucus discharge after bowel movement',
      'Feeling of incomplete bowel evacuation',
      'Sensitive or painful lumps around anus'
    ],
    
    homeCare: [
      'Eat high-fiber foods (fruits, vegetables, whole grains)',
      'Drink 8-10 glasses of water daily',
      'Take warm sitz baths for 10-15 minutes',
      'Use over-the-counter hemorrhoid creams or suppositories',
      'Keep the anal area clean and dry',
      'Don\'t strain or sit too long on toilet',
      'Use soft, unscented toilet paper or wet wipes',
      'Apply cold compress to reduce swelling'
    ],
    
    doNot: [
      'Do NOT strain during bowel movements',
      'Do NOT sit on the toilet for extended periods',
      'Do NOT ignore the urge to have a bowel movement',
      'Do NOT lift heavy objects without proper technique',
      'Do NOT use harsh soaps or scented products on the area',
      'Do NOT eat excessive spicy or processed foods'
    ],
    
    whenToSeeDoctor: [
      'Bleeding is heavy or persistent',
      'Pain is severe or not improving',
      'Symptoms don\'t improve after a week of home treatment',
      'You notice changes in bowel habits',
      'Blood appears dark or tarry (not bright red)',
      'You have a family history of colorectal cancer',
      'Hemorrhoid becomes hard or extremely painful (thrombosed)'
    ],
    
    faqs: [
      {
        question: 'Can piles go away on their own?',
        answer: 'Mild piles often improve with dietary changes and home care within a few days to weeks. However, larger or recurring hemorrhoids may need medical treatment. Lifestyle changes help prevent recurrence.'
      },
      {
        question: 'Is bleeding from piles dangerous?',
        answer: 'Small amounts of bright red blood are common with hemorrhoids and usually not dangerous. However, any rectal bleeding should be evaluated by a doctor to rule out other conditions, especially if persistent or dark.'
      },
      {
        question: 'Can I exercise with hemorrhoids?',
        answer: 'Light exercise like walking and swimming can actually help by improving circulation and preventing constipation. Avoid heavy lifting and straining exercises until symptoms improve.'
      },
      {
        question: 'Do spicy foods cause hemorrhoids?',
        answer: 'Spicy foods don\'t directly cause hemorrhoids but can irritate existing ones and cause discomfort during bowel movements. It\'s best to limit spicy foods if you have symptoms.'
      },
      {
        question: 'Are hemorrhoids common during pregnancy?',
        answer: 'Yes, hemorrhoids are very common during pregnancy due to increased pressure on rectal veins, hormonal changes, and constipation. They often improve after delivery with proper care.'
      }
    ],
    
    relatedConditions: ['acidity', 'gas-bloating'],
    relatedBlogs: ['digestive-health', 'fiber-diet']
  },

  'acidity': {
    id: 'acidity',
    slug: 'acidity',
    name: 'Acidity (Acid Reflux)',
    emoji: '🔥',
    shortDesc: 'Burning sensation caused by stomach acid flowing back into the food pipe.',
    category: 'Digestive Health',
    searchTerms: ['acidity', 'acid reflux', 'heartburn', 'GERD', 'stomach burning', 'indigestion'],
    
    overview: `Acidity (acid reflux or heartburn) occurs when stomach acid flows back into the esophagus (food pipe), causing a burning sensation in the chest or throat. It's a common condition that affects millions of people and is usually manageable with lifestyle changes and over-the-counter medications.`,
    
    causes: [
      'Eating large or heavy meals',
      'Lying down immediately after eating',
      'Spicy, fatty, or fried foods',
      'Citrus fruits, tomatoes, and acidic foods',
      'Caffeine, alcohol, and carbonated drinks',
      'Smoking',
      'Obesity',
      'Pregnancy',
      'Certain medications (NSAIDs, aspirin)',
      'Stress and anxiety'
    ],
    
    symptoms: [
      'Burning sensation in chest (heartburn)',
      'Sour or bitter taste in mouth',
      'Difficulty swallowing',
      'Feeling of food stuck in throat',
      'Regurgitation of food or sour liquid',
      'Bloating and belching',
      'Nausea',
      'Chronic cough or hoarseness'
    ],
    
    homeCare: [
      'Eat smaller, more frequent meals',
      'Avoid eating 2-3 hours before bedtime',
      'Elevate head of bed by 6-8 inches',
      'Maintain a healthy weight',
      'Wear loose-fitting clothes',
      'Chew food thoroughly and eat slowly',
      'Take over-the-counter antacids as needed',
      'Drink ginger or chamomile tea',
      'Avoid trigger foods and beverages'
    ],
    
    doNot: [
      'Do NOT lie down immediately after eating',
      'Do NOT eat large, heavy meals',
      'Do NOT smoke or consume excessive alcohol',
      'Do NOT wear tight belts or clothing around waist',
      'Do NOT ignore persistent symptoms',
      'Do NOT take NSAIDs on an empty stomach'
    ],
    
    whenToSeeDoctor: [
      'Symptoms occur more than twice a week',
      'Over-the-counter medications don\'t help',
      'Difficulty or pain when swallowing',
      'Unexplained weight loss',
      'Vomiting blood or black stools',
      'Chest pain (to rule out heart problems)',
      'Symptoms interfere with daily life',
      'Persistent cough or hoarseness'
    ],
    
    faqs: [
      {
        question: 'What\'s the difference between acidity and GERD?',
        answer: 'Occasional acid reflux is common and called heartburn. When it occurs frequently (more than twice a week) and affects quality of life, it may be diagnosed as GERD (Gastroesophageal Reflux Disease), which requires ongoing management.'
      },
      {
        question: 'Can stress cause acidity?',
        answer: 'Yes, stress can increase stomach acid production and worsen acid reflux symptoms. Stress management techniques like deep breathing, meditation, and regular exercise can help reduce symptoms.'
      },
      {
        question: 'Is milk good for acidity?',
        answer: 'While milk may provide temporary relief, it can actually stimulate more acid production later. Cold milk in small amounts may help, but it\'s not a long-term solution. Better options include ginger tea or alkaline water.'
      },
      {
        question: 'Can acidity cause chest pain?',
        answer: 'Yes, acid reflux can cause chest pain that may feel similar to heart pain. However, any chest pain should be evaluated by a doctor to rule out cardiac issues, especially if accompanied by shortness of breath or arm pain.'
      },
      {
        question: 'What foods help reduce acidity?',
        answer: 'Alkaline foods like bananas, melons, oatmeal, ginger, green vegetables, and lean proteins can help. Avoid citrus, tomatoes, chocolate, caffeine, alcohol, and fatty or fried foods.'
      }
    ],
    
    relatedConditions: ['gas-bloating', 'mouth-ulcer'],
    relatedBlogs: ['digestive-health', 'diet-tips']
  },

  'gas-bloating': {
    id: 'gas-bloating',
    slug: 'gas-bloating',
    name: 'Gas & Bloating',
    emoji: '💨',
    shortDesc: 'Uncomfortable feeling of fullness and excess gas in the digestive system.',
    category: 'Digestive Health',
    searchTerms: ['gas', 'bloating', 'flatulence', 'stomach gas', 'abdominal bloating', 'pet dard'],
    
    overview: `Gas and bloating are common digestive issues that cause discomfort, fullness, and abdominal distension. While usually harmless, they can be embarrassing and uncomfortable. Most cases are related to diet and eating habits and can be managed with simple lifestyle modifications.`,
    
    causes: [
      'Swallowing air while eating or drinking',
      'Eating gas-producing foods (beans, cabbage, onions)',
      'Carbonated beverages',
      'Eating too quickly',
      'Food intolerances (lactose, gluten)',
      'Constipation',
      'Artificial sweeteners',
      'High-fiber foods (especially when introduced suddenly)',
      'Stress and anxiety'
    ],
    
    symptoms: [
      'Feeling of fullness or tightness in abdomen',
      'Visible abdominal swelling',
      'Excessive belching',
      'Passing gas frequently',
      'Abdominal cramps or pain',
      'Rumbling sounds in stomach',
      'Discomfort after meals',
      'Feeling of pressure in abdomen'
    ],
    
    homeCare: [
      'Eat slowly and chew food thoroughly',
      'Avoid carbonated drinks and using straws',
      'Walk for 10-15 minutes after meals',
      'Identify and avoid trigger foods',
      'Try peppermint or ginger tea',
      'Use over-the-counter gas relief medications',
      'Practice stress-reduction techniques',
      'Limit artificial sweeteners',
      'Introduce high-fiber foods gradually'
    ],
    
    doNot: [
      'Do NOT eat too quickly or while stressed',
      'Do NOT chew gum excessively',
      'Do NOT drink through straws',
      'Do NOT wear tight waistbands',
      'Do NOT lie down immediately after eating',
      'Do NOT ignore chronic symptoms'
    ],
    
    whenToSeeDoctor: [
      'Severe or persistent abdominal pain',
      'Blood in stool',
      'Unexplained weight loss',
      'Chronic diarrhea or constipation',
      'Symptoms interfere with daily activities',
      'Nausea or vomiting',
      'Heartburn not relieved by antacids',
      'Symptoms worsen over time'
    ],
    
    faqs: [
      {
        question: 'Is passing gas normal?',
        answer: 'Yes, passing gas 13-21 times per day is normal. Gas is produced when bacteria in the colon break down undigested food. However, excessive gas or changes in patterns may warrant attention.'
      },
      {
        question: 'Can bloating be a sign of something serious?',
        answer: 'While usually harmless, persistent bloating with other symptoms like weight loss, blood in stool, or severe pain should be evaluated by a doctor to rule out conditions like IBS, celiac disease, or other issues.'
      },
      {
        question: 'Does drinking water help with bloating?',
        answer: 'Yes, staying hydrated helps digestion and can reduce bloating caused by constipation. However, drinking large amounts during meals may contribute to bloating. Sip water throughout the day instead.'
      },
      {
        question: 'Why do I feel bloated after eating bread?',
        answer: 'Bloating after bread could indicate gluten sensitivity, wheat intolerance, or simply be from the carbohydrates and fiber. If it happens consistently, try eliminating wheat and see if symptoms improve.'
      },
      {
        question: 'Can probiotics help with gas and bloating?',
        answer: 'Probiotics can help restore healthy gut bacteria and may reduce gas and bloating for some people. Results vary by individual. Choose probiotics with diverse strains and give them a few weeks to work.'
      }
    ],
    
    relatedConditions: ['acidity', 'piles'],
    relatedBlogs: ['digestive-health', 'gut-health']
  },

  'skin-rash': {
    id: 'skin-rash',
    slug: 'skin-rash',
    name: 'Skin Rash',
    emoji: '🔴',
    shortDesc: 'Red, irritated, or bumpy skin that can result from various causes.',
    category: 'Skin & Hair',
    searchTerms: ['skin rash', 'red skin', 'skin irritation', 'rashes', 'allergic rash', 'heat rash'],
    
    overview: `A skin rash is a change in skin color, texture, or appearance. Rashes can be caused by allergies, infections, heat, immune disorders, or irritants. Most rashes are harmless and treatable at home, but some may require medical attention.`,
    
    causes: [
      'Allergic reactions (food, medication, plants)',
      'Contact with irritants (soaps, detergents, chemicals)',
      'Infections (bacterial, viral, fungal)',
      'Heat and excessive sweating (heat rash)',
      'Insect bites or stings',
      'Eczema or dermatitis',
      'Stress',
      'Certain medications',
      'Autoimmune conditions'
    ],
    
    symptoms: [
      'Redness or discoloration of skin',
      'Itching or burning sensation',
      'Bumps, blisters, or welts',
      'Dry, cracked, or scaly skin',
      'Swelling in affected area',
      'Warmth over the rash',
      'Pain or tenderness',
      'Oozing or crusting'
    ],
    
    homeCare: [
      'Identify and avoid the trigger if known',
      'Apply cold compress to reduce itching',
      'Use over-the-counter hydrocortisone cream',
      'Take antihistamines for allergic rashes',
      'Keep skin moisturized with fragrance-free lotion',
      'Wear loose, cotton clothing',
      'Avoid scratching to prevent infection',
      'Use mild, fragrance-free soaps',
      'Apply calamine lotion for itch relief'
    ],
    
    doNot: [
      'Do NOT scratch the rash',
      'Do NOT use harsh soaps or hot water',
      'Do NOT apply unknown home remedies',
      'Do NOT wear tight or synthetic clothing',
      'Do NOT ignore rashes that spread rapidly',
      'Do NOT share towels or personal items if infection suspected'
    ],
    
    whenToSeeDoctor: [
      'Rash covers large area or spreads quickly',
      'Accompanied by fever or joint pain',
      'Signs of infection (pus, increasing pain, warmth)',
      'Rash doesn\'t improve within a week',
      'Difficulty breathing or facial swelling (allergic emergency)',
      'Rash appears after starting new medication',
      'Blisters in mouth, eyes, or genitals'
    ],
    
    faqs: [
      {
        question: 'How do I know if my rash is an allergy?',
        answer: 'Allergic rashes often appear suddenly after exposure to a trigger, cause itching, and may have hives (raised welts). If you can identify a pattern of exposure and reaction, it\'s likely allergic. Patch testing by a doctor can confirm.'
      },
      {
        question: 'When is a skin rash an emergency?',
        answer: 'Seek immediate help if rash is accompanied by difficulty breathing, facial/throat swelling, high fever, purple spots that don\'t fade when pressed, or rapidly spreading rash with feeling unwell. These could indicate serious conditions.'
      },
      {
        question: 'Can stress cause skin rashes?',
        answer: 'Yes, stress can trigger or worsen various skin conditions including eczema, hives, and psoriasis. Stress affects the immune system and can make skin more reactive. Managing stress can help improve skin health.'
      },
      {
        question: 'How long do rashes typically last?',
        answer: 'Duration varies by cause. Contact rashes may clear in days once the irritant is removed. Viral rashes last 1-2 weeks. Chronic conditions like eczema may have recurring flares. Seek help if a rash persists beyond 2 weeks.'
      },
      {
        question: 'Can I use steroid cream on any rash?',
        answer: 'Over-the-counter hydrocortisone is safe for most inflammatory rashes but shouldn\'t be used on infected rashes, fungal infections, or facial skin for extended periods. If unsure of the cause, consult a healthcare provider.'
      }
    ],
    
    relatedConditions: ['fungal-infection', 'itching'],
    relatedBlogs: ['skin-health', 'allergy-tips']
  },

  'fever': {
    id: 'fever',
    slug: 'fever',
    name: 'Fever',
    emoji: '🤒',
    shortDesc: 'Elevated body temperature usually indicating the body is fighting an infection.',
    category: 'General Health',
    searchTerms: ['fever', 'high temperature', 'bukhar', 'body temperature', 'viral fever'],
    
    overview: `Fever is a temporary increase in body temperature, usually above 100.4°F (38°C). It's typically a sign that your body is fighting an infection. While uncomfortable, fever itself is usually not dangerous in adults and is actually a helpful immune response.`,
    
    causes: [
      'Viral infections (cold, flu, COVID-19)',
      'Bacterial infections',
      'Heat exhaustion',
      'Certain medications',
      'Vaccinations',
      'Inflammatory conditions',
      'Some cancers (rare)',
      'Autoimmune disorders'
    ],
    
    symptoms: [
      'Body temperature above 100.4°F (38°C)',
      'Chills and shivering',
      'Sweating',
      'Headache',
      'Muscle aches',
      'Weakness and fatigue',
      'Loss of appetite',
      'Dehydration',
      'General discomfort'
    ],
    
    homeCare: [
      'Rest and get plenty of sleep',
      'Stay well hydrated (water, clear broths, electrolyte drinks)',
      'Take over-the-counter fever reducers (acetaminophen, ibuprofen)',
      'Wear light, comfortable clothing',
      'Keep room at comfortable temperature',
      'Use lukewarm (not cold) compresses',
      'Monitor temperature regularly',
      'Eat light, easy-to-digest foods'
    ],
    
    doNot: [
      'Do NOT use alcohol rubs to reduce fever',
      'Do NOT bundle up if you have chills',
      'Do NOT take cold baths (can cause shivering and raise temperature)',
      'Do NOT ignore high fever (above 103°F/39.4°C)',
      'Do NOT give aspirin to children',
      'Do NOT delay seeking help for warning signs'
    ],
    
    whenToSeeDoctor: [
      'Fever above 103°F (39.4°C) in adults',
      'Fever lasting more than 3 days',
      'Severe headache or stiff neck',
      'Difficulty breathing',
      'Chest pain',
      'Confusion or unusual behavior',
      'Persistent vomiting',
      'Rash with fever',
      'Fever after recent travel to tropical areas'
    ],
    
    faqs: [
      {
        question: 'Should I always try to reduce a fever?',
        answer: 'Not necessarily. Low-grade fevers help fight infection. Treatment is mainly for comfort. However, high fevers (above 102°F/38.9°C) or fevers causing significant discomfort should be treated with appropriate medications.'
      },
      {
        question: 'What\'s considered a dangerous fever?',
        answer: 'In adults, temperatures above 103°F (39.4°C) require attention, and above 105°F (40.5°C) is a medical emergency. In children, thresholds are lower. Always consider accompanying symptoms, not just the number.'
      },
      {
        question: 'How accurate are forehead thermometers?',
        answer: 'Forehead (temporal) thermometers are convenient but may be less accurate than oral or rectal readings. They\'re good for quick screening. For accuracy, follow manufacturer instructions and consider confirming with another method.'
      },
      {
        question: 'Can I exercise with a fever?',
        answer: 'No, rest is important when you have a fever. Exercise increases body temperature and can worsen your condition. Wait until your temperature has been normal for at least 24 hours before resuming physical activity.'
      },
      {
        question: 'Why do fevers often get worse at night?',
        answer: 'Body temperature naturally rises in the evening due to circadian rhythms. This is why fevers often feel worse at night. Continue hydration and medication as needed, and monitor for concerning symptoms.'
      }
    ],
    
    relatedConditions: ['cold-cough'],
    relatedBlogs: ['immune-health', 'home-remedies']
  },

  'cold-cough': {
    id: 'cold-cough',
    slug: 'cold-cough',
    name: 'Cold & Cough',
    emoji: '🤧',
    shortDesc: 'Common viral infections affecting the upper respiratory system.',
    category: 'Respiratory Health',
    searchTerms: ['cold', 'cough', 'common cold', 'sore throat', 'runny nose', 'sardi khansi'],
    
    overview: `The common cold is a viral infection of the upper respiratory tract. While annoying, it's usually harmless and resolves on its own within 7-10 days. Hundreds of different viruses can cause colds, which is why we get them repeatedly throughout life.`,
    
    causes: [
      'Rhinoviruses (most common)',
      'Coronavirus (not COVID-19)',
      'Respiratory syncytial virus (RSV)',
      'Parainfluenza viruses',
      'Close contact with infected persons',
      'Touching contaminated surfaces',
      'Weakened immune system',
      'Exposure to cold weather (doesn\'t cause cold but may weaken immunity)'
    ],
    
    symptoms: [
      'Runny or stuffy nose',
      'Sore or scratchy throat',
      'Coughing',
      'Sneezing',
      'Mild body aches',
      'Low-grade fever',
      'Mild headache',
      'Watery eyes',
      'Fatigue'
    ],
    
    homeCare: [
      'Rest and get adequate sleep',
      'Stay well hydrated (warm water, herbal tea, broths)',
      'Gargle with warm salt water for sore throat',
      'Use saline nasal drops or spray',
      'Try honey for cough (not for children under 1)',
      'Use a humidifier to add moisture to air',
      'Take over-the-counter cold medications as needed',
      'Inhale steam to relieve congestion',
      'Drink warm fluids with ginger and turmeric'
    ],
    
    doNot: [
      'Do NOT take antibiotics (they don\'t work on viruses)',
      'Do NOT give cold medicine to young children without doctor advice',
      'Do NOT share utensils or towels',
      'Do NOT touch your face with unwashed hands',
      'Do NOT suppress a productive cough completely',
      'Do NOT smoke or expose yourself to secondhand smoke'
    ],
    
    whenToSeeDoctor: [
      'Symptoms last more than 10 days',
      'Fever above 101.3°F (38.5°C) lasting more than 3 days',
      'Severe sore throat',
      'Difficulty breathing or shortness of breath',
      'Persistent chest pain or pressure',
      'Confusion or severe headache',
      'Symptoms improve then worsen suddenly',
      'Chronic health conditions (diabetes, heart disease)'
    ],
    
    faqs: [
      {
        question: 'How long is a cold contagious?',
        answer: 'You\'re most contagious during the first 2-3 days of symptoms and remain contagious for about a week. Wash hands frequently and avoid close contact with others during this time.'
      },
      {
        question: 'Should I take antibiotics for a cold?',
        answer: 'No, antibiotics don\'t work against viruses and won\'t help with a cold. They should only be taken for bacterial infections. Taking antibiotics unnecessarily contributes to antibiotic resistance.'
      },
      {
        question: 'Does vitamin C prevent colds?',
        answer: 'Regular vitamin C intake may slightly reduce cold duration and severity but doesn\'t prevent colds. Taking large doses after symptoms start has minimal benefit. A balanced diet is more effective than supplements.'
      },
      {
        question: 'Why do I get colds so often?',
        answer: 'Adults average 2-3 colds per year. Frequent colds may be due to exposure (children, workplace), stress, poor sleep, or nutritional deficiencies. If you get more than 4-5 colds yearly, consult a doctor.'
      },
      {
        question: 'When does a cold become bronchitis or pneumonia?',
        answer: 'If cold symptoms worsen after 7-10 days, you develop a high fever, have difficulty breathing, or have a persistent productive cough with colored mucus, the infection may have spread. See a doctor for evaluation.'
      }
    ],
    
    relatedConditions: ['fever'],
    relatedBlogs: ['respiratory-health', 'immune-boosting']
  },

  'dandruff': {
    id: 'dandruff',
    slug: 'dandruff',
    name: 'Dandruff',
    emoji: '❄️',
    shortDesc: 'Flaky scalp condition causing white or yellowish scales in hair.',
    category: 'Skin & Hair',
    searchTerms: ['dandruff', 'flaky scalp', 'itchy scalp', 'scalp treatment', 'rusi'],
    
    overview: `Dandruff is a common scalp condition causing flaky skin and itching. It's not contagious or serious but can be embarrassing and persistent. While the exact cause isn't fully understood, it's related to a yeast-like fungus, dry skin, and sensitivity to hair products.`,
    
    causes: [
      'Malassezia fungus (naturally occurring on scalp)',
      'Dry skin',
      'Sensitivity to hair care products',
      'Seborrheic dermatitis (oily, irritated skin)',
      'Not shampooing enough',
      'Stress',
      'Certain skin conditions (eczema, psoriasis)',
      'Diet lacking zinc, B vitamins, or healthy fats'
    ],
    
    symptoms: [
      'White or yellowish flakes on scalp and hair',
      'Flakes on shoulders, eyebrows, beard',
      'Itchy scalp',
      'Red, greasy patches covered with scales',
      'Dry scalp',
      'Tightness or tingling on scalp',
      'Worsening in dry or cold weather'
    ],
    
    homeCare: [
      'Use anti-dandruff shampoo (with zinc pyrithione, ketoconazole, or selenium sulfide)',
      'Shampoo regularly (daily if needed initially)',
      'Leave anti-dandruff shampoo on scalp for 5 minutes before rinsing',
      'Massage scalp gently while washing',
      'Try tea tree oil mixed with regular shampoo',
      'Apply coconut or olive oil before washing',
      'Reduce stress through relaxation techniques',
      'Maintain a balanced diet',
      'Get some sun exposure (helps reduce Malassezia)'
    ],
    
    doNot: [
      'Do NOT scratch your scalp aggressively',
      'Do NOT use hair products that irritate your scalp',
      'Do NOT wash hair with very hot water',
      'Do NOT overuse styling products',
      'Do NOT share combs or brushes',
      'Do NOT ignore persistent or severe dandruff'
    ],
    
    whenToSeeDoctor: [
      'Over-the-counter treatments don\'t help after several weeks',
      'Scalp is very red, swollen, or painful',
      'Signs of infection (oozing, crusting)',
      'Dandruff spreads to face or body',
      'Hair loss accompanies dandruff',
      'Severe itching affecting sleep or daily life',
      'Symptoms worsen despite treatment'
    ],
    
    faqs: [
      {
        question: 'Is dandruff caused by poor hygiene?',
        answer: 'No, dandruff isn\'t caused by being dirty. It\'s related to scalp sensitivity, fungal overgrowth, and skin cell turnover. However, not washing hair regularly can make flakes more visible.'
      },
      {
        question: 'Can dandruff cause hair loss?',
        answer: 'Dandruff itself doesn\'t cause hair loss, but severe scratching can damage hair follicles. Conditions like seborrheic dermatitis, if untreated, may contribute to temporary hair thinning. Proper treatment prevents this.'
      },
      {
        question: 'Should I use anti-dandruff shampoo daily?',
        answer: 'Initially, daily use may help control dandruff. Once improved, reduce to 2-3 times weekly for maintenance. Alternate between anti-dandruff and regular shampoo to prevent resistance.'
      },
      {
        question: 'Does diet affect dandruff?',
        answer: 'Yes, diets high in sugar and saturated fats may worsen dandruff. Include foods rich in zinc (nuts, seeds), omega-3 fatty acids (fish, flaxseed), and B vitamins. Stay hydrated.'
      },
      {
        question: 'Is dandruff worse in winter?',
        answer: 'Yes, cold, dry air and indoor heating can dry out the scalp and worsen dandruff. Use a humidifier, stay hydrated, and adjust your hair care routine in winter months.'
      }
    ],
    
    relatedConditions: ['itching', 'skin-rash'],
    relatedBlogs: ['hair-care', 'scalp-health']
  },

  'itching': {
    id: 'itching',
    slug: 'itching',
    name: 'Itching (Pruritus)',
    emoji: '🖐️',
    shortDesc: 'Irritating skin sensation that creates an urge to scratch.',
    category: 'Skin & Hair',
    searchTerms: ['itching', 'itchy skin', 'pruritus', 'skin itching', 'khujli'],
    
    overview: `Itching (pruritus) is an uncomfortable skin sensation that makes you want to scratch. It can range from mild to severe and may be localized or all over the body. While often caused by dry skin or minor irritants, persistent itching can indicate underlying conditions.`,
    
    causes: [
      'Dry skin (xerosis)',
      'Allergic reactions',
      'Insect bites',
      'Skin conditions (eczema, psoriasis, hives)',
      'Fungal or parasitic infections',
      'Internal diseases (liver, kidney, thyroid)',
      'Nerve disorders',
      'Medications',
      'Pregnancy',
      'Stress and anxiety'
    ],
    
    symptoms: [
      'Strong urge to scratch',
      'Redness or rash',
      'Bumps or blisters',
      'Dry, cracked skin',
      'Leathery or scaly patches from scratching',
      'Sleep disturbance due to itching',
      'Anxiety from persistent itch'
    ],
    
    homeCare: [
      'Keep skin moisturized with fragrance-free lotion',
      'Take lukewarm (not hot) showers',
      'Use gentle, fragrance-free soaps',
      'Apply cold compress or ice pack',
      'Take over-the-counter antihistamines',
      'Use anti-itch creams (hydrocortisone, calamine)',
      'Wear soft, loose cotton clothing',
      'Keep nails short to minimize scratch damage',
      'Use a humidifier if air is dry',
      'Try oatmeal baths for widespread itching'
    ],
    
    doNot: [
      'Do NOT scratch (it worsens itching and can cause infection)',
      'Do NOT use hot water for bathing',
      'Do NOT use harsh soaps or fragranced products',
      'Do NOT wear wool or synthetic fabrics directly on skin',
      'Do NOT ignore chronic or severe itching',
      'Do NOT overuse steroid creams without medical advice'
    ],
    
    whenToSeeDoctor: [
      'Itching lasts more than 2 weeks',
      'Itching is severe and affects sleep',
      'Itching is all over the body with no visible rash',
      'Accompanied by other symptoms (jaundice, weight loss, fatigue)',
      'Signs of infection (swelling, warmth, discharge)',
      'Home treatments don\'t provide relief',
      'Itching started after new medication'
    ],
    
    faqs: [
      {
        question: 'Why does itching get worse at night?',
        answer: 'Skin temperature rises at night and there are fewer distractions, making you more aware of itching. Body\'s anti-inflammatory hormones also drop at night. Using moisturizer before bed and keeping the room cool can help.'
      },
      {
        question: 'Can itching be a sign of something serious?',
        answer: 'While usually harmless, persistent whole-body itching without rash can indicate liver disease, kidney problems, thyroid issues, or rarely, certain cancers. If unexplained itching persists, see a doctor.'
      },
      {
        question: 'Why does scratching feel good but make itching worse?',
        answer: 'Scratching temporarily overrides itch signals with pain signals. However, it damages skin, releases more histamines, and creates an itch-scratch cycle. Try patting or applying cold instead.'
      },
      {
        question: 'Can anxiety cause itching?',
        answer: 'Yes, stress and anxiety can trigger or worsen itching. Stress causes the release of chemicals that can make skin more sensitive. Managing stress through relaxation techniques can reduce this type of itching.'
      },
      {
        question: 'Is winter itch a real thing?',
        answer: 'Yes, winter itch is caused by dry, cold air and indoor heating that strips moisture from skin. Combat it with regular moisturizing, humidifiers, lukewarm showers, and drinking plenty of water.'
      }
    ],
    
    relatedConditions: ['skin-rash', 'fungal-infection', 'dandruff'],
    relatedBlogs: ['skin-care', 'dry-skin']
  }
};

// Get all diseases as array
export const getAllDiseases = () => Object.values(diseases);

// Get disease by slug
export const getDiseaseBySlug = (slug) => diseases[slug];

// Get diseases by category
export const getDiseasesByCategory = (category) => 
  Object.values(diseases).filter(d => d.category === category);

// Get all categories
export const getDiseaseCategories = () => 
  [...new Set(Object.values(diseases).map(d => d.category))];

// Get related diseases
export const getRelatedDiseases = (slug) => {
  const disease = diseases[slug];
  if (!disease) return [];
  return disease.relatedConditions
    .map(relSlug => diseases[relSlug])
    .filter(Boolean);
};

