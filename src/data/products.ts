import { Product } from '../types';

import headphonesImg from '../assets/images/hero_neural_headphones_1790218484981.jpg';
import smartwatchImg from '../assets/images/cyber_smartwatch_holo_1790218497558.jpg';
import sneakerImg from '../assets/images/cyber_sneaker_pulse_1790218510476.jpg';
import gamingDeckImg from '../assets/images/quantum_gaming_deck_1790218523742.jpg';
import hoverDroneImg from '../assets/images/drone_hover_camera_1790218539245.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'nx-01',
    name: 'Aetheris Neural Soundscape Pro',
    tagline: 'Spatial synaptic audio with zero acoustic latency',
    category: 'TECH',
    price: 24999,
    originalPrice: 32999,
    discountPercentage: 24,
    rating: 4.9,
    reviewsCount: 428,
    image: headphonesImg,
    badge: 'BEST SELLER',
    isDrop: false,
    colors: [
      { name: 'Obsidian Black', hex: '#0B0D17' },
      { name: 'Cyber Violet', hex: '#8B5CF6' },
      { name: 'Neon Cyan', hex: '#06B6D4' }
    ],
    specs: [
      { label: 'Driver Tech', value: '50mm Graphene Synaptic' },
      { label: 'Battery Life', value: '72 Hours with Neural ANC' },
      { label: 'Wireless Protocol', value: 'Sub-millisecond LiFi 6' },
      { label: 'Weight', value: '235g Aerospace Titanium' }
    ],
    description:
      'Engineered for acoustic transcendence. The Aetheris Pro syncs directly with auditory nerve responses, delivering ultra-wide spatial staging and active holographic noise dampening.',
    features: [
      'Neural Wavefront Phase Alignment',
      'Lossless 192kHz / 32-bit streaming over direct LiFi',
      'Dual MEMS haptic transducer for sub-bass physical sensation',
      'Bespoke liquid-silicone ear cushions with thermo-cooling'
    ]
  },
  {
    id: 'nx-02',
    name: 'Chronos Holographic Smartwatch',
    tagline: 'Floating photonic HUD on an aerospace titanium frame',
    category: 'ACCESSORIES',
    price: 38499,
    originalPrice: 45999,
    discountPercentage: 16,
    rating: 4.95,
    reviewsCount: 312,
    image: smartwatchImg,
    badge: 'TRENDING',
    isDrop: false,
    colors: [
      { name: 'Titanium Raw', hex: '#71717A' },
      { name: 'Laser Blue', hex: '#0284C7' },
      { name: 'Phantom Dark', hex: '#18181B' }
    ],
    specs: [
      { label: 'Display', value: '1.9" Micro-LED + Photonic Ring' },
      { label: 'Casing', value: 'Grade 5 Aerospace Titanium' },
      { label: 'Sensors', value: 'ECG, Bio-Impedance, V02 Max' },
      { label: 'Water Rating', value: '10 ATM Pressure Sealed' }
    ],
    description:
      'The pinnacle of personal cybernetics. The Chronos projects a crisp 3D holographic telemetry orbit above the crystal dial, providing real-time vital tracking and encrypted comms.',
    features: [
      'Volumetric micro-photonic interface projection',
      'Quantum-encrypted biometric locker',
      'Self-charging kinetic piezo array',
      'Sapphire crystal glass with anti-glare nano-matrix'
    ]
  },
  {
    id: 'nx-03',
    name: 'PulseRunner Hyper-Shift Kicks',
    tagline: 'Kinetic energy return with adaptive illuminated carbon sole',
    category: 'FASHION',
    price: 18999,
    originalPrice: 24999,
    discountPercentage: 24,
    rating: 4.8,
    reviewsCount: 194,
    image: sneakerImg,
    badge: 'NEW',
    isDrop: false,
    colors: [
      { name: 'Hyper Magenta', hex: '#EC4899' },
      { name: 'Cyan Shock', hex: '#06B6D4' },
      { name: 'Midnight Carbon', hex: '#090A0F' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    specs: [
      { label: 'Upper', value: 'Bio-Synthetic Carbon Weave' },
      { label: 'Sole Mechanism', value: 'Hyper-Charged Air Springs' },
      { label: 'Illumination', value: 'RGB Sub-sole Pulse Core' },
      { label: 'Weight', value: '290g per shoe' }
    ],
    description:
      'Reimagined biomechanics for the modern metropolis. PulseRunner features micro-pneumatic rebound cells embedded in a curved carbon shank with dynamic speed-responsive illumination.',
    features: [
      'Smart lacing tension system with motorized cinch',
      'Reflective fiber weave with multi-angle iridescent sheen',
      'Micro-cellular cushioning that hardens on impact',
      'Bluetooth sync with gait analytics in NEXORA app'
    ]
  },
  {
    id: 'nx-04',
    name: 'Vortex Quantum OLED Deck',
    tagline: 'Desktop-grade ray tracing handheld with edge-to-edge transparent OLED',
    category: 'GAMING',
    price: 54999,
    originalPrice: 64999,
    discountPercentage: 15,
    rating: 4.98,
    reviewsCount: 560,
    image: gamingDeckImg,
    badge: 'LIMITED',
    isDrop: true,
    stockLeft: 12,
    colors: [
      { name: 'Eclipse Shadow', hex: '#0D0E15' },
      { name: 'Neon Purple', hex: '#7C3AED' }
    ],
    specs: [
      { label: 'GPU Engine', value: 'RDNA 4 Ultra Ray-Core' },
      { label: 'Panel', value: '7.8" 165Hz Transparent OLED' },
      { label: 'Memory', value: '32GB LPDDR5X 8533MHz' },
      { label: 'Storage', value: '2TB PCIe Gen5 NVMe' }
    ],
    description:
      'Uncompromising console performance in the palm of your hand. Liquid-metal cooling and high-refresh transparent OLED display create an unmatched portable gaming revelation.',
    features: [
      'Hall-effect anti-drift electromagnetic analog sticks',
      'Dual haptic actuators with spatial rumble feedback',
      'Custom vapor chamber with quiet mag-lev fans',
      'Wi-Fi 7 ultra-low jitter networking'
    ]
  },
  {
    id: 'nx-05',
    name: 'Spectra Aero Drone 4K Pro',
    tagline: 'Autonomous AI tracking gimbal drone with optical ring navigation',
    category: 'TECH',
    price: 42999,
    originalPrice: 49999,
    discountPercentage: 14,
    rating: 4.85,
    reviewsCount: 228,
    image: hoverDroneImg,
    badge: 'NEW',
    isDrop: true,
    stockLeft: 8,
    colors: [
      { name: 'Carbon Stealth', hex: '#11131F' },
      { name: 'Glacier Silver', hex: '#E2E8F0' }
    ],
    specs: [
      { label: 'Camera Sensor', value: '1-inch Sony 48MP CMOS' },
      { label: 'Flight Range', value: '15 Kilometers Transmission' },
      { label: 'Flight Time', value: '45 Mins Continuous' },
      { label: 'Obstacle Sensing', value: '360° Omnidirectional LiDAR' }
    ],
    description:
      'Silent, razor-sharp cinematography in an ultra-compact pocket envelope. Spectra uses predictive spatial algorithms to frame cinematic shots automatically without pilot input.',
    features: [
      'AI Subject Tracking with zero lock-loss',
      'Whisper-quiet counter-rotating ducted propellers',
      'Foldable aerodynamic carbon composite skeleton',
      'Automatic return-to-home with LiDAR terrain mapping'
    ]
  },
  {
    id: 'nx-06',
    name: 'Lumio Orbital Ambient Arc',
    tagline: 'Floating magnetic levitation ambient light with circadian spectrum',
    category: 'HOME',
    price: 14999,
    originalPrice: 19999,
    discountPercentage: 25,
    rating: 4.75,
    reviewsCount: 142,
    image: hoverDroneImg, // visually harmonious fallback with circular ring
    badge: 'TRENDING',
    isDrop: false,
    colors: [
      { name: 'Brushed Brass', hex: '#D97706' },
      { name: 'Midnight Anodized', hex: '#0F172A' }
    ],
    specs: [
      { label: 'Levitation Height', value: '25mm Magnetic Air Gap' },
      { label: 'Light Spectrum', value: '1800K - 6500K Infinite CCT' },
      { label: 'Controls', value: 'Air Gesture + App Synchronized' },
      { label: 'Base Material', value: 'Solid Slate & Machined Aluminum' }
    ],
    description:
      'Transform your habitat into an ambient sanctuary. The Lumio ring hovers friction-free above its monolithic base, casting calming atmospheric gradients tuned to your circadian rhythm.',
    features: [
      'True frictionless magnetic suspension',
      'Contactless wireless induction power delivery',
      'Ambient audio-reactive wave mode',
      'Gentle sunrise dawn simulation alarm'
    ]
  },
  {
    id: 'nx-07',
    name: 'Vanguard Biometric Exosuit Tee',
    tagline: 'Smart compressive fabric with integrated posture realignment micro-ribs',
    category: 'FITNESS',
    price: 7999,
    originalPrice: 10999,
    discountPercentage: 27,
    rating: 4.7,
    reviewsCount: 88,
    image: sneakerImg,
    badge: 'NEW',
    isDrop: false,
    colors: [
      { name: 'Cyber Smoke', hex: '#334155' },
      { name: 'Deep Onyx', hex: '#05070D' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { label: 'Fabric Composition', value: '78% Bio-Polyamide, 22% Elastane' },
      { label: 'Sensory Nodes', value: '16 Micro-conductive points' },
      { label: 'Washability', value: '100% Machine Wash Safe' },
      { label: 'Thermal Profile', value: 'Sweat-activated Evaporation Mesh' }
    ],
    description:
      'High-performance compression engineered with elastic polymer scaffolding to subtly correct thoracic spine alignment during intense training and prolonged desk sessions.',
    features: [
      'Active biomechanical posture guidance',
      'Antimicrobial silver-ion yarn weave',
      'Ergonomic seamless flatlock seams',
      'Body heat radiation retention'
    ]
  },
  {
    id: 'nx-08',
    name: 'Synapse Cyber Elixir & Mist',
    tagline: 'Cellular moisture replenishment infused with bio-peptides',
    category: 'BEAUTY',
    price: 5499,
    originalPrice: 6999,
    discountPercentage: 21,
    rating: 4.88,
    reviewsCount: 167,
    image: smartwatchImg,
    badge: 'BEST SELLER',
    isDrop: false,
    colors: [
      { name: 'Frosted Violet Glass', hex: '#A855F7' }
    ],
    specs: [
      { label: 'Key Actives', value: 'Multi-molecular Hyaluronic Acid & Copper Peptides' },
      { label: 'Volume', value: '100ml / 3.4 fl. oz.' },
      { label: 'Dispenser', value: 'Ultrasonic Micro-Aerosol Nozzle' },
      { label: 'Origin', value: 'Synthesized in Zurich' }
    ],
    description:
      'Next-generation skincare formulated to shield against digital blue light radiation and environmental airborne pollutants while deep-hydrating the cellular barrier.',
    features: [
      'Sub-micron droplet dispersion for instant skin penetration',
      'Photoprotective ectoin peptide matrix',
      'Fragrance-free, hypoallergenic clinical formula',
      'Refillable brushed-aluminum pressure vessel'
    ]
  }
];

export const CATEGORIES = [
  'ALL',
  'TECH',
  'FASHION',
  'GAMING',
  'HOME',
  'BEAUTY',
  'FITNESS',
  'ACCESSORIES'
] as const;
