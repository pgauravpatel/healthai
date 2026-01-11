import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * BlogFAQ Component
 * Renders FAQ section with accordion UI
 * Automatically generates FAQs if none provided
 */
export default function BlogFAQ({ faqs, category, title }) {
  const displayFaqs = faqs?.length > 0 ? faqs : generateFAQs(category, title)
  
  return (
    <section className="mt-12 pt-8 border-t" aria-labelledby="faq-heading">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-health-500" />
        <h2 id="faq-heading" className="text-2xl font-bold">
          Frequently Asked Questions
        </h2>
      </div>
      
      <div className="space-y-3">
        {displayFaqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} index={index} />
        ))}
      </div>
      
      {/* Medical disclaimer for FAQ */}
      <p className="mt-6 text-sm text-muted-foreground italic">
        These FAQs are for educational purposes only. Always consult a healthcare professional 
        for medical advice specific to your situation.
      </p>
    </section>
  )
}

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(index === 0)
  
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left",
          "hover:bg-muted/50 transition-colors",
          isOpen && "bg-muted/30"
        )}
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-muted-foreground">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Generate relevant FAQs based on blog category and title
 */
export function generateFAQs(category, title) {
  const categoryFAQs = {
    'Fitness': [
      {
        question: "How often should I exercise for optimal health?",
        answer: "The WHO recommends at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities on 2 or more days. However, any amount of physical activity is beneficial, and you should start gradually and increase over time."
      },
      {
        question: "What's the best time of day to exercise?",
        answer: "The best time to exercise is whenever you can do it consistently. Morning workouts may boost metabolism and establish routine, while evening workouts can help relieve stress. Choose a time that fits your schedule and energy levels."
      },
      {
        question: "Should I consult a doctor before starting a new fitness routine?",
        answer: "Yes, especially if you have any chronic health conditions, are over 40 and haven't been active, or have concerns about your health. A healthcare provider can help ensure your exercise plan is safe and appropriate for your needs."
      },
      {
        question: "How do I prevent injuries during exercise?",
        answer: "Start with proper warm-ups, use correct form, progress gradually, wear appropriate gear, stay hydrated, and listen to your body. Rest when needed and don't push through pain. Consider working with a certified trainer initially."
      },
      {
        question: "What should I eat before and after workouts?",
        answer: "Before workouts, eat easily digestible carbs 1-3 hours prior. After workouts, consume protein and carbs within 2 hours to aid recovery. Stay hydrated throughout. Individual needs vary based on workout intensity and personal goals."
      }
    ],
    'Mental Health': [
      {
        question: "What are the signs that I should seek mental health support?",
        answer: "Signs include persistent sadness or anxiety, significant changes in sleep or appetite, difficulty functioning at work or in relationships, withdrawal from activities you enjoy, thoughts of self-harm, or feeling overwhelmed for extended periods. Early intervention is beneficial."
      },
      {
        question: "Is it normal to feel anxious sometimes?",
        answer: "Yes, occasional anxiety is a normal response to stress or uncertainty. It becomes a concern when it's persistent, overwhelming, interferes with daily life, or causes physical symptoms. If you're concerned, consult a mental health professional."
      },
      {
        question: "How can I support my mental health daily?",
        answer: "Practice good sleep hygiene, exercise regularly, maintain social connections, limit alcohol and caffeine, practice mindfulness or meditation, set boundaries, seek professional help when needed, and engage in activities you enjoy."
      },
      {
        question: "What's the difference between a psychiatrist and a psychologist?",
        answer: "Psychiatrists are medical doctors who can prescribe medication and often focus on biological aspects of mental health. Psychologists have doctoral degrees in psychology and typically provide therapy and psychological testing. Both can diagnose and treat mental health conditions."
      },
      {
        question: "Can mental health conditions be treated effectively?",
        answer: "Yes, most mental health conditions are treatable. Treatment may include therapy (like CBT or DBT), medication, lifestyle changes, or a combination. Success rates are high when people receive appropriate treatment and support."
      }
    ],
    'Diet': [
      {
        question: "What is a balanced diet?",
        answer: "A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats in appropriate portions. It provides all essential nutrients while limiting processed foods, added sugars, saturated fats, and sodium."
      },
      {
        question: "Are supplements necessary if I eat a healthy diet?",
        answer: "Most people who eat a varied, balanced diet don't need supplements. However, some people may benefit from specific supplements based on age, health conditions, dietary restrictions, or pregnancy. Consult a healthcare provider before starting supplements."
      },
      {
        question: "How much water should I drink daily?",
        answer: "General recommendations suggest about 8 cups (64 oz) daily, but needs vary based on activity level, climate, health conditions, and diet. A good indicator is urine color—pale yellow suggests adequate hydration."
      },
      {
        question: "Is it better to eat several small meals or fewer large ones?",
        answer: "Both approaches can be healthy—what matters most is total calorie intake and food quality. Some people feel better with smaller, frequent meals, while others prefer intermittent fasting patterns. Choose what works for your lifestyle and energy levels."
      },
      {
        question: "How can I read nutrition labels effectively?",
        answer: "Check serving size first, then look at calories, saturated fat, sodium, and added sugars. Compare percent daily values—5% or less is low, 20% or more is high. Look at the ingredients list for whole foods and avoid heavily processed ingredients."
      }
    ],
    'Diseases': [
      {
        question: "When should I see a doctor about my symptoms?",
        answer: "See a doctor for severe symptoms, symptoms lasting more than a few days, high fever, difficulty breathing, chest pain, confusion, or symptoms that interfere with daily activities. When in doubt, it's better to get checked."
      },
      {
        question: "Can lifestyle changes help manage chronic conditions?",
        answer: "Yes, lifestyle changes like healthy diet, regular exercise, stress management, adequate sleep, and avoiding tobacco and excessive alcohol can significantly impact many chronic conditions. Always work with your healthcare team on a comprehensive management plan."
      },
      {
        question: "What's the difference between acute and chronic conditions?",
        answer: "Acute conditions develop suddenly and are usually short-term (like the flu or a sprain). Chronic conditions develop gradually and last for months or years (like diabetes or heart disease). Both require appropriate medical attention."
      },
      {
        question: "How can I prepare for a doctor's appointment about my condition?",
        answer: "Write down your symptoms (when they started, severity, triggers), list all medications and supplements, note your medical history and family history, prepare questions, and bring any relevant test results or records."
      },
      {
        question: "Are all medical conditions hereditary?",
        answer: "No, while genetics play a role in many conditions, environmental factors, lifestyle choices, and other factors also contribute. Having a family history increases risk for some conditions but doesn't guarantee you'll develop them."
      }
    ],
    'Wellness': [
      {
        question: "What is holistic wellness?",
        answer: "Holistic wellness considers the whole person—physical, mental, emotional, social, and spiritual health. It emphasizes the interconnection of these aspects and promotes balance through various practices including nutrition, exercise, stress management, and meaningful connections."
      },
      {
        question: "How does sleep affect overall wellness?",
        answer: "Sleep is crucial for physical repair, immune function, cognitive performance, emotional regulation, and metabolism. Poor sleep increases risk for obesity, heart disease, diabetes, and mental health issues. Adults generally need 7-9 hours per night."
      },
      {
        question: "What are effective stress management techniques?",
        answer: "Effective techniques include regular exercise, deep breathing, meditation, yoga, spending time in nature, maintaining social connections, setting boundaries, time management, journaling, and seeking professional support when needed."
      },
      {
        question: "How important is social connection for health?",
        answer: "Social connections are vital for health—research shows that strong relationships reduce mortality risk, improve immune function, lower stress hormones, and promote mental health. Quality of relationships matters more than quantity."
      },
      {
        question: "Can wellness practices replace medical treatment?",
        answer: "Wellness practices complement but don't replace medical treatment for health conditions. They can enhance overall health and may help prevent certain conditions. Always follow your healthcare provider's recommendations for specific medical concerns."
      }
    ],
    'Prevention': [
      {
        question: "What are the most important preventive health screenings?",
        answer: "Key screenings vary by age and risk factors but often include blood pressure checks, cholesterol tests, cancer screenings (breast, colorectal, cervical), diabetes screening, and immunizations. Your doctor can recommend a schedule based on your individual needs."
      },
      {
        question: "How can I reduce my risk of chronic diseases?",
        answer: "Maintain a healthy weight, eat a balanced diet rich in fruits and vegetables, exercise regularly, don't smoke, limit alcohol, manage stress, get adequate sleep, and stay up to date on preventive screenings and vaccinations."
      },
      {
        question: "Are vaccines safe and effective?",
        answer: "Yes, vaccines undergo rigorous testing and monitoring. They're one of the most effective ways to prevent serious diseases. Benefits far outweigh risks for most people. Discuss any concerns with your healthcare provider."
      },
      {
        question: "At what age should I start thinking about preventive care?",
        answer: "Preventive care is important at every age. Children need immunizations and developmental screenings, adults need regular check-ups and age-appropriate screenings, and older adults may need additional screenings and preventive measures."
      },
      {
        question: "How does early detection improve health outcomes?",
        answer: "Early detection often means conditions can be treated more effectively, with less invasive treatments, and better outcomes. Many serious conditions like cancer and heart disease have much better prognosis when caught early."
      }
    ],
    'Lifestyle': [
      {
        question: "How do I build healthy habits that stick?",
        answer: "Start small, be specific about when and where, link new habits to existing ones, track progress, celebrate small wins, and be patient—habits typically take 2-3 months to become automatic. Focus on consistency over perfection."
      },
      {
        question: "How does work-life balance affect health?",
        answer: "Poor work-life balance can lead to chronic stress, burnout, sleep problems, weakened immunity, relationship issues, and increased risk of heart disease and mental health conditions. Setting boundaries and prioritizing rest is essential."
      },
      {
        question: "What lifestyle changes have the biggest health impact?",
        answer: "Quitting smoking, maintaining healthy weight, regular physical activity, eating a balanced diet, limiting alcohol, managing stress, getting adequate sleep, and maintaining social connections have the most significant positive impact on health and longevity."
      },
      {
        question: "How does screen time affect health?",
        answer: "Excessive screen time is linked to eye strain, poor posture, sedentary behavior, sleep disruption (especially before bed), and mental health concerns. Taking regular breaks, using blue light filters, and setting limits can help mitigate effects."
      },
      {
        question: "Is it ever too late to make healthy lifestyle changes?",
        answer: "No, it's never too late. Research shows health benefits from lifestyle changes at any age—quitting smoking, starting exercise, or improving diet can show measurable health improvements even in older adults. Start where you are."
      }
    ]
  }
  
  // Return category-specific FAQs or general health FAQs
  return categoryFAQs[category] || [
    {
      question: "Should I consult a doctor about this health topic?",
      answer: "If you have specific health concerns or symptoms, it's always best to consult a healthcare professional. They can provide personalized advice based on your medical history and current health status."
    },
    {
      question: "Where can I find reliable health information?",
      answer: "Reliable sources include your healthcare provider, reputable medical organizations (CDC, WHO, NIH), academic medical centers, and peer-reviewed research. Be cautious of health claims without scientific backing."
    },
    {
      question: "How do I know if health information is trustworthy?",
      answer: "Look for content from medical professionals or organizations, check if sources are cited, look for recent publication dates, be wary of extreme claims or miracle cures, and verify information across multiple reputable sources."
    },
    {
      question: "Can lifestyle changes help with most health issues?",
      answer: "Healthy lifestyle choices—good nutrition, regular exercise, adequate sleep, stress management—support overall health and can help prevent or manage many conditions. However, they should complement, not replace, professional medical care when needed."
    },
    {
      question: "How often should I have a health check-up?",
      answer: "Most adults should have annual check-ups, though frequency depends on age, health status, and risk factors. Your healthcare provider can recommend an appropriate schedule and which screenings you need based on your individual situation."
    }
  ]
}

