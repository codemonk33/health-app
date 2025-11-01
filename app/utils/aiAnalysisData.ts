interface AnalysisResult {
  possibleCauses: string[];
  basicTreatment: string[];
  whenToSeekDoctor: string[];
  recommendedFoods: string[];
  severity: 'low' | 'medium' | 'high';
}

type BodyPartSymptomKey = `${string}-${string}`;

// Comprehensive AI analysis data for each body part and symptom combination
const aiAnalysisDatabase: Record<string, AnalysisResult> = {
  // ========== EYES SYMPTOMS ==========
  'Eyes-Redness': {
    possibleCauses: [
      'Allergic reaction to environmental factors (pollen, dust, pet dander)',
      'Bacterial or viral conjunctivitis (pink eye)',
      'Dry eye syndrome',
      'Contact lens irritation or overuse',
      'Eye strain from digital devices or reading'
    ],
    basicTreatment: [
      'Apply cool, damp compress to closed eyes for 10-15 minutes',
      'Use over-the-counter artificial tears or lubricating eye drops',
      'Avoid rubbing your eyes',
      'Take frequent breaks from screen time (20-20-20 rule)',
      'Remove contact lenses and clean them properly'
    ],
    whenToSeekDoctor: [
      'Severe pain or vision changes',
      'Symptoms lasting more than 48 hours',
      'Yellow or green discharge',
      'Swelling that affects vision',
      'Fever accompanying symptoms'
    ],
    recommendedFoods: [
      'Foods rich in Vitamin A (carrots, sweet potatoes, leafy greens)',
      'Omega-3 fatty acids (salmon, walnuts, flaxseeds)',
      'Antioxidant-rich foods (berries, citrus fruits)',
      'Zinc-rich foods (nuts, seeds, beans)',
      'Stay hydrated with plenty of water'
    ],
    severity: 'medium'
  },
  'Eyes-Swelling': {
    possibleCauses: [
      'Allergic reaction',
      'Conjunctivitis (pink eye)',
      'Stye or chalazion',
      'Orbital cellulitis (serious infection)',
      'Trauma or injury to the eye area'
    ],
    basicTreatment: [
      'Apply cold compress for 15-20 minutes several times a day',
      'Use antihistamine eye drops if allergic',
      'Avoid touching or rubbing the area',
      'Keep the area clean and dry',
      'Get adequate rest'
    ],
    whenToSeekDoctor: [
      'Severe swelling that affects vision',
      'Eye pain or fever',
      'Swelling spreading to face',
      'Discharge or pus',
      'Recent injury to the area'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods (turmeric, ginger, fatty fish)',
      'Vitamin C rich foods (oranges, bell peppers)',
      'Green leafy vegetables',
      'Reduce salt intake to prevent fluid retention',
      'Stay well hydrated'
    ],
    severity: 'high'
  },
  'Eyes-Discharge': {
    possibleCauses: [
      'Bacterial conjunctivitis',
      'Viral conjunctivitis',
      'Blepharitis (eyelid inflammation)',
      'Blocked tear duct',
      'Dry eye syndrome'
    ],
    basicTreatment: [
      'Gently clean discharge with warm water and clean cloth',
      'Use warm compress to loosen crust',
      'Practice good hygiene - wash hands frequently',
      'Avoid wearing contact lenses until cleared',
      'Apply prescribed antibiotic drops if bacterial'
    ],
    whenToSeekDoctor: [
      'Green or yellow discharge (bacterial infection)',
      'Symptoms persist more than 3 days',
      'Severe eye pain',
      'Vision changes',
      'Fever or general illness'
    ],
    recommendedFoods: [
      'Probiotic foods (yogurt, kefir) for immune support',
      'Vitamin A and C rich foods',
      'Zinc-containing foods',
      'Avoid dairy if it worsens discharge',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Eyes-Dryness': {
    possibleCauses: [
      'Age-related dry eye',
      'Screen time and digital eye strain',
      'Environmental factors (wind, dry air, smoke)',
      'Medications (antihistamines, decongestants)',
      'Medical conditions (Sjögren\'s syndrome, rheumatoid arthritis)'
    ],
    basicTreatment: [
      'Use artificial tears regularly throughout the day',
      'Take breaks using the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds)',
      'Use a humidifier in dry environments',
      'Blink more frequently',
      'Avoid direct air from fans or air conditioning'
    ],
    whenToSeekDoctor: [
      'Persistent dryness despite treatment',
      'Severe eye pain or vision changes',
      'Difficulty keeping eyes open',
      'Dryness affecting daily activities',
      'Symptoms of underlying autoimmune condition'
    ],
    recommendedFoods: [
      'Omega-3 fatty acids (salmon, sardines, walnuts)',
      'Foods rich in Vitamin A',
      'Foods containing lutein and zeaxanthin (spinach, kale, eggs)',
      'Adequate hydration',
      'Flaxseed or chia seeds'
    ],
    severity: 'low'
  },
  'Eyes-Bruising': {
    possibleCauses: [
      'Trauma or injury to the eye area',
      'Surgery or medical procedure',
      'Allergic reaction',
      'Blood clotting disorders',
      'Severe coughing or sneezing'
    ],
    basicTreatment: [
      'Apply cold compress immediately (first 24-48 hours)',
      'Switch to warm compress after 48 hours',
      'Keep head elevated while sleeping',
      'Avoid strenuous activities',
      'Protect eyes from further injury'
    ],
    whenToSeekDoctor: [
      'Vision changes or double vision',
      'Severe pain',
      'Bruising after head injury',
      'Blood in the eye itself',
      'Bruising without apparent cause'
    ],
    recommendedFoods: [
      'Vitamin K rich foods (leafy greens) to support healing',
      'Vitamin C for collagen production',
      'Protein-rich foods for tissue repair',
      'Iron-rich foods if anemia is present',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Eyes-Rash': {
    possibleCauses: [
      'Contact dermatitis from cosmetics or skincare',
      'Atopic dermatitis (eczema)',
      'Allergic reaction',
      'Seborrheic dermatitis',
      'Infectious causes'
    ],
    basicTreatment: [
      'Identify and avoid triggering products',
      'Use gentle, fragrance-free products',
      'Apply cool compress',
      'Keep area clean and dry',
      'Use hypoallergenic moisturizer'
    ],
    whenToSeekDoctor: [
      'Rash spreading rapidly',
      'Severe itching or pain',
      'Signs of infection (pus, fever)',
      'Rash affecting vision',
      'Not improving with basic care'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods rich in Vitamin E',
      'Omega-3 fatty acids',
      'Avoid known allergens',
      'Probiotics for skin health'
    ],
    severity: 'low'
  },

  // ========== HEAD SYMPTOMS ==========
  'Head-Headache': {
    possibleCauses: [
      'Tension headache (most common)',
      'Migraine',
      'Dehydration',
      'Sinus congestion',
      'Stress or anxiety',
      'Lack of sleep',
      'Eye strain'
    ],
    basicTreatment: [
      'Rest in a dark, quiet room',
      'Apply cold or warm compress to forehead',
      'Stay hydrated with water',
      'Practice relaxation techniques',
      'Over-the-counter pain relievers (ibuprofen, acetaminophen)'
    ],
    whenToSeekDoctor: [
      'Severe headache with sudden onset (thunderclap headache)',
      'Headache after head injury',
      'Fever, neck stiffness, or confusion',
      'Headache with vision changes',
      'Persistent headaches despite treatment'
    ],
    recommendedFoods: [
      'Magnesium-rich foods (dark chocolate, nuts, seeds)',
      'Stay hydrated with water',
      'Avoid trigger foods (processed meats, aged cheese)',
      'Ginger tea for anti-inflammatory effects',
      'Regular meals to prevent low blood sugar'
    ],
    severity: 'medium'
  },
  'Head-Dizziness': {
    possibleCauses: [
      'Inner ear problems (vertigo)',
      'Low blood pressure',
      'Dehydration',
      'Anxiety or panic attacks',
      'Medication side effects',
      'Anemia'
    ],
    basicTreatment: [
      'Sit or lie down immediately to prevent falls',
      'Stay hydrated',
      'Move slowly when changing positions',
      'Avoid sudden movements',
      'Deep breathing exercises'
    ],
    whenToSeekDoctor: [
      'Severe dizziness or fainting',
      'Dizziness with chest pain or irregular heartbeat',
      'Persistent dizziness',
      'Dizziness after head injury',
      'Accompanied by hearing loss'
    ],
    recommendedFoods: [
      'Iron-rich foods if anemic (lean meats, spinach, beans)',
      'Stay hydrated',
      'Ginger for nausea',
      'Small, frequent meals',
      'Avoid alcohol and caffeine'
    ],
    severity: 'medium'
  },
  'Head-Tinnitus': {
    possibleCauses: [
      'Hearing loss related to aging',
      'Exposure to loud noise',
      'Earwax buildup',
      'Meniere\'s disease',
      'Medications (aspirin, antibiotics)',
      'Head or neck injuries'
    ],
    basicTreatment: [
      'Use white noise or background sounds to mask ringing',
      'Reduce exposure to loud noises',
      'Manage stress through relaxation techniques',
      'Limit caffeine and alcohol',
      'Get adequate sleep'
    ],
    whenToSeekDoctor: [
      'Tinnitus after head injury',
      'Sudden onset or pulsating tinnitus',
      'Accompanied by dizziness or hearing loss',
      'Severe symptoms affecting daily life',
      'One-sided tinnitus with other symptoms'
    ],
    recommendedFoods: [
      'Foods rich in magnesium (nuts, seeds, leafy greens)',
      'Zinc-containing foods',
      'B-vitamin complex',
      'Reduce sodium intake',
      'Anti-inflammatory foods'
    ],
    severity: 'medium'
  },
  'Head-Migraine': {
    possibleCauses: [
      'Genetic predisposition',
      'Hormonal changes',
      'Certain foods and drinks',
      'Stress and sleep changes',
      'Environmental factors (bright lights, strong smells)',
      'Weather changes'
    ],
    basicTreatment: [
      'Rest in dark, quiet room',
      'Apply cold compress to head',
      'Stay hydrated',
      'Avoid triggers',
      'Prescription migraine medications if available'
    ],
    whenToSeekDoctor: [
      'Frequent migraines (more than 2 per week)',
      'Severe migraine lasting more than 72 hours',
      'Migraine with aura for first time',
      'Migraine after head injury',
      'Neurological symptoms (weakness, speech problems)'
    ],
    recommendedFoods: [
      'Magnesium-rich foods',
      'Riboflavin (Vitamin B2) from dairy and lean meats',
      'Omega-3 fatty acids',
      'Avoid common triggers (caffeine, alcohol, aged cheese)',
      'Regular meal schedule'
    ],
    severity: 'high'
  },
  'Head-Concussion': {
    possibleCauses: [
      'Head injury from falls',
      'Sports-related injuries',
      'Motor vehicle accidents',
      'Physical assault',
      'Blast injuries'
    ],
    basicTreatment: [
      'Rest - both physical and mental',
      'Avoid screens and bright lights',
      'Avoid strenuous activities',
      'Gradual return to normal activities',
      'Stay hydrated'
    ],
    whenToSeekDoctor: [
      'Severe or worsening symptoms',
      'Loss of consciousness',
      'Repeated vomiting',
      'Severe headache',
      'Seizures or convulsions',
      'Any emergency - call 911 immediately'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Omega-3 fatty acids for brain health',
      'Protein for recovery',
      'Foods rich in antioxidants',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Head-Facial Pain': {
    possibleCauses: [
      'Trigeminal neuralgia',
      'Sinusitis',
      'Temporomandibular joint (TMJ) disorders',
      'Dental problems',
      'Migraine',
      'Cluster headaches'
    ],
    basicTreatment: [
      'Apply warm or cold compress',
      'Gentle facial massage',
      'Over-the-counter pain relievers',
      'Rest and relaxation',
      'Avoid triggering movements'
    ],
    whenToSeekDoctor: [
      'Severe or persistent facial pain',
      'Pain with numbness or weakness',
      'Pain after injury',
      'Accompanied by vision or hearing changes',
      'Not responding to basic treatment'
    ],
    recommendedFoods: [
      'Soft foods if TMJ-related',
      'Anti-inflammatory foods',
      'Magnesium-rich foods',
      'Stay hydrated',
      'Avoid foods requiring excessive chewing'
    ],
    severity: 'medium'
  },

  // ========== EARS SYMPTOMS ==========
  'Ears-Earache': {
    possibleCauses: [
      'Ear infection (otitis media)',
      'Swimmer\'s ear (otitis externa)',
      'Earwax buildup',
      'Sinus infection',
      'TMJ disorders',
      'Dental problems'
    ],
    basicTreatment: [
      'Apply warm compress over the ear',
      'Over-the-counter pain relievers',
      'Keep ear dry',
      'Avoid inserting objects in ear',
      'Use ear drops if appropriate'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Fever above 101°F',
      'Drainage from ear',
      'Hearing loss',
      'Pain lasting more than 2 days',
      'Symptoms in child under 6 months'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Probiotic foods for immune support',
      'Zinc-rich foods',
      'Stay hydrated',
      'Avoid dairy if it worsens symptoms'
    ],
    severity: 'medium'
  },
  'Ears-Ear Infection': {
    possibleCauses: [
      'Bacterial infection',
      'Viral infection',
      'Allergies',
      'Upper respiratory infections',
      'Eustachian tube dysfunction',
      'Swimmer\'s ear'
    ],
    basicTreatment: [
      'Apply warm compress',
      'Over-the-counter pain relievers',
      'Keep ear dry',
      'Rest',
      'Stay hydrated'
    ],
    whenToSeekDoctor: [
      'Severe pain or fever',
      'Symptoms in infant',
      'Drainage from ear',
      'Hearing loss',
      'Symptoms lasting more than 48 hours'
    ],
    recommendedFoods: [
      'Probiotic foods',
      'Vitamin C rich foods',
      'Zinc-containing foods',
      'Anti-inflammatory foods',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Ears-Tinnitus': {
    possibleCauses: [
      'Hearing loss',
      'Exposure to loud noise',
      'Earwax buildup',
      'Meniere\'s disease',
      'Medication side effects',
      'Head or neck injuries'
    ],
    basicTreatment: [
      'Use white noise or sound therapy',
      'Reduce exposure to loud noises',
      'Manage stress',
      'Limit caffeine and alcohol',
      'Get adequate sleep'
    ],
    whenToSeekDoctor: [
      'Sudden onset tinnitus',
      'Pulsating tinnitus',
      'Accompanied by dizziness',
      'One-sided tinnitus',
      'Severe symptoms affecting daily life'
    ],
    recommendedFoods: [
      'Magnesium-rich foods',
      'Zinc-containing foods',
      'B-vitamin complex',
      'Reduce sodium intake',
      'Anti-inflammatory foods'
    ],
    severity: 'medium'
  },
  'Ears-Earwax Buildup': {
    possibleCauses: [
      'Natural earwax production',
      'Using cotton swabs (pushes wax deeper)',
      'Hearing aids or earplugs',
      'Narrow ear canals',
      'Age-related changes'
    ],
    basicTreatment: [
      'Use over-the-counter earwax removal drops',
      'Apply warm olive oil or mineral oil',
      'Irrigate ear gently with warm water',
      'Avoid cotton swabs',
      'Let warm shower water run in ear'
    ],
    whenToSeekDoctor: [
      'Severe hearing loss',
      'Ear pain or discomfort',
      'Dizziness',
      'Ringing in ears',
      'Unable to remove wax safely at home'
    ],
    recommendedFoods: [
      'Stay hydrated',
      'Balanced diet',
      'Foods rich in omega-3',
      'Avoid excessive dairy',
      'Regular meals'
    ],
    severity: 'low'
  },
  'Ears-Ear Injury': {
    possibleCauses: [
      'Trauma or blunt force',
      'Inserting objects in ear',
      'Loud noise exposure',
      'Pressure changes',
      'Foreign objects in ear'
    ],
    basicTreatment: [
      'Stop bleeding with gentle pressure',
      'Apply cold compress if swelling',
      'Keep ear dry and clean',
      'Avoid inserting anything in ear',
      'Over-the-counter pain relievers if needed'
    ],
    whenToSeekDoctor: [
      'Severe pain or bleeding',
      'Hearing loss',
      'Drainage from ear',
      'Dizziness or balance problems',
      'Visible deformity'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for tissue repair',
      'Vitamin C for healing',
      'Stay hydrated',
      'Foods rich in zinc'
    ],
    severity: 'high'
  },
  'Ears-Ear Deafness': {
    possibleCauses: [
      'Age-related hearing loss',
      'Noise-induced hearing loss',
      'Ear infections',
      'Earwax buildup',
      'Medications',
      'Genetic factors'
    ],
    basicTreatment: [
      'Use hearing protection in loud environments',
      'Remove earwax if present',
      'Manage underlying conditions',
      'Consider hearing aids',
      'Learn communication strategies'
    ],
    whenToSeekDoctor: [
      'Sudden hearing loss',
      'One-sided hearing loss',
      'Hearing loss with other symptoms',
      'Progressive hearing loss',
      'Need for hearing evaluation'
    ],
    recommendedFoods: [
      'Foods rich in magnesium',
      'Folate-rich foods (leafy greens)',
      'Omega-3 fatty acids',
      'Antioxidant-rich foods',
      'Reduce sodium intake'
    ],
    severity: 'medium'
  },

  // ========== NOSE SYMPTOMS ==========
  'Nose-Nasal Congestion': {
    possibleCauses: [
      'Common cold or flu',
      'Allergies (hay fever)',
      'Sinusitis',
      'Deviated septum',
      'Nasal polyps',
      'Environmental irritants'
    ],
    basicTreatment: [
      'Use saline nasal sprays or rinses',
      'Apply warm compress to face',
      'Use humidifier',
      'Stay hydrated',
      'Over-the-counter decongestants (short-term)'
    ],
    whenToSeekDoctor: [
      'Congestion lasting more than 10 days',
      'Severe sinus pain',
      'Fever',
      'Green or yellow discharge',
      'Bloody discharge'
    ],
    recommendedFoods: [
      'Hot liquids (tea, soup)',
      'Spicy foods (can help clear sinuses)',
      'Foods rich in Vitamin C',
      'Stay hydrated',
      'Probiotic foods'
    ],
    severity: 'low'
  },
  'Nose-Sinus Infection': {
    possibleCauses: [
      'Bacterial or viral infection',
      'Blocked sinuses from cold',
      'Allergies',
      'Nasal polyps',
      'Deviated septum',
      'Immune system problems'
    ],
    basicTreatment: [
      'Use saline nasal rinses',
      'Apply warm compress to face',
      'Use humidifier',
      'Stay hydrated',
      'Over-the-counter decongestants'
    ],
    whenToSeekDoctor: [
      'Symptoms lasting more than 10 days',
      'Severe headache or facial pain',
      'High fever',
      'Thick, colored discharge',
      'Symptoms that worsen'
    ],
    recommendedFoods: [
      'Hot liquids',
      'Probiotic foods',
      'Vitamin C rich foods',
      'Anti-inflammatory foods',
      'Stay well hydrated'
    ],
    severity: 'medium'
  },
  'Nose-Nosebleed': {
    possibleCauses: [
      'Dry air',
      'Nose picking',
      'Nasal congestion',
      'Allergies',
      'Blood-thinning medications',
      'High blood pressure'
    ],
    basicTreatment: [
      'Sit upright and lean forward',
      'Pinch nostrils together for 10-15 minutes',
      'Apply ice pack to bridge of nose',
      'Avoid tilting head back',
      'Keep calm and breathe through mouth'
    ],
    whenToSeekDoctor: [
      'Nosebleed lasting more than 20 minutes',
      'Heavy bleeding',
      'Nosebleed after injury',
      'Frequent nosebleeds',
      'Feeling weak or dizzy'
    ],
    recommendedFoods: [
      'Stay hydrated',
      'Foods rich in Vitamin K (leafy greens)',
      'Iron-rich foods if anemic',
      'Avoid hot/spicy foods immediately after',
      'Cool, soft foods'
    ],
    severity: 'medium'
  },
  'Nose-Nasal Polyps': {
    possibleCauses: [
      'Chronic inflammation',
      'Asthma',
      'Allergic rhinitis',
      'Cystic fibrosis',
      'Recurrent infections',
      'Aspirin sensitivity'
    ],
    basicTreatment: [
      'Nasal corticosteroid sprays',
      'Saline nasal rinses',
      'Avoid irritants',
      'Manage allergies',
      'Use humidifier'
    ],
    whenToSeekDoctor: [
      'Difficulty breathing through nose',
      'Loss of smell or taste',
      'Frequent sinus infections',
      'Sleep problems',
      'Symptoms not improving with treatment'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods rich in antioxidants',
      'Omega-3 fatty acids',
      'Avoid known allergens',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Nose-Nose Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Fights or accidents',
      'Foreign objects in nose'
    ],
    basicTreatment: [
      'Apply ice pack to reduce swelling',
      'Control bleeding (pinch nostrils)',
      'Keep head elevated',
      'Avoid blowing nose',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe bleeding that won\'t stop',
      'Deformed appearance',
      'Difficulty breathing',
      'Clear fluid drainage (possible CSF leak)',
      'Severe pain'
    ],
    recommendedFoods: [
      'Soft foods',
      'Anti-inflammatory foods',
      'Protein for healing',
      'Vitamin C rich foods',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Nose-Nose Deformity': {
    possibleCauses: [
      'Congenital conditions',
      'Previous trauma',
      'Deviated septum',
      'Rhinoplasty complications',
      'Tumors or growths'
    ],
    basicTreatment: [
      'Use saline nasal sprays',
      'Breathe through mouth if needed',
      'Avoid further trauma',
      'Manage breathing difficulties',
      'Consider consultation'
    ],
    whenToSeekDoctor: [
      'Difficulty breathing',
      'Frequent infections',
      'Cosmetic concerns',
      'Sleep problems (sleep apnea)',
      'Need for evaluation'
    ],
    recommendedFoods: [
      'Balanced diet',
      'Stay hydrated',
      'Foods supporting overall health',
      'Avoid allergens',
      'Regular meals'
    ],
    severity: 'medium'
  },

  // ========== MOUTH SYMPTOMS ==========
  'Mouth-Toothache': {
    possibleCauses: [
      'Tooth decay (cavities)',
      'Tooth abscess',
      'Cracked or fractured tooth',
      'Gum disease',
      'Exposed tooth root',
      'Damaged filling'
    ],
    basicTreatment: [
      'Rinse mouth with warm salt water',
      'Apply cold compress to cheek',
      'Over-the-counter pain relievers',
      'Avoid hot, cold, or sweet foods',
      'Use clove oil (natural anesthetic)'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain lasting more than 1-2 days',
      'Fever',
      'Swelling in face or jaw',
      'Difficulty swallowing or breathing'
    ],
    recommendedFoods: [
      'Soft foods (soup, yogurt)',
      'Avoid sugary foods',
      'Cool, lukewarm foods',
      'Calcium-rich foods',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Mouth-Gum Infection': {
    possibleCauses: [
      'Gingivitis',
      'Periodontitis',
      'Bacterial infection',
      'Poor oral hygiene',
      'Weakened immune system',
      'Diabetes'
    ],
    basicTreatment: [
      'Improve oral hygiene (brush and floss)',
      'Rinse with warm salt water',
      'Use antibacterial mouthwash',
      'Apply cold compress if swollen',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe pain or swelling',
      'Pus drainage',
      'Fever',
      'Bleeding that won\'t stop',
      'Symptoms not improving'
    ],
    recommendedFoods: [
      'Soft, nutritious foods',
      'Foods rich in Vitamin C',
      'Probiotic foods',
      'Avoid sugary foods',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Mouth-Bad Breath': {
    possibleCauses: [
      'Poor oral hygiene',
      'Gum disease',
      'Dry mouth',
      'Certain foods (garlic, onions)',
      'Tobacco use',
      'Underlying medical conditions'
    ],
    basicTreatment: [
      'Brush teeth and tongue twice daily',
      'Floss daily',
      'Use mouthwash',
      'Stay hydrated',
      'Chew sugar-free gum'
    ],
    whenToSeekDoctor: [
      'Persistent bad breath despite good hygiene',
      'Bad breath with other symptoms',
      'Signs of gum disease',
      'Dry mouth issues',
      'Need for dental evaluation'
    ],
    recommendedFoods: [
      'Fresh fruits and vegetables',
      'Stay hydrated',
      'Probiotic foods',
      'Avoid strong-smelling foods',
      'Green tea (antimicrobial properties)'
    ],
    severity: 'low'
  },
  'Mouth-Tooth Decay': {
    possibleCauses: [
      'Bacteria in mouth',
      'Frequent consumption of sugary foods',
      'Poor oral hygiene',
      'Dry mouth',
      'Acidic foods and drinks',
      'Lack of fluoride'
    ],
    basicTreatment: [
      'Improve oral hygiene',
      'Use fluoride toothpaste',
      'Reduce sugary food intake',
      'Rinse with fluoride mouthwash',
      'Regular dental check-ups'
    ],
    whenToSeekDoctor: [
      'Visible cavities',
      'Tooth pain or sensitivity',
      'Dark spots on teeth',
      'Need for professional treatment',
      'Preventive care'
    ],
    recommendedFoods: [
      'Calcium-rich foods (dairy, leafy greens)',
      'Foods rich in phosphorus',
      'Vitamin D sources',
      'Limit sugary foods',
      'Water with fluoride'
    ],
    severity: 'medium'
  },
  'Mouth-Tooth Loss': {
    possibleCauses: [
      'Advanced gum disease',
      'Severe tooth decay',
      'Trauma or injury',
      'Genetic conditions',
      'Poor nutrition',
      'Age-related changes'
    ],
    basicTreatment: [
      'Maintain good oral hygiene',
      'Consider dental replacement options',
      'Eat soft foods initially',
      'Practice proper care of remaining teeth',
      'Regular dental visits'
    ],
    whenToSeekDoctor: [
      'Recent tooth loss',
      'Pain or infection',
      'Need for replacement options',
      'Difficulty eating or speaking',
      'Cosmetic concerns'
    ],
    recommendedFoods: [
      'Soft, nutritious foods',
      'Calcium and vitamin D rich foods',
      'Protein for healing',
      'Easy-to-chew foods',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Mouth-Mouth Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Burns from hot food/drinks',
      'Biting tongue or cheek',
      'Sports injuries',
      'Dental procedures'
    ],
    basicTreatment: [
      'Apply cold compress',
      'Rinse with salt water',
      'Use ice for swelling',
      'Apply pressure for bleeding',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe bleeding that won\'t stop',
      'Large cuts or lacerations',
      'Broken teeth',
      'Signs of infection',
      'Difficulty swallowing'
    ],
    recommendedFoods: [
      'Soft, cool foods',
      'Avoid spicy or acidic foods',
      'Nutritious smoothies',
      'Stay hydrated',
      'Protein for healing'
    ],
    severity: 'medium'
  },

  // ========== NECK SYMPTOMS ==========
  'Neck-Neck Pain': {
    possibleCauses: [
      'Muscle strain or tension',
      'Poor posture',
      'Whiplash injury',
      'Osteoarthritis',
      'Herniated disc',
      'Stress'
    ],
    basicTreatment: [
      'Apply ice for first 48 hours, then heat',
      'Gentle neck stretches',
      'Over-the-counter pain relievers',
      'Improve posture',
      'Use supportive pillow'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain after injury',
      'Numbness or tingling in arms',
      'Weakness in arms or hands',
      'Pain lasting more than a week'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Magnesium-rich foods',
      'Calcium for bone health',
      'Protein for muscle health',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Neck-Whiplash': {
    possibleCauses: [
      'Motor vehicle accidents',
      'Sports injuries',
      'Falls',
      'Physical assault',
      'Sudden acceleration/deceleration'
    ],
    basicTreatment: [
      'Apply ice initially, then heat',
      'Gentle range of motion exercises',
      'Over-the-counter pain relievers',
      'Physical therapy',
      'Use supportive collar if recommended'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Neck pain after accident',
      'Numbness or tingling',
      'Weakness in limbs',
      'Dizziness or confusion'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Omega-3 fatty acids',
      'Protein for healing',
      'Foods rich in antioxidants',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Neck-Neck Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Motor vehicle accidents',
      'Workplace accidents'
    ],
    basicTreatment: [
      'Immobilize neck if spinal injury suspected',
      'Apply ice to reduce swelling',
      'Seek immediate medical attention',
      'Don\'t move if severe injury suspected',
      'Call emergency services if needed'
    ],
    whenToSeekDoctor: [
      'Any neck injury - seek immediate care',
      'Severe pain',
      'Numbness or paralysis',
      'Difficulty moving',
      'Emergency - call 911'
    ],
    recommendedFoods: [
      'As recommended by healthcare provider',
      'Anti-inflammatory foods',
      'Protein for recovery',
      'Stay hydrated',
      'Nutritious, easy-to-eat foods'
    ],
    severity: 'high'
  },
  'Neck-Neck Swelling': {
    possibleCauses: [
      'Enlarged lymph nodes',
      'Infection',
      'Thyroid problems',
      'Injury or trauma',
      'Allergic reaction',
      'Tumors'
    ],
    basicTreatment: [
      'Apply warm compress',
      'Gargle with salt water if throat related',
      'Rest',
      'Stay hydrated',
      'Over-the-counter pain relievers if needed'
    ],
    whenToSeekDoctor: [
      'Sudden or severe swelling',
      'Difficulty breathing or swallowing',
      'Fever',
      'Swelling that persists',
      'Accompanied by other symptoms'
    ],
    recommendedFoods: [
      'Soft, easy-to-swallow foods',
      'Anti-inflammatory foods',
      'Probiotic foods if infection',
      'Stay hydrated',
      'Warm liquids'
    ],
    severity: 'high'
  },
  'Neck-Neck Stiffness': {
    possibleCauses: [
      'Muscle strain',
      'Poor sleep position',
      'Arthritis',
      'Meningitis (serious)',
      'Injury',
      'Stress'
    ],
    basicTreatment: [
      'Gentle stretching exercises',
      'Apply heat',
      'Massage',
      'Improve sleep position',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Stiffness with fever and headache (possible meningitis)',
      'Severe stiffness',
      'Stiffness after injury',
      'Numbness or weakness',
      'Not improving'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Magnesium-rich foods',
      'Foods supporting flexibility',
      'Stay hydrated',
      'Regular meals'
    ],
    severity: 'medium'
  },
  'Neck-Neck Lump': {
    possibleCauses: [
      'Enlarged lymph nodes',
      'Thyroid nodules',
      'Lipoma (fatty growth)',
      'Infection',
      'Tumor (benign or malignant)',
      'Cyst'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if infection',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Lump with other symptoms',
      'Difficulty swallowing or breathing',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },

  // ========== CHEST SYMPTOMS ==========
  'Chest-Chest Pain': {
    possibleCauses: [
      'Muscle strain',
      'Acid reflux or heartburn',
      'Anxiety or panic attacks',
      'Costochondritis (chest wall inflammation)',
      'Heart-related issues (angina, heart attack)',
      'Pulmonary conditions'
    ],
    basicTreatment: [
      'Rest and avoid strenuous activities',
      'Apply warm or cold compress',
      'Practice deep breathing',
      'Over-the-counter antacids if heartburn-related',
      'Relaxation techniques if anxiety-related'
    ],
    whenToSeekDoctor: [
      'Severe chest pain or pressure',
      'Pain radiating to arm, jaw, or back',
      'Shortness of breath',
      'Nausea, sweating, or dizziness',
      'Chest pain with exertion',
      'Emergency - call 911 immediately'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in saturated fat',
      'Whole grains and fiber',
      'Lean proteins',
      'Avoid large meals before bed'
    ],
    severity: 'high'
  },
  'Chest-Heart Attack': {
    possibleCauses: [
      'Blocked coronary arteries',
      'Blood clot',
      'Coronary artery disease',
      'Risk factors (smoking, diabetes, high blood pressure)'
    ],
    basicTreatment: [
      'EMERGENCY - Call 911 immediately',
      'Chew aspirin if not allergic',
      'Stay calm and still',
      'Loosen tight clothing',
      'Wait for emergency medical services'
    ],
    whenToSeekDoctor: [
      'THIS IS AN EMERGENCY',
      'Call 911 immediately',
      'Do not delay',
      'Symptoms: chest pressure, shortness of breath, nausea, sweating'
    ],
    recommendedFoods: [
      'As directed by healthcare provider after treatment',
      'Heart-healthy diet',
      'Low sodium, low saturated fat',
      'Whole grains, fruits, vegetables',
      'Follow medical recommendations'
    ],
    severity: 'high'
  },
  'Chest-Breathing Difficulties': {
    possibleCauses: [
      'Asthma',
      'Chronic obstructive pulmonary disease (COPD)',
      'Anxiety or panic attacks',
      'Pneumonia',
      'Heart conditions',
      'Allergic reactions'
    ],
    basicTreatment: [
      'Sit upright',
      'Practice deep breathing exercises',
      'Use inhaler if prescribed',
      'Remove triggers if allergic',
      'Stay calm'
    ],
    whenToSeekDoctor: [
      'Severe difficulty breathing',
      'Rapid breathing',
      'Blue lips or nails',
      'Chest pain',
      'Emergency - call 911',
      'First episode of severe breathing difficulty'
    ],
    recommendedFoods: [
      'Foods supporting lung health',
      'Anti-inflammatory foods',
      'Omega-3 fatty acids',
      'Avoid foods that trigger allergies',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Chest-Chest Injury': {
    possibleCauses: [
      'Blunt force trauma',
      'Falls',
      'Motor vehicle accidents',
      'Sports injuries',
      'Rib fractures',
      'Collapsed lung'
    ],
    basicTreatment: [
      'Rest',
      'Apply ice to reduce swelling',
      'Avoid strenuous activities',
      'Use pain relievers as directed',
      'Support injured area'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Difficulty breathing',
      'Chest pain after injury',
      'Visible deformity',
      'Emergency - call 911 if severe'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for healing',
      'Foods rich in calcium (if rib fracture)',
      'Stay hydrated',
      'Easy-to-digest foods'
    ],
    severity: 'high'
  },
  'Chest-Chest Lump': {
    possibleCauses: [
      'Benign growth (lipoma, cyst)',
      'Muscle injury or hematoma',
      'Breast tissue changes',
      'Infection or abscess',
      'Tumor (benign or malignant)',
      'Rib abnormalities'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },
  'Chest-Chest Swelling': {
    possibleCauses: [
      'Inflammation',
      'Injury or trauma',
      'Infection',
      'Allergic reaction',
      'Fluid accumulation',
      'Heart or lung conditions'
    ],
    basicTreatment: [
      'Apply cold compress',
      'Rest',
      'Elevate if possible',
      'Over-the-counter anti-inflammatories',
      'Monitor for changes'
    ],
    whenToSeekDoctor: [
      'Severe swelling',
      'Difficulty breathing',
      'Swelling with chest pain',
      'Rapid swelling',
      'Accompanied by fever'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in sodium',
      'Stay hydrated',
      'Diuretic foods (if recommended)',
      'Balanced nutrition'
    ],
    severity: 'high'
  },

  // ========== STOMACH SYMPTOMS ==========
  'Stomach-Stomachache': {
    possibleCauses: [
      'Indigestion',
      'Food poisoning or infection',
      'Gas and bloating',
      'Constipation',
      'Irritable bowel syndrome',
      'Gastritis or ulcers'
    ],
    basicTreatment: [
      'Rest and avoid eating temporarily',
      'Sip clear fluids (water, broth)',
      'Apply warm compress to abdomen',
      'Avoid dairy, fatty, or spicy foods',
      'Try ginger tea or peppermint tea'
    ],
    whenToSeekDoctor: [
      'Severe or persistent pain',
      'Pain with fever',
      'Blood in vomit or stool',
      'Signs of dehydration',
      'Pain lasting more than 2-3 days'
    ],
    recommendedFoods: [
      'BRAT diet (bananas, rice, applesauce, toast)',
      'Clear broths',
      'Probiotic foods',
      'Ginger tea',
      'Avoid spicy, fatty, or dairy foods initially'
    ],
    severity: 'medium'
  },
  'Stomach-Indigestion': {
    possibleCauses: [
      'Overeating',
      'Eating too quickly',
      'Fatty or spicy foods',
      'Stress',
      'Certain medications',
      'Underlying digestive conditions'
    ],
    basicTreatment: [
      'Avoid lying down immediately after eating',
      'Eat smaller, more frequent meals',
      'Avoid trigger foods',
      'Over-the-counter antacids',
      'Reduce stress'
    ],
    whenToSeekDoctor: [
      'Frequent or severe indigestion',
      'Weight loss',
      'Difficulty swallowing',
      'Persistent vomiting',
      'Blood in vomit or stool'
    ],
    recommendedFoods: [
      'Small, frequent meals',
      'Low-fat foods',
      'Avoid spicy foods',
      'Ginger tea',
      'Probiotic foods'
    ],
    severity: 'low'
  },
  'Stomach-Heartburn': {
    possibleCauses: [
      'Gastroesophageal reflux disease (GERD)',
      'Hiatal hernia',
      'Certain foods and drinks',
      'Overeating',
      'Pregnancy',
      'Obesity'
    ],
    basicTreatment: [
      'Avoid trigger foods (spicy, fatty, acidic)',
      'Eat smaller meals',
      'Don\'t lie down after eating',
      'Elevate head while sleeping',
      'Over-the-counter antacids'
    ],
    whenToSeekDoctor: [
      'Frequent or severe heartburn',
      'Heartburn with chest pain',
      'Difficulty swallowing',
      'Persistent symptoms',
      'Symptoms affecting sleep'
    ],
    recommendedFoods: [
      'Alkaline foods (bananas, melons)',
      'Oatmeal',
      'Lean proteins',
      'Non-citrus fruits',
      'Avoid trigger foods'
    ],
    severity: 'medium'
  },
  'Stomach-Stomach Infection': {
    possibleCauses: [
      'Bacterial infection (H. pylori, E. coli)',
      'Viral gastroenteritis',
      'Food poisoning',
      'Contaminated food or water',
      'Weakened immune system'
    ],
    basicTreatment: [
      'Rest',
      'Stay hydrated (clear fluids)',
      'Avoid solid foods initially',
      'Gradually reintroduce bland foods',
      'Wash hands frequently'
    ],
    whenToSeekDoctor: [
      'Severe symptoms',
      'High fever',
      'Signs of dehydration',
      'Blood in vomit or stool',
      'Symptoms lasting more than 2-3 days'
    ],
    recommendedFoods: [
      'BRAT diet',
      'Clear broths',
      'Electrolyte solutions',
      'Probiotic foods (after acute phase)',
      'Avoid dairy initially'
    ],
    severity: 'high'
  },
  'Stomach-Stomach Ulcer': {
    possibleCauses: [
      'H. pylori infection',
      'Long-term use of NSAIDs',
      'Excessive alcohol consumption',
      'Smoking',
      'Stress (may worsen)',
      'Genetic factors'
    ],
    basicTreatment: [
      'Avoid NSAIDs if possible',
      'Avoid spicy and acidic foods',
      'Eat smaller, frequent meals',
      'Reduce stress',
      'Avoid alcohol and smoking'
    ],
    whenToSeekDoctor: [
      'Severe abdominal pain',
      'Dark or bloody stools',
      'Vomiting blood',
      'Unexplained weight loss',
      'Persistent symptoms'
    ],
    recommendedFoods: [
      'High-fiber foods',
      'Probiotic foods',
      'Foods rich in flavonoids',
      'Avoid spicy, acidic, or fried foods',
      'Small, frequent meals'
    ],
    severity: 'high'
  },
  'Stomach-Stomach Lump': {
    possibleCauses: [
      'Hernia',
      'Abdominal mass',
      'Constipation (hard stool)',
      'Organ enlargement',
      'Tumor (benign or malignant)',
      'Cyst'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Maintain regular bowel movements',
      'Don\'t attempt to manipulate',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'High-fiber foods',
      'Plenty of fluids',
      'Balanced, nutritious diet',
      'Foods supporting digestive health',
      'Probiotic foods'
    ],
    severity: 'high'
  },

  // ========== ARM SYMPTOMS (Left & Right Arm use same data) ==========
  'Left Arm-Arm Pain': {
    possibleCauses: [
      'Muscle strain or overuse',
      'Tendonitis',
      'Arthritis',
      'Nerve compression',
      'Injury or trauma',
      'Poor posture'
    ],
    basicTreatment: [
      'Rest the arm',
      'Apply ice for first 48 hours, then heat',
      'Over-the-counter pain relievers',
      'Gentle stretching',
      'Avoid repetitive motions'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain after injury',
      'Numbness or tingling',
      'Weakness in arm',
      'Pain lasting more than a week'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for muscle health',
      'Magnesium-rich foods',
      'Calcium for bone health',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Right Arm-Arm Pain': {
    possibleCauses: [
      'Muscle strain or overuse',
      'Tendonitis',
      'Arthritis',
      'Nerve compression',
      'Injury or trauma',
      'Poor posture'
    ],
    basicTreatment: [
      'Rest the arm',
      'Apply ice for first 48 hours, then heat',
      'Over-the-counter pain relievers',
      'Gentle stretching',
      'Avoid repetitive motions'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain after injury',
      'Numbness or tingling',
      'Weakness in arm',
      'Pain lasting more than a week'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for muscle health',
      'Magnesium-rich foods',
      'Calcium for bone health',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Left Arm-Arm Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Overuse injuries',
      'Fractures or sprains'
    ],
    basicTreatment: [
      'RICE method (Rest, Ice, Compression, Elevation)',
      'Immobilize if fracture suspected',
      'Apply ice for 20 minutes several times daily',
      'Elevate arm above heart level',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Visible deformity',
      'Unable to move arm',
      'Numbness or tingling',
      'Severe swelling'
    ],
    recommendedFoods: [
      'Protein for healing',
      'Calcium and Vitamin D (if fracture)',
      'Anti-inflammatory foods',
      'Foods rich in Vitamin C',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Right Arm-Arm Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Overuse injuries',
      'Fractures or sprains'
    ],
    basicTreatment: [
      'RICE method (Rest, Ice, Compression, Elevation)',
      'Immobilize if fracture suspected',
      'Apply ice for 20 minutes several times daily',
      'Elevate arm above heart level',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Visible deformity',
      'Unable to move arm',
      'Numbness or tingling',
      'Severe swelling'
    ],
    recommendedFoods: [
      'Protein for healing',
      'Calcium and Vitamin D (if fracture)',
      'Anti-inflammatory foods',
      'Foods rich in Vitamin C',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Left Arm-Arm Swelling': {
    possibleCauses: [
      'Injury or trauma',
      'Infection',
      'Lymphedema',
      'Allergic reaction',
      'Arthritis',
      'Blood clot'
    ],
    basicTreatment: [
      'Elevate arm above heart level',
      'Apply ice if injury-related',
      'Apply warm compress if infection',
      'Avoid tight clothing or jewelry',
      'Gentle movement if possible'
    ],
    whenToSeekDoctor: [
      'Sudden or severe swelling',
      'Swelling with pain',
      'Fever',
      'Red streaks on skin',
      'Difficulty moving arm'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in sodium',
      'Stay hydrated',
      'Diuretic foods (if appropriate)',
      'Foods supporting circulation'
    ],
    severity: 'medium'
  },
  'Right Arm-Arm Swelling': {
    possibleCauses: [
      'Injury or trauma',
      'Infection',
      'Lymphedema',
      'Allergic reaction',
      'Arthritis',
      'Blood clot'
    ],
    basicTreatment: [
      'Elevate arm above heart level',
      'Apply ice if injury-related',
      'Apply warm compress if infection',
      'Avoid tight clothing or jewelry',
      'Gentle movement if possible'
    ],
    whenToSeekDoctor: [
      'Sudden or severe swelling',
      'Swelling with pain',
      'Fever',
      'Red streaks on skin',
      'Difficulty moving arm'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in sodium',
      'Stay hydrated',
      'Diuretic foods (if appropriate)',
      'Foods supporting circulation'
    ],
    severity: 'medium'
  },
  'Left Arm-Arm Numbness': {
    possibleCauses: [
      'Nerve compression',
      'Cervical radiculopathy',
      'Carpal tunnel syndrome',
      'Poor circulation',
      'Diabetes',
      'Pinched nerve'
    ],
    basicTreatment: [
      'Change position frequently',
      'Gentle stretching',
      'Improve posture',
      'Avoid pressure on nerve',
      'Manage underlying conditions'
    ],
    whenToSeekDoctor: [
      'Persistent numbness',
      'Numbness after injury',
      'Accompanied by weakness',
      'Affecting daily activities',
      'Need for evaluation'
    ],
    recommendedFoods: [
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Foods supporting nerve health',
      'Omega-3 fatty acids',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Right Arm-Arm Numbness': {
    possibleCauses: [
      'Nerve compression',
      'Cervical radiculopathy',
      'Carpal tunnel syndrome',
      'Poor circulation',
      'Diabetes',
      'Pinched nerve'
    ],
    basicTreatment: [
      'Change position frequently',
      'Gentle stretching',
      'Improve posture',
      'Avoid pressure on nerve',
      'Manage underlying conditions'
    ],
    whenToSeekDoctor: [
      'Persistent numbness',
      'Numbness after injury',
      'Accompanied by weakness',
      'Affecting daily activities',
      'Need for evaluation'
    ],
    recommendedFoods: [
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Foods supporting nerve health',
      'Omega-3 fatty acids',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Left Arm-Arm Lump': {
    possibleCauses: [
      'Lipoma (fatty growth)',
      'Cyst',
      'Hematoma (blood collection)',
      'Abscess',
      'Tumor (benign or malignant)',
      'Enlarged lymph node'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },
  'Right Arm-Arm Lump': {
    possibleCauses: [
      'Lipoma (fatty growth)',
      'Cyst',
      'Hematoma (blood collection)',
      'Abscess',
      'Tumor (benign or malignant)',
      'Enlarged lymph node'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },
  'Left Arm-Arm Weakness': {
    possibleCauses: [
      'Nerve compression',
      'Muscle strain or injury',
      'Stroke (serious)',
      'Arthritis',
      'Nerve damage',
      'Underlying medical conditions'
    ],
    basicTreatment: [
      'Rest the arm',
      'Gentle exercises as tolerated',
      'Physical therapy',
      'Address underlying causes',
      'Avoid overuse'
    ],
    whenToSeekDoctor: [
      'Sudden weakness (possible stroke - call 911)',
      'Weakness after injury',
      'Progressive weakness',
      'Accompanied by numbness',
      'Affecting daily activities'
    ],
    recommendedFoods: [
      'Protein for muscle health',
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Omega-3 fatty acids',
      'Balanced nutrition'
    ],
    severity: 'high'
  },
  'Right Arm-Arm Weakness': {
    possibleCauses: [
      'Nerve compression',
      'Muscle strain or injury',
      'Stroke (serious)',
      'Arthritis',
      'Nerve damage',
      'Underlying medical conditions'
    ],
    basicTreatment: [
      'Rest the arm',
      'Gentle exercises as tolerated',
      'Physical therapy',
      'Address underlying causes',
      'Avoid overuse'
    ],
    whenToSeekDoctor: [
      'Sudden weakness (possible stroke - call 911)',
      'Weakness after injury',
      'Progressive weakness',
      'Accompanied by numbness',
      'Affecting daily activities'
    ],
    recommendedFoods: [
      'Protein for muscle health',
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Omega-3 fatty acids',
      'Balanced nutrition'
    ],
    severity: 'high'
  },

  // ========== LEG SYMPTOMS (Left & Right Leg use same data) ==========
  'Left Leg-Leg Pain': {
    possibleCauses: [
      'Muscle strain or cramp',
      'Overuse injury',
      'Arthritis',
      'Nerve compression',
      'Poor circulation',
      'Injury or trauma'
    ],
    basicTreatment: [
      'Rest and elevate leg',
      'Apply ice for first 48 hours, then heat',
      'Over-the-counter pain relievers',
      'Gentle stretching',
      'Avoid activities that worsen pain'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain after injury',
      'Swelling, redness, or warmth',
      'Difficulty walking',
      'Pain lasting more than a week'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for muscle health',
      'Magnesium-rich foods (helps with cramps)',
      'Potassium-rich foods',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Right Leg-Leg Pain': {
    possibleCauses: [
      'Muscle strain or cramp',
      'Overuse injury',
      'Arthritis',
      'Nerve compression',
      'Poor circulation',
      'Injury or trauma'
    ],
    basicTreatment: [
      'Rest and elevate leg',
      'Apply ice for first 48 hours, then heat',
      'Over-the-counter pain relievers',
      'Gentle stretching',
      'Avoid activities that worsen pain'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Pain after injury',
      'Swelling, redness, or warmth',
      'Difficulty walking',
      'Pain lasting more than a week'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Protein for muscle health',
      'Magnesium-rich foods (helps with cramps)',
      'Potassium-rich foods',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Left Leg-Leg Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Overuse',
      'Fractures or sprains',
      'Strains or tears'
    ],
    basicTreatment: [
      'RICE method (Rest, Ice, Compression, Elevation)',
      'Immobilize if fracture suspected',
      'Apply ice for 20 minutes several times daily',
      'Elevate leg above heart level',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Visible deformity',
      'Unable to bear weight',
      'Numbness or tingling',
      'Severe swelling'
    ],
    recommendedFoods: [
      'Protein for healing',
      'Calcium and Vitamin D (if fracture)',
      'Anti-inflammatory foods',
      'Foods rich in Vitamin C',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Right Leg-Leg Injury': {
    possibleCauses: [
      'Trauma or impact',
      'Falls',
      'Sports injuries',
      'Overuse',
      'Fractures or sprains',
      'Strains or tears'
    ],
    basicTreatment: [
      'RICE method (Rest, Ice, Compression, Elevation)',
      'Immobilize if fracture suspected',
      'Apply ice for 20 minutes several times daily',
      'Elevate leg above heart level',
      'Over-the-counter pain relievers'
    ],
    whenToSeekDoctor: [
      'Severe pain',
      'Visible deformity',
      'Unable to bear weight',
      'Numbness or tingling',
      'Severe swelling'
    ],
    recommendedFoods: [
      'Protein for healing',
      'Calcium and Vitamin D (if fracture)',
      'Anti-inflammatory foods',
      'Foods rich in Vitamin C',
      'Stay hydrated'
    ],
    severity: 'high'
  },
  'Left Leg-Leg Swelling': {
    possibleCauses: [
      'Injury or trauma',
      'Infection',
      'Deep vein thrombosis (DVT - serious)',
      'Poor circulation',
      'Heart or kidney problems',
      'Lymphedema'
    ],
    basicTreatment: [
      'Elevate leg above heart level',
      'Apply ice if injury-related',
      'Apply warm compress if infection',
      'Avoid sitting or standing for long periods',
      'Gentle movement'
    ],
    whenToSeekDoctor: [
      'Sudden or severe swelling',
      'Swelling with pain or warmth',
      'Swelling in one leg only (possible DVT)',
      'Fever',
      'Difficulty breathing (emergency)'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in sodium',
      'Stay hydrated',
      'Diuretic foods (if appropriate)',
      'Foods supporting circulation'
    ],
    severity: 'high'
  },
  'Right Leg-Leg Swelling': {
    possibleCauses: [
      'Injury or trauma',
      'Infection',
      'Deep vein thrombosis (DVT - serious)',
      'Poor circulation',
      'Heart or kidney problems',
      'Lymphedema'
    ],
    basicTreatment: [
      'Elevate leg above heart level',
      'Apply ice if injury-related',
      'Apply warm compress if infection',
      'Avoid sitting or standing for long periods',
      'Gentle movement'
    ],
    whenToSeekDoctor: [
      'Sudden or severe swelling',
      'Swelling with pain or warmth',
      'Swelling in one leg only (possible DVT)',
      'Fever',
      'Difficulty breathing (emergency)'
    ],
    recommendedFoods: [
      'Anti-inflammatory foods',
      'Foods low in sodium',
      'Stay hydrated',
      'Diuretic foods (if appropriate)',
      'Foods supporting circulation'
    ],
    severity: 'high'
  },
  'Left Leg-Leg Numbness': {
    possibleCauses: [
      'Nerve compression',
      'Sciatica',
      'Peripheral neuropathy',
      'Poor circulation',
      'Diabetes',
      'Pinched nerve'
    ],
    basicTreatment: [
      'Change position frequently',
      'Gentle stretching',
      'Improve posture',
      'Avoid pressure on nerve',
      'Manage underlying conditions'
    ],
    whenToSeekDoctor: [
      'Persistent numbness',
      'Numbness after injury',
      'Accompanied by weakness',
      'Affecting walking',
      'Need for evaluation'
    ],
    recommendedFoods: [
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Foods supporting nerve health',
      'Omega-3 fatty acids',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Right Leg-Leg Numbness': {
    possibleCauses: [
      'Nerve compression',
      'Sciatica',
      'Peripheral neuropathy',
      'Poor circulation',
      'Diabetes',
      'Pinched nerve'
    ],
    basicTreatment: [
      'Change position frequently',
      'Gentle stretching',
      'Improve posture',
      'Avoid pressure on nerve',
      'Manage underlying conditions'
    ],
    whenToSeekDoctor: [
      'Persistent numbness',
      'Numbness after injury',
      'Accompanied by weakness',
      'Affecting walking',
      'Need for evaluation'
    ],
    recommendedFoods: [
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Foods supporting nerve health',
      'Omega-3 fatty acids',
      'Stay hydrated'
    ],
    severity: 'medium'
  },
  'Left Leg-Leg Lump': {
    possibleCauses: [
      'Lipoma (fatty growth)',
      'Cyst',
      'Hematoma (blood collection)',
      'Abscess',
      'Tumor (benign or malignant)',
      'Enlarged lymph node'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },
  'Right Leg-Leg Lump': {
    possibleCauses: [
      'Lipoma (fatty growth)',
      'Cyst',
      'Hematoma (blood collection)',
      'Abscess',
      'Tumor (benign or malignant)',
      'Enlarged lymph node'
    ],
    basicTreatment: [
      'Monitor for changes',
      'Apply warm compress if inflammation',
      'Don\'t attempt to remove',
      'Keep area clean',
      'Seek medical evaluation'
    ],
    whenToSeekDoctor: [
      'Any new lump should be evaluated',
      'Lump that grows or changes',
      'Painful lump',
      'Accompanied by other symptoms',
      'Need for professional assessment'
    ],
    recommendedFoods: [
      'Balanced, nutritious diet',
      'Foods supporting immune system',
      'Anti-inflammatory foods',
      'Stay hydrated',
      'Foods rich in antioxidants'
    ],
    severity: 'high'
  },
  'Left Leg-Leg Weakness': {
    possibleCauses: [
      'Muscle strain or injury',
      'Nerve compression',
      'Stroke (serious)',
      'Arthritis',
      'Nerve damage',
      'Underlying medical conditions'
    ],
    basicTreatment: [
      'Rest the leg',
      'Gentle exercises as tolerated',
      'Physical therapy',
      'Address underlying causes',
      'Use assistive devices if needed'
    ],
    whenToSeekDoctor: [
      'Sudden weakness (possible stroke - call 911)',
      'Weakness after injury',
      'Progressive weakness',
      'Accompanied by numbness',
      'Affecting ability to walk'
    ],
    recommendedFoods: [
      'Protein for muscle health',
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Omega-3 fatty acids',
      'Balanced nutrition'
    ],
    severity: 'high'
  },
  'Right Leg-Leg Weakness': {
    possibleCauses: [
      'Muscle strain or injury',
      'Nerve compression',
      'Stroke (serious)',
      'Arthritis',
      'Nerve damage',
      'Underlying medical conditions'
    ],
    basicTreatment: [
      'Rest the leg',
      'Gentle exercises as tolerated',
      'Physical therapy',
      'Address underlying causes',
      'Use assistive devices if needed'
    ],
    whenToSeekDoctor: [
      'Sudden weakness (possible stroke - call 911)',
      'Weakness after injury',
      'Progressive weakness',
      'Accompanied by numbness',
      'Affecting ability to walk'
    ],
    recommendedFoods: [
      'Protein for muscle health',
      'B-vitamin complex',
      'Magnesium-rich foods',
      'Omega-3 fatty acids',
      'Balanced nutrition'
    ],
    severity: 'high'
  },
};

// Helper function to get analysis for a specific body part and symptom
export function getAnalysisForSymptom(bodyPart: string, symptom: string): AnalysisResult {
  const key = `${bodyPart}-${symptom}`;
  const analysis = aiAnalysisDatabase[key];
  
  if (analysis) {
    return analysis;
  }
  
  // Default analysis if specific combination not found
  return {
    possibleCauses: [
      `Possible causes related to ${bodyPart}`,
      'May require medical evaluation',
      'Could be related to underlying condition',
      'Consult healthcare provider for proper diagnosis'
    ],
    basicTreatment: [
      'Rest the affected area',
      'Monitor symptoms closely',
      'Apply basic first aid if appropriate',
      'Stay hydrated',
      'Seek medical attention if symptoms persist'
    ],
    whenToSeekDoctor: [
      'Symptoms persist or worsen',
      'Severe pain or discomfort',
      'Accompanied by fever',
      'Affecting daily activities',
      'Any concerning symptoms'
    ],
    recommendedFoods: [
      'Balanced diet with fruits and vegetables',
      'Stay hydrated',
      'Avoid processed foods',
      'Anti-inflammatory foods',
      'Foods rich in vitamins and minerals'
    ],
    severity: 'medium'
  };
}

export type { AnalysisResult };
export default aiAnalysisDatabase;
