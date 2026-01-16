import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

/**
 * Seed Data for Health Scan Platform
 * 
 * This seed data demonstrates the Vinmec-style multilingual SEO structure:
 * - Hindi intent keywords for ranking English content in Hindi searches
 * - Hinglish keywords for transliterated searches
 * - Bilingual FAQs for rich results
 * - Symptoms for medical search matching
 */

const users = [
  {
    name: 'Admin User',
    email: 'admin@healthai.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Health Scan Platform Administrator'
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah@healthai.com',
    password: 'doctor123',
    role: 'admin',
    bio: 'Health Content Writer & Wellness Expert'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    bio: 'Health enthusiast'
  }
];

const blogs = [
  // ==========================================================
  // BLOG 1: Burning Sensation After Stool (Vinmec-style SEO demo)
  // ==========================================================
  {
    title: 'Burning Sensation in Anus After Stool: Causes, Remedies & When to See a Doctor',
    slug: 'burning-sensation-in-anus-after-stool',
    content: `
      <h2>What Causes Burning Sensation After Passing Stool?</h2>
      <p>Experiencing a burning sensation in the anus after bowel movements is a common but uncomfortable problem. This symptom can be caused by various factors, from dietary choices to underlying medical conditions. Understanding the causes can help you find relief and know when to seek medical attention.</p>
      
      <h2>Common Causes of Anal Burning</h2>
      
      <h3>1. Hemorrhoids (Piles)</h3>
      <p>Hemorrhoids are swollen blood vessels in and around the rectum. They can cause burning, itching, and pain, especially after passing stool. Both internal and external hemorrhoids can lead to this discomfort.</p>
      
      <h3>2. Anal Fissures</h3>
      <p>Small tears in the anal lining can cause intense burning and pain during and after bowel movements. These are often caused by passing hard stools or chronic diarrhea.</p>
      
      <h3>3. Spicy Foods</h3>
      <p>Consuming spicy foods can irritate the digestive tract and cause burning sensations when passing stool. Capsaicin, the compound that makes peppers hot, can cause this effect.</p>
      
      <h3>4. Poor Hygiene or Over-Cleaning</h3>
      <p>Both inadequate cleaning and excessive wiping can irritate the sensitive anal area, leading to burning and discomfort.</p>
      
      <h3>5. Fungal or Bacterial Infections</h3>
      <p>Infections in the anal region can cause burning, itching, and discharge. These require proper medical treatment.</p>
      
      <h2>Home Remedies for Relief</h2>
      <ul>
        <li><strong>Sitz Baths:</strong> Soak in warm water for 15-20 minutes to soothe the area</li>
        <li><strong>Fiber-Rich Diet:</strong> Prevent constipation with fruits, vegetables, and whole grains</li>
        <li><strong>Stay Hydrated:</strong> Drink 8-10 glasses of water daily</li>
        <li><strong>Avoid Spicy Foods:</strong> Temporarily eliminate irritating foods</li>
        <li><strong>Gentle Cleaning:</strong> Use unscented wipes or water instead of harsh toilet paper</li>
        <li><strong>Coconut Oil:</strong> Apply natural coconut oil for soothing relief</li>
      </ul>
      
      <h2>What NOT to Do</h2>
      <ul>
        <li>Don't strain during bowel movements</li>
        <li>Don't sit on the toilet for extended periods</li>
        <li>Avoid using harsh soaps or perfumed products</li>
        <li>Don't ignore persistent symptoms</li>
      </ul>
      
      <h2>When to See a Doctor</h2>
      <p>Seek medical attention if you experience:</p>
      <ul>
        <li>Bleeding from the rectum</li>
        <li>Symptoms lasting more than a week</li>
        <li>Severe pain that doesn't improve</li>
        <li>Fever or signs of infection</li>
        <li>Unexplained weight loss</li>
      </ul>
      
      <p><strong>Remember:</strong> This information is for educational purposes only and should not replace professional medical advice. If you have persistent symptoms, consult a healthcare provider for proper diagnosis and treatment.</p>
    `,
    category: 'Diseases',
    medicalCategory: 'Digestive Health',
    tags: ['hemorrhoids', 'piles', 'anal burning', 'digestive health', 'home remedies'],
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    
    // CRITICAL: Hindi Intent Keywords for SEO
    intentKeywords: {
      en: ['burning sensation anus', 'anal pain after stool', 'hemorrhoids symptoms', 'piles treatment', 'rectal burning'],
      hi: ['गुदा में जलन', 'लैट्रिन के बाद जलन', 'मलद्वार में जलन', 'बवासीर के लक्षण', 'पाइल्स का इलाज', 'टॉयलेट के बाद दर्द', 'गुदा दर्द'],
      hinglish: ['guda mein jalan', 'latrine ke baad jalan', 'piles ke lakshan', 'bawasir ka ilaj', 'anal pain kaise thik kare']
    },
    
    // Symptoms for search matching
    symptoms: ['burning sensation', 'anal pain', 'itching', 'bleeding', 'discomfort after stool', 'rectal pain'],
    
    // Bilingual FAQ for rich results
    faq: [
      {
        question_en: 'Why does it burn after I use the bathroom?',
        question_hi: 'टॉयलेट के बाद जलन क्यों होती है?',
        answer_en: 'Burning after bowel movements can be caused by hemorrhoids, anal fissures, spicy foods, infections, or skin irritation. The sensitive anal tissue can become inflamed from various factors.',
        answer_hi: 'मलत्याग के बाद जलन बवासीर, गुदा में दरारें, मसालेदार भोजन, संक्रमण या त्वचा की जलन के कारण हो सकती है। संवेदनशील गुदा ऊतक विभिन्न कारणों से सूज सकता है।'
      },
      {
        question_en: 'Is burning sensation after stool a sign of piles?',
        question_hi: 'क्या लैट्रिन के बाद जलन बवासीर का लक्षण है?',
        answer_en: 'Yes, burning sensation can be a symptom of hemorrhoids (piles), but it can also indicate other conditions like anal fissures or infections. If symptoms persist, consult a doctor.',
        answer_hi: 'हां, जलन बवासीर का एक लक्षण हो सकता है, लेकिन यह गुदा विदर या संक्रमण जैसी अन्य स्थितियों का भी संकेत हो सकता है। यदि लक्षण बने रहें तो डॉक्टर से परामर्श करें।'
      },
      {
        question_en: 'How can I get immediate relief from anal burning?',
        question_hi: 'गुदा की जलन से तुरंत राहत कैसे पाएं?',
        answer_en: 'For immediate relief, try a sitz bath with warm water, apply coconut oil or aloe vera, use gentle cleaning methods, and avoid spicy foods. Over-the-counter creams may also help.',
        answer_hi: 'तुरंत राहत के लिए गर्म पानी से सिट्ज़ बाथ लें, नारियल तेल या एलोवेरा लगाएं, सौम्य सफाई विधियों का उपयोग करें और मसालेदार भोजन से बचें।'
      },
      {
        question_en: 'When should I see a doctor for anal burning?',
        question_hi: 'गुदा में जलन के लिए डॉक्टर को कब दिखाना चाहिए?',
        answer_en: 'See a doctor if you experience rectal bleeding, symptoms lasting more than a week, severe pain, fever, or any signs of infection. Early treatment prevents complications.',
        answer_hi: 'यदि आपको मलाशय से खून आना, एक सप्ताह से अधिक समय तक लक्षण, गंभीर दर्द, बुखार, या संक्रमण के कोई लक्षण हों तो डॉक्टर से मिलें।'
      }
    ],
    
    // SEO metadata
    seo: {
      metaTitle: 'Burning Sensation After Stool: Causes & Relief',
      metaDescription: 'Learn about burning sensation in anus after passing stool. Causes include hemorrhoids, fissures, spicy food. Get home remedies and when to see a doctor.',
      keywords: ['burning after stool', 'anal burning', 'hemorrhoids', 'piles', 'rectal pain', 'home remedies'],
      hindiMeta: {
        title: 'गुदा में जलन के कारण और उपचार | Health Scan',
        description: 'लैट्रिन के बाद गुदा में जलन क्यों होती है? बवासीर, पाइल्स के लक्षण और घरेलू उपचार जानें। डॉक्टर को कब दिखाएं।',
        keywords: ['गुदा में जलन', 'लैट्रिन के बाद जलन', 'बवासीर के लक्षण', 'पाइल्स का इलाज', 'गुदा दर्द']
      }
    },
    
    medicalReviewed: true,
    reviewedBy: 'Health Scan Medical Content Team',
    isPublished: true
  },

  // ==========================================================
  // BLOG 2: Stomach Gas Problem
  // ==========================================================
  {
    title: 'Stomach Gas Problem: Causes, Symptoms, and Natural Remedies',
    slug: 'stomach-gas-problem-causes-remedies',
    content: `
      <h2>Understanding Stomach Gas</h2>
      <p>Stomach gas, also known as bloating or flatulence, is a common digestive issue that affects millions of people. While passing gas is normal, excessive gas can cause discomfort, embarrassment, and affect quality of life.</p>
      
      <h2>What Causes Excessive Gas?</h2>
      
      <h3>Swallowed Air</h3>
      <p>Eating too quickly, talking while eating, chewing gum, or drinking carbonated beverages can cause you to swallow excess air.</p>
      
      <h3>Food Choices</h3>
      <p>Certain foods are known to produce more gas during digestion:</p>
      <ul>
        <li>Beans and lentils</li>
        <li>Cruciferous vegetables (broccoli, cabbage, cauliflower)</li>
        <li>Onions and garlic</li>
        <li>Dairy products (if lactose intolerant)</li>
        <li>Wheat and grains (if gluten sensitive)</li>
        <li>Artificial sweeteners</li>
      </ul>
      
      <h3>Digestive Disorders</h3>
      <p>Conditions like IBS, GERD, or small intestinal bacterial overgrowth (SIBO) can cause excessive gas.</p>
      
      <h2>Symptoms of Gas Problem</h2>
      <ul>
        <li>Bloating and abdominal distension</li>
        <li>Abdominal pain or cramping</li>
        <li>Frequent belching</li>
        <li>Feeling of fullness</li>
        <li>Flatulence</li>
      </ul>
      
      <h2>Natural Remedies for Gas Relief</h2>
      
      <h3>1. Ginger</h3>
      <p>Ginger has natural carminative properties. Drink ginger tea or chew fresh ginger after meals.</p>
      
      <h3>2. Fennel Seeds (Saunf)</h3>
      <p>Chew a teaspoon of fennel seeds after meals. This is a traditional Indian remedy for gas.</p>
      
      <h3>3. Carom Seeds (Ajwain)</h3>
      <p>Mix ajwain with a pinch of black salt and take with warm water for quick relief.</p>
      
      <h3>4. Peppermint Tea</h3>
      <p>Peppermint relaxes the digestive muscles and helps release trapped gas.</p>
      
      <h3>5. Warm Water</h3>
      <p>Drinking warm water, especially in the morning, helps stimulate digestion.</p>
      
      <h2>Prevention Tips</h2>
      <ul>
        <li>Eat slowly and chew food thoroughly</li>
        <li>Avoid carbonated drinks</li>
        <li>Don't lie down immediately after eating</li>
        <li>Exercise regularly</li>
        <li>Identify and avoid trigger foods</li>
        <li>Practice stress management</li>
      </ul>
      
      <h2>When to Consult a Doctor</h2>
      <p>See a healthcare provider if you experience:</p>
      <ul>
        <li>Persistent or severe abdominal pain</li>
        <li>Blood in stool</li>
        <li>Unexplained weight loss</li>
        <li>Chronic diarrhea or constipation</li>
        <li>Symptoms not relieved by home remedies</li>
      </ul>
    `,
    category: 'Diseases',
    medicalCategory: 'Digestive Health',
    tags: ['gas problem', 'bloating', 'digestion', 'stomach pain', 'home remedies', 'acidity'],
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    
    intentKeywords: {
      en: ['stomach gas', 'bloating', 'gas pain', 'flatulence', 'digestive problems'],
      hi: ['पेट में गैस', 'गैस की समस्या', 'पेट फूलना', 'अपच', 'पेट दर्द', 'गैस का इलाज', 'पाचन की समस्या'],
      hinglish: ['pet mein gas', 'gas ki problem', 'pet phoolna', 'acidity ka ilaj', 'gas ka gharelu upay']
    },
    
    symptoms: ['bloating', 'abdominal pain', 'belching', 'flatulence', 'fullness', 'stomach cramps'],
    
    faq: [
      {
        question_en: 'What causes excessive gas in stomach?',
        question_hi: 'पेट में ज्यादा गैस क्यों बनती है?',
        answer_en: 'Excessive gas is caused by swallowing air, eating gas-producing foods, digestive disorders, or bacterial imbalances. Eating too quickly and carbonated drinks are common causes.',
        answer_hi: 'अधिक गैस हवा निगलने, गैस बनाने वाले खाद्य पदार्थ खाने, पाचन विकार या बैक्टीरियल असंतुलन के कारण होती है।'
      },
      {
        question_en: 'How can I get rid of gas quickly?',
        question_hi: 'गैस से तुरंत कैसे छुटकारा पाएं?',
        answer_en: 'For quick relief, try ginger tea, fennel seeds, warm water with ajwain, or peppermint. Light walking after meals also helps release trapped gas.',
        answer_hi: 'तुरंत राहत के लिए अदरक की चाय, सौंफ, अजवाइन के साथ गर्म पानी, या पुदीना चाय आज़माएं। भोजन के बाद हल्की सैर से भी फायदा होता है।'
      },
      {
        question_en: 'Which foods cause gas?',
        question_hi: 'कौन से खाद्य पदार्थ गैस बनाते हैं?',
        answer_en: 'Common gas-producing foods include beans, lentils, cabbage, onions, dairy products, carbonated drinks, and artificial sweeteners.',
        answer_hi: 'आम गैस बनाने वाले खाद्य पदार्थों में राजमा, दालें, पत्ता गोभी, प्याज, डेयरी उत्पाद और कार्बोनेटेड पेय शामिल हैं।'
      }
    ],
    
    seo: {
      metaTitle: 'Stomach Gas Problem: Causes & Natural Remedies',
      metaDescription: 'Learn about stomach gas causes, symptoms and natural remedies. Try ginger, fennel seeds, ajwain for quick relief. When to see a doctor for bloating.',
      keywords: ['stomach gas', 'bloating', 'gas problem', 'flatulence', 'home remedies', 'digestive health'],
      hindiMeta: {
        title: 'पेट में गैस की समस्या: कारण और घरेलू उपाय | Health Scan',
        description: 'पेट में गैस क्यों बनती है? गैस की समस्या के लक्षण और घरेलू इलाज जानें। अदरक, सौंफ, अजवाइन से तुरंत राहत पाएं।',
        keywords: ['पेट में गैस', 'गैस की समस्या', 'पेट फूलना', 'गैस का इलाज', 'पाचन समस्या']
      }
    },
    
    medicalReviewed: true,
    reviewedBy: 'Health Scan Medical Content Team',
    isPublished: true
  },

  // ==========================================================
  // BLOG 3: Headache Types and Relief
  // ==========================================================
  {
    title: 'Types of Headaches: Causes, Symptoms, and Relief Methods',
    slug: 'headache-types-causes-relief',
    content: `
      <h2>Understanding Different Types of Headaches</h2>
      <p>Headaches are one of the most common health complaints. Understanding the type of headache you have is crucial for finding effective relief. This guide covers the main types of headaches and how to manage them.</p>
      
      <h2>1. Tension Headaches</h2>
      <p>The most common type, tension headaches feel like a tight band around your head.</p>
      <h3>Symptoms:</h3>
      <ul>
        <li>Dull, aching pain</li>
        <li>Pressure across forehead or sides of head</li>
        <li>Tenderness in scalp, neck, and shoulders</li>
      </ul>
      <h3>Common Triggers:</h3>
      <ul>
        <li>Stress and anxiety</li>
        <li>Poor posture</li>
        <li>Eye strain from screens</li>
        <li>Dehydration</li>
      </ul>
      
      <h2>2. Migraine</h2>
      <p>Migraines are intense headaches that can be debilitating.</p>
      <h3>Symptoms:</h3>
      <ul>
        <li>Severe, throbbing pain (usually one side)</li>
        <li>Nausea and vomiting</li>
        <li>Sensitivity to light and sound</li>
        <li>Visual disturbances (aura)</li>
      </ul>
      
      <h2>3. Sinus Headaches</h2>
      <p>Caused by sinus inflammation, usually during infections or allergies.</p>
      <h3>Symptoms:</h3>
      <ul>
        <li>Pain in forehead, cheeks, or bridge of nose</li>
        <li>Nasal congestion</li>
        <li>Pain worsens when bending forward</li>
      </ul>
      
      <h2>Home Remedies for Headache Relief</h2>
      <ol>
        <li><strong>Cold or Hot Compress:</strong> Apply to forehead or neck</li>
        <li><strong>Rest in Dark Room:</strong> Especially for migraines</li>
        <li><strong>Stay Hydrated:</strong> Drink plenty of water</li>
        <li><strong>Ginger Tea:</strong> Natural anti-inflammatory</li>
        <li><strong>Peppermint Oil:</strong> Apply to temples</li>
        <li><strong>Massage:</strong> Gentle massage of temples and neck</li>
      </ol>
      
      <h2>Prevention Tips</h2>
      <ul>
        <li>Maintain regular sleep schedule</li>
        <li>Manage stress with relaxation techniques</li>
        <li>Take screen breaks every 20 minutes</li>
        <li>Stay physically active</li>
        <li>Limit caffeine and alcohol</li>
        <li>Keep a headache diary to identify triggers</li>
      </ul>
      
      <h2>When to See a Doctor</h2>
      <p>Seek immediate medical attention for:</p>
      <ul>
        <li>Sudden, severe headache ("thunderclap")</li>
        <li>Headache with fever, stiff neck, confusion</li>
        <li>Headache after head injury</li>
        <li>Progressive worsening of headaches</li>
        <li>Headaches that wake you from sleep</li>
      </ul>
    `,
    category: 'Diseases',
    medicalCategory: 'General Wellness',
    tags: ['headache', 'migraine', 'tension headache', 'pain relief', 'home remedies'],
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    
    intentKeywords: {
      en: ['headache types', 'migraine symptoms', 'headache relief', 'tension headache', 'sinus headache'],
      hi: ['सिर दर्द', 'माइग्रेन', 'सिर में दर्द', 'आधे सिर का दर्द', 'सिर दर्द का इलाज', 'तेज सिर दर्द'],
      hinglish: ['sir dard', 'migraine ka ilaj', 'sar mein dard', 'headache ka gharelu upay', 'adhkapari']
    },
    
    symptoms: ['head pain', 'throbbing', 'pressure', 'nausea', 'light sensitivity', 'neck stiffness'],
    
    faq: [
      {
        question_en: 'What causes frequent headaches?',
        question_hi: 'बार-बार सिर दर्द क्यों होता है?',
        answer_en: 'Frequent headaches can be caused by stress, poor sleep, dehydration, eye strain, hormonal changes, or underlying medical conditions. Keeping a headache diary helps identify patterns.',
        answer_hi: 'बार-बार सिर दर्द तनाव, नींद की कमी, पानी की कमी, आंखों पर जोर, हार्मोनल बदलाव या अंतर्निहित स्वास्थ्य समस्याओं के कारण हो सकता है।'
      },
      {
        question_en: 'How can I get rid of headache without medicine?',
        question_hi: 'बिना दवाई के सिर दर्द कैसे ठीक करें?',
        answer_en: 'Try drinking water, resting in a dark room, applying cold compress, massaging temples, using peppermint oil, or drinking ginger tea. These natural methods often provide relief.',
        answer_hi: 'पानी पिएं, अंधेरे कमरे में आराम करें, ठंडी सिकाई करें, कनपटी की मालिश करें, पुदीना तेल लगाएं या अदरक की चाय पिएं।'
      },
      {
        question_en: 'When is a headache serious?',
        question_hi: 'सिर दर्द कब गंभीर होता है?',
        answer_en: 'A headache is serious if it comes on suddenly and severely, occurs with fever, stiff neck, or confusion, follows a head injury, or is the worst headache you have ever had.',
        answer_hi: 'सिर दर्द गंभीर है यदि यह अचानक और तीव्र आए, बुखार, गर्दन में अकड़न या भ्रम के साथ हो, सिर की चोट के बाद हो, या अब तक का सबसे तेज दर्द हो।'
      }
    ],
    
    seo: {
      metaTitle: 'Headache Types: Causes & Natural Relief | Health Scan',
      metaDescription: 'Learn about different headache types - tension, migraine, sinus. Natural remedies for relief. Know when headache is serious and needs medical attention.',
      keywords: ['headache types', 'migraine', 'tension headache', 'headache relief', 'natural remedies'],
      hindiMeta: {
        title: 'सिर दर्द के प्रकार: कारण और घरेलू उपचार | Health Scan',
        description: 'सिर दर्द के विभिन्न प्रकार - तनाव, माइग्रेन, साइनस। घरेलू उपचार से राहत पाएं। जानें कब सिर दर्द गंभीर है।',
        keywords: ['सिर दर्द', 'माइग्रेन', 'सिर दर्द का इलाज', 'आधे सिर का दर्द']
      }
    },
    
    medicalReviewed: true,
    reviewedBy: 'Health Scan Medical Content Team',
    isPublished: true
  },

  // ==========================================================
  // BLOG 4: Home Exercises (Original enhanced)
  // ==========================================================
  {
    title: '10 Simple Exercises You Can Do at Home Without Equipment',
    slug: '10-home-exercises-without-equipment',
    content: `
      <h2>Introduction</h2>
      <p>Staying fit doesn't require an expensive gym membership or fancy equipment. With these 10 simple exercises, you can maintain your fitness from the comfort of your home.</p>
      
      <h2>1. Jumping Jacks</h2>
      <p>A classic cardio exercise that gets your heart pumping. Start with 30 seconds and gradually increase to 2 minutes.</p>
      
      <h2>2. Push-ups</h2>
      <p>Great for building upper body strength. Begin with knee push-ups if regular ones are too challenging.</p>
      
      <h2>3. Squats</h2>
      <p>Target your legs and glutes with proper squats. Keep your back straight and lower until your thighs are parallel to the ground.</p>
      
      <h2>4. Plank</h2>
      <p>Excellent for core strength. Hold for 30 seconds and work your way up to 2 minutes.</p>
      
      <h2>5. Lunges</h2>
      <p>Step forward and lower your body until both knees are at 90 degrees. Alternate legs for a complete workout.</p>
      
      <h2>6. Mountain Climbers</h2>
      <p>Combines cardio with core work. Start in a push-up position and alternate bringing knees to chest.</p>
      
      <h2>7. Burpees</h2>
      <p>A full-body exercise that burns calories fast. Start slow and focus on form.</p>
      
      <h2>8. Tricep Dips</h2>
      <p>Use a sturdy chair to work your triceps. Keep your back close to the chair as you lower and raise.</p>
      
      <h2>9. High Knees</h2>
      <p>Run in place while bringing your knees up high. Great for cardio and leg strength.</p>
      
      <h2>10. Superman</h2>
      <p>Lie face down and lift your arms and legs off the ground. Strengthens your lower back.</p>
      
      <h2>Creating Your Routine</h2>
      <p>Combine 5-6 of these exercises for a 20-30 minute workout. Rest 30-60 seconds between exercises.</p>
      
      <p><strong>Remember:</strong> Always warm up before exercising and consult a healthcare provider before starting any new exercise routine.</p>
    `,
    category: 'Fitness',
    medicalCategory: 'General Wellness',
    tags: ['exercise', 'home workout', 'fitness', 'no equipment', 'weight loss'],
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    
    intentKeywords: {
      en: ['home exercises', 'workout at home', 'no equipment workout', 'body weight exercises'],
      hi: ['घर पर व्यायाम', 'बिना उपकरण के व्यायाम', 'वजन कम करने के व्यायाम', 'पेट कम करने की एक्सरसाइज'],
      hinglish: ['ghar par exercise', 'bina equipment ke workout', 'weight loss exercise', 'pet kam karne ki exercise']
    },
    
    symptoms: [],
    
    faq: [
      {
        question_en: 'Can I lose weight with home exercises?',
        question_hi: 'क्या घर पर व्यायाम से वजन कम हो सकता है?',
        answer_en: 'Yes, regular home exercises combined with a balanced diet can help you lose weight. Consistency is key - aim for at least 30 minutes of exercise 5 days a week.',
        answer_hi: 'हां, संतुलित आहार के साथ नियमित घरेलू व्यायाम से वजन कम हो सकता है। निरंतरता महत्वपूर्ण है - सप्ताह में कम से कम 5 दिन 30 मिनट व्यायाम करें।'
      },
      {
        question_en: 'How many times a week should I exercise?',
        question_hi: 'हफ्ते में कितनी बार व्यायाम करना चाहिए?',
        answer_en: 'For general fitness, aim for at least 150 minutes of moderate exercise per week, which is about 30 minutes 5 days a week. Include both cardio and strength training.',
        answer_hi: 'सामान्य फिटनेस के लिए प्रति सप्ताह कम से कम 150 मिनट मध्यम व्यायाम करें, यानी सप्ताह में 5 दिन 30 मिनट। कार्डियो और स्ट्रेंथ ट्रेनिंग दोनों शामिल करें।'
      }
    ],
    
    seo: {
      metaTitle: '10 Home Exercises Without Equipment | Health Scan',
      metaDescription: 'Discover 10 effective exercises you can do at home without any equipment. Stay fit and healthy with these simple workout routines.',
      keywords: ['home exercise', 'no equipment workout', 'fitness at home', 'body weight exercises'],
      hindiMeta: {
        title: '10 घरेलू व्यायाम बिना उपकरण के | Health Scan',
        description: 'घर पर बिना किसी उपकरण के 10 प्रभावी व्यायाम। इन सरल वर्कआउट रूटीन से फिट और स्वस्थ रहें।',
        keywords: ['घर पर व्यायाम', 'बिना उपकरण व्यायाम', 'वजन कम करना']
      }
    },
    
    isPublished: true
  },

  // ==========================================================
  // BLOG 5: Understanding Anxiety
  // ==========================================================
  {
    title: 'Understanding Anxiety: Signs, Causes, and Coping Strategies',
    slug: 'understanding-anxiety-signs-causes-coping',
    content: `
      <h2>What is Anxiety?</h2>
      <p>Anxiety is a natural response to stress, but when it becomes persistent and overwhelming, it can impact daily life. Understanding anxiety is the first step toward managing it effectively.</p>
      
      <h2>Common Signs of Anxiety</h2>
      <ul>
        <li>Persistent worry or fear</li>
        <li>Restlessness or feeling on edge</li>
        <li>Difficulty concentrating</li>
        <li>Sleep disturbances</li>
        <li>Physical symptoms like rapid heartbeat, sweating, or trembling</li>
        <li>Avoiding situations that trigger anxiety</li>
      </ul>
      
      <h2>What Causes Anxiety?</h2>
      <p>Anxiety can be triggered by various factors including:</p>
      <ul>
        <li>Stressful life events</li>
        <li>Genetic predisposition</li>
        <li>Medical conditions</li>
        <li>Substance use</li>
        <li>Personality factors</li>
      </ul>
      
      <h2>Coping Strategies</h2>
      
      <h3>1. Practice Deep Breathing</h3>
      <p>When anxiety strikes, try the 4-7-8 technique: breathe in for 4 seconds, hold for 7, exhale for 8.</p>
      
      <h3>2. Stay Active</h3>
      <p>Regular physical activity can help reduce anxiety symptoms and improve mood.</p>
      
      <h3>3. Limit Caffeine and Alcohol</h3>
      <p>Both can trigger or worsen anxiety symptoms in some people.</p>
      
      <h3>4. Practice Mindfulness</h3>
      <p>Mindfulness meditation can help you stay grounded and reduce racing thoughts.</p>
      
      <h3>5. Get Enough Sleep</h3>
      <p>Aim for 7-9 hours of quality sleep each night.</p>
      
      <h3>6. Connect with Others</h3>
      <p>Social support is crucial for mental health. Don't hesitate to reach out to friends and family.</p>
      
      <h2>When to Seek Help</h2>
      <p>If anxiety significantly impacts your daily life, work, or relationships, it's important to seek professional help. A mental health professional can provide proper assessment and treatment options.</p>
      
      <p><strong>Remember:</strong> Seeking help is a sign of strength, not weakness. Many effective treatments are available for anxiety disorders.</p>
    `,
    category: 'Mental Health',
    medicalCategory: 'Mental Wellness',
    tags: ['anxiety', 'mental health', 'stress', 'coping', 'wellness'],
    coverImage: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
    
    intentKeywords: {
      en: ['anxiety symptoms', 'anxiety relief', 'stress management', 'mental health', 'panic attacks'],
      hi: ['चिंता', 'तनाव', 'घबराहट', 'मानसिक स्वास्थ्य', 'बेचैनी', 'डर लगना'],
      hinglish: ['anxiety ka ilaj', 'tension kaise dur kare', 'ghabrahat', 'panic attack', 'stress management']
    },
    
    symptoms: ['worry', 'restlessness', 'panic', 'racing thoughts', 'sleep problems', 'rapid heartbeat'],
    
    faq: [
      {
        question_en: 'What are the signs of anxiety?',
        question_hi: 'चिंता के लक्षण क्या हैं?',
        answer_en: 'Common signs include persistent worry, restlessness, difficulty concentrating, sleep problems, rapid heartbeat, and avoiding certain situations. Physical symptoms like sweating and trembling are also common.',
        answer_hi: 'सामान्य लक्षणों में लगातार चिंता, बेचैनी, ध्यान केंद्रित करने में कठिनाई, नींद की समस्या, तेज दिल की धड़कन शामिल हैं।'
      },
      {
        question_en: 'How can I reduce anxiety naturally?',
        question_hi: 'प्राकृतिक रूप से चिंता कैसे कम करें?',
        answer_en: 'Try deep breathing exercises, regular physical activity, limiting caffeine, practicing mindfulness meditation, getting enough sleep, and connecting with supportive people.',
        answer_hi: 'गहरी सांस लेने के व्यायाम, नियमित शारीरिक गतिविधि, कैफीन सीमित करना, माइंडफुलनेस मेडिटेशन, पर्याप्त नींद लें और सहायक लोगों से जुड़ें।'
      }
    ],
    
    seo: {
      metaTitle: 'Understanding Anxiety: Signs & Coping Tips',
      metaDescription: 'Learn about anxiety symptoms, causes, and effective coping strategies. Expert tips for managing anxiety and when to seek professional help.',
      keywords: ['anxiety', 'mental health', 'coping strategies', 'stress management'],
      hindiMeta: {
        title: 'चिंता को समझें: लक्षण और उपचार | Health Scan',
        description: 'चिंता के लक्षण, कारण और प्रभावी सामना करने की रणनीतियां जानें। तनाव प्रबंधन के विशेषज्ञ सुझाव।',
        keywords: ['चिंता', 'तनाव', 'मानसिक स्वास्थ्य', 'घबराहट']
      }
    },
    
    isPublished: true
  },

  // ==========================================================
  // BLOG 6: Sleep Tips
  // ==========================================================
  {
    title: 'Sleep Hygiene: 15 Tips for Better Sleep Tonight',
    slug: 'sleep-hygiene-tips-for-better-sleep',
    content: `
      <h2>Why Sleep Matters</h2>
      <p>Quality sleep is essential for physical health, mental well-being, and cognitive function. Poor sleep can affect everything from your immune system to your mood and productivity.</p>
      
      <h2>15 Tips for Better Sleep</h2>
      
      <h3>Create a Sleep-Friendly Environment</h3>
      <ol>
        <li><strong>Keep your bedroom cool</strong> - Aim for 65-68°F (18-20°C)</li>
        <li><strong>Make it dark</strong> - Use blackout curtains or a sleep mask</li>
        <li><strong>Reduce noise</strong> - Use earplugs or white noise if needed</li>
        <li><strong>Invest in comfort</strong> - Quality mattress and pillows matter</li>
      </ol>
      
      <h3>Establish Healthy Habits</h3>
      <ol start="5">
        <li><strong>Stick to a schedule</strong> - Same bedtime and wake time daily</li>
        <li><strong>Create a bedtime routine</strong> - Wind down 30-60 minutes before bed</li>
        <li><strong>Limit screen time</strong> - Avoid phones/tablets 1 hour before bed</li>
        <li><strong>Exercise regularly</strong> - But not too close to bedtime</li>
      </ol>
      
      <h3>Watch What You Consume</h3>
      <ol start="9">
        <li><strong>Avoid caffeine after 2pm</strong> - It can stay in your system for hours</li>
        <li><strong>Limit alcohol</strong> - It disrupts sleep quality</li>
        <li><strong>Don't eat heavy meals late</strong> - Allow 2-3 hours before bed</li>
        <li><strong>Stay hydrated during the day</strong> - But reduce fluids before bed</li>
      </ol>
      
      <h3>Manage Your Mind</h3>
      <ol start="13">
        <li><strong>Write down worries</strong> - Clear your mind before bed</li>
        <li><strong>Practice relaxation techniques</strong> - Try meditation or deep breathing</li>
        <li><strong>If you can't sleep, get up</strong> - Don't lie awake for more than 20 minutes</li>
      </ol>
      
      <h2>Signs of Sleep Problems</h2>
      <p>Consider speaking with a healthcare provider if you experience:</p>
      <ul>
        <li>Difficulty falling asleep regularly</li>
        <li>Waking up frequently during the night</li>
        <li>Feeling tired despite getting enough sleep</li>
        <li>Snoring loudly or gasping during sleep</li>
        <li>Relying on sleep aids regularly</li>
      </ul>
      
      <p><strong>Remember:</strong> If sleep problems persist, consult a healthcare professional to rule out underlying conditions.</p>
    `,
    category: 'Wellness',
    medicalCategory: 'General Wellness',
    tags: ['sleep', 'insomnia', 'wellness', 'health tips', 'sleep hygiene'],
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    
    intentKeywords: {
      en: ['better sleep', 'insomnia', 'sleep tips', 'sleep hygiene', 'cant sleep'],
      hi: ['नींद नहीं आती', 'अनिद्रा', 'नींद की समस्या', 'अच्छी नींद के उपाय', 'नींद कैसे आए'],
      hinglish: ['neend nahi aati', 'insomnia ka ilaj', 'acchi neend kaise le', 'neend ki problem']
    },
    
    symptoms: ['insomnia', 'difficulty sleeping', 'waking up tired', 'restless sleep'],
    
    faq: [
      {
        question_en: 'Why cant I sleep at night?',
        question_hi: 'रात को नींद क्यों नहीं आती?',
        answer_en: 'Common causes include stress, screen time before bed, caffeine, irregular sleep schedule, and an uncomfortable sleep environment. Identifying and addressing these factors often helps.',
        answer_hi: 'सामान्य कारणों में तनाव, सोने से पहले स्क्रीन का उपयोग, कैफीन, अनियमित नींद का समय और असहज नींद का वातावरण शामिल हैं।'
      },
      {
        question_en: 'How many hours of sleep do I need?',
        question_hi: 'मुझे कितने घंटे की नींद चाहिए?',
        answer_en: 'Adults typically need 7-9 hours of sleep per night. However, individual needs vary. Quality of sleep is as important as quantity.',
        answer_hi: 'वयस्कों को आमतौर पर प्रति रात 7-9 घंटे की नींद चाहिए। हालांकि, व्यक्तिगत जरूरतें अलग-अलग होती हैं।'
      }
    ],
    
    seo: {
      metaTitle: '15 Tips for Better Sleep | Sleep Hygiene Guide',
      metaDescription: 'Improve your sleep with these 15 expert tips. Learn about sleep hygiene, creating the perfect sleep environment, and healthy bedtime habits.',
      keywords: ['sleep tips', 'better sleep', 'sleep hygiene', 'insomnia'],
      hindiMeta: {
        title: 'अच्छी नींद के 15 उपाय | Health Scan',
        description: 'इन 15 विशेषज्ञ सुझावों से अपनी नींद में सुधार करें। स्वस्थ नींद के वातावरण और आदतों के बारे में जानें।',
        keywords: ['नींद के उपाय', 'अनिद्रा', 'अच्छी नींद', 'नींद की समस्या']
      }
    },
    
    isPublished: true
  }
];

/**
 * Seed the database
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Get admin user for blog author
    const adminUser = createdUsers.find(u => u.role === 'admin');

    // Add author to blogs and create them
    const blogsWithAuthor = blogs.map(blog => ({
      ...blog,
      author: adminUser._id,
      publishedAt: new Date()
    }));

    const createdBlogs = await Blog.create(blogsWithAuthor);
    console.log(`📝 Created ${createdBlogs.length} blogs`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('   Admin: admin@healthai.com / admin123');
    console.log('   User:  john@example.com / user123\n');
    console.log('🔍 Multilingual SEO Test Queries:');
    console.log('   Hindi: "गुदा में जलन", "पेट में गैस", "सिर दर्द"');
    console.log('   Hinglish: "guda mein jalan", "pet mein gas", "sir dard"\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
