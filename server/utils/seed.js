import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

/**
 * Seed Data for HealthAI Platform
 */

const users = [
  {
    name: 'Admin User',
    email: 'admin@healthai.com',
    password: 'admin123',
    role: 'admin',
    bio: 'HealthAI Platform Administrator'
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
  {
    title: '10 Simple Exercises You Can Do at Home Without Equipment',
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
    tags: ['exercise', 'home workout', 'fitness', 'no equipment'],
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    isPublished: true,
    seo: {
      metaTitle: '10 Home Exercises Without Equipment | HealthAI',
      metaDescription: 'Discover 10 effective exercises you can do at home without any equipment. Stay fit and healthy with these simple workout routines.',
      keywords: ['home exercise', 'no equipment workout', 'fitness at home']
    }
  },
  {
    title: 'Understanding Anxiety: Signs, Causes, and Coping Strategies',
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
    tags: ['anxiety', 'mental health', 'stress', 'coping', 'wellness'],
    coverImage: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
    isPublished: true,
    seo: {
      metaTitle: 'Understanding Anxiety: Signs & Coping Strategies | HealthAI',
      metaDescription: 'Learn about anxiety symptoms, causes, and effective coping strategies. Expert tips for managing anxiety and when to seek professional help.',
      keywords: ['anxiety', 'mental health', 'coping strategies', 'stress management']
    }
  },
  {
    title: 'The Mediterranean Diet: A Complete Guide to Healthy Eating',
    content: `
      <h2>What is the Mediterranean Diet?</h2>
      <p>The Mediterranean diet is inspired by the traditional eating habits of countries bordering the Mediterranean Sea. It emphasizes whole foods, healthy fats, and a balanced approach to eating.</p>
      
      <h2>Key Components</h2>
      
      <h3>Eat Plenty Of:</h3>
      <ul>
        <li>Fruits and vegetables (aim for 7-10 servings daily)</li>
        <li>Whole grains (bread, pasta, rice, couscous)</li>
        <li>Legumes (beans, lentils, chickpeas)</li>
        <li>Nuts and seeds</li>
        <li>Olive oil (primary source of fat)</li>
        <li>Herbs and spices</li>
      </ul>
      
      <h3>Eat Moderately:</h3>
      <ul>
        <li>Fish and seafood (at least twice a week)</li>
        <li>Poultry and eggs</li>
        <li>Dairy products (mainly yogurt and cheese)</li>
        <li>Red wine (optional, in moderation)</li>
      </ul>
      
      <h3>Limit:</h3>
      <ul>
        <li>Red meat</li>
        <li>Processed foods</li>
        <li>Added sugars</li>
        <li>Refined grains</li>
      </ul>
      
      <h2>Health Benefits</h2>
      <p>Research has shown the Mediterranean diet may help:</p>
      <ul>
        <li>Reduce risk of heart disease</li>
        <li>Support healthy weight management</li>
        <li>Improve brain function</li>
        <li>Lower inflammation</li>
        <li>Support longevity</li>
      </ul>
      
      <h2>Sample Day Menu</h2>
      <p><strong>Breakfast:</strong> Greek yogurt with fresh berries, honey, and walnuts</p>
      <p><strong>Lunch:</strong> Mediterranean salad with chickpeas, cucumber, tomatoes, olives, and feta cheese</p>
      <p><strong>Dinner:</strong> Grilled salmon with roasted vegetables and quinoa</p>
      <p><strong>Snacks:</strong> Hummus with vegetables, fresh fruit, or a handful of almonds</p>
      
      <h2>Getting Started</h2>
      <ol>
        <li>Replace butter with olive oil</li>
        <li>Add more vegetables to every meal</li>
        <li>Choose whole grains over refined</li>
        <li>Eat fish twice a week</li>
        <li>Enjoy meals with family and friends</li>
      </ol>
      
      <p><strong>Note:</strong> Before making significant dietary changes, consult with a healthcare provider or registered dietitian.</p>
    `,
    category: 'Diet',
    tags: ['mediterranean diet', 'healthy eating', 'nutrition', 'diet'],
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    isPublished: true,
    seo: {
      metaTitle: 'Mediterranean Diet Complete Guide | HealthAI',
      metaDescription: 'Discover the Mediterranean diet: what to eat, health benefits, and how to get started. A complete guide to this heart-healthy eating pattern.',
      keywords: ['mediterranean diet', 'healthy eating', 'nutrition guide']
    }
  },
  {
    title: 'Sleep Hygiene: 15 Tips for Better Sleep Tonight',
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
    tags: ['sleep', 'insomnia', 'wellness', 'health tips'],
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    isPublished: true,
    seo: {
      metaTitle: '15 Tips for Better Sleep | Sleep Hygiene Guide | HealthAI',
      metaDescription: 'Improve your sleep with these 15 expert tips. Learn about sleep hygiene, creating the perfect sleep environment, and healthy bedtime habits.',
      keywords: ['sleep tips', 'better sleep', 'sleep hygiene', 'insomnia']
    }
  },
  {
    title: 'Heart Health: Understanding Risk Factors and Prevention',
    content: `
      <h2>The Importance of Heart Health</h2>
      <p>Your heart is the engine of your body, pumping blood and oxygen to every cell. Taking care of your heart is one of the most important things you can do for your overall health.</p>
      
      <h2>Understanding Heart Disease Risk Factors</h2>
      
      <h3>Factors You Can Control</h3>
      <ul>
        <li><strong>Smoking</strong> - The single most preventable cause of heart disease</li>
        <li><strong>High blood pressure</strong> - Often called the "silent killer"</li>
        <li><strong>High cholesterol</strong> - Can lead to plaque buildup in arteries</li>
        <li><strong>Diabetes</strong> - Significantly increases heart disease risk</li>
        <li><strong>Obesity</strong> - Puts extra strain on the heart</li>
        <li><strong>Physical inactivity</strong> - Weakens the heart muscle</li>
        <li><strong>Poor diet</strong> - Can contribute to multiple risk factors</li>
        <li><strong>Excessive alcohol</strong> - Can raise blood pressure</li>
        <li><strong>Chronic stress</strong> - May contribute to heart problems</li>
      </ul>
      
      <h3>Factors You Cannot Control</h3>
      <ul>
        <li>Age (risk increases with age)</li>
        <li>Family history of heart disease</li>
        <li>Gender (men have higher risk earlier in life)</li>
        <li>Ethnicity</li>
      </ul>
      
      <h2>Prevention Strategies</h2>
      
      <h3>1. Eat Heart-Healthy Foods</h3>
      <ul>
        <li>Plenty of fruits and vegetables</li>
        <li>Whole grains</li>
        <li>Lean proteins, especially fish</li>
        <li>Healthy fats like olive oil and avocados</li>
        <li>Limit sodium, sugar, and saturated fats</li>
      </ul>
      
      <h3>2. Stay Active</h3>
      <p>Aim for at least 150 minutes of moderate exercise per week.</p>
      
      <h3>3. Maintain a Healthy Weight</h3>
      <p>Even losing 5-10% of body weight can improve heart health.</p>
      
      <h3>4. Don't Smoke</h3>
      <p>If you smoke, quitting is the best thing you can do for your heart.</p>
      
      <h3>5. Manage Stress</h3>
      <p>Practice relaxation techniques and maintain work-life balance.</p>
      
      <h3>6. Get Regular Checkups</h3>
      <p>Monitor blood pressure, cholesterol, and blood sugar regularly.</p>
      
      <h2>Warning Signs</h2>
      <p>Seek immediate medical attention if you experience:</p>
      <ul>
        <li>Chest pain or discomfort</li>
        <li>Shortness of breath</li>
        <li>Pain in arms, back, neck, or jaw</li>
        <li>Sudden dizziness or confusion</li>
      </ul>
      
      <p><strong>Important:</strong> This information is for education only. Consult healthcare professionals for personalized advice and regular screenings.</p>
    `,
    category: 'Diseases',
    tags: ['heart health', 'cardiovascular', 'prevention', 'risk factors'],
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
    isPublished: true,
    seo: {
      metaTitle: 'Heart Health: Risk Factors & Prevention | HealthAI',
      metaDescription: 'Learn about heart disease risk factors and effective prevention strategies. Understand how lifestyle changes can protect your heart health.',
      keywords: ['heart health', 'cardiovascular disease', 'heart disease prevention']
    }
  },
  {
    title: 'Staying Hydrated: How Much Water Do You Really Need?',
    content: `
      <h2>The Importance of Hydration</h2>
      <p>Water makes up about 60% of your body weight and is essential for nearly every bodily function, from regulating temperature to transporting nutrients.</p>
      
      <h2>How Much Water Do You Need?</h2>
      <p>While the "8 glasses a day" rule is popular, individual needs vary based on:</p>
      <ul>
        <li>Body size and weight</li>
        <li>Activity level</li>
        <li>Climate and weather</li>
        <li>Overall health</li>
        <li>Diet (some foods contain water)</li>
      </ul>
      
      <p><strong>General guideline:</strong> About 3.7 liters (125 oz) for men and 2.7 liters (91 oz) for women daily, including water from food.</p>
      
      <h2>Signs of Dehydration</h2>
      <ul>
        <li>Thirst (though not always reliable)</li>
        <li>Dark yellow urine</li>
        <li>Fatigue</li>
        <li>Dizziness</li>
        <li>Dry mouth and lips</li>
        <li>Headaches</li>
        <li>Decreased urination</li>
      </ul>
      
      <h2>Tips to Stay Hydrated</h2>
      <ol>
        <li><strong>Start your day with water</strong> - Drink a glass when you wake up</li>
        <li><strong>Carry a water bottle</strong> - Keep it visible as a reminder</li>
        <li><strong>Eat water-rich foods</strong> - Cucumbers, watermelon, oranges, lettuce</li>
        <li><strong>Set reminders</strong> - Use apps or phone alarms</li>
        <li><strong>Drink before meals</strong> - A glass before each meal</li>
        <li><strong>Flavor your water</strong> - Add lemon, cucumber, or mint</li>
        <li><strong>Match alcohol with water</strong> - One glass of water per alcoholic drink</li>
        <li><strong>Monitor urine color</strong> - Aim for pale yellow</li>
      </ol>
      
      <h2>When You Need More Water</h2>
      <ul>
        <li>During exercise (drink before, during, and after)</li>
        <li>In hot weather</li>
        <li>When sick (especially with fever, vomiting, or diarrhea)</li>
        <li>During pregnancy or breastfeeding</li>
      </ul>
      
      <h2>Can You Drink Too Much Water?</h2>
      <p>While rare, overhydration (hyponatremia) can occur when you drink excessive amounts quickly. This dilutes sodium levels in your blood.</p>
      
      <p><strong>Remember:</strong> Listen to your body and consult healthcare providers about specific hydration needs, especially if you have certain health conditions.</p>
    `,
    category: 'Lifestyle',
    tags: ['hydration', 'water', 'health tips', 'nutrition'],
    coverImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800',
    isPublished: true,
    seo: {
      metaTitle: 'How Much Water Do You Need? Hydration Guide | HealthAI',
      metaDescription: 'Learn how much water you really need and tips for staying properly hydrated. Understand the signs of dehydration and when to drink more.',
      keywords: ['hydration', 'water intake', 'dehydration', 'health tips']
    }
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

