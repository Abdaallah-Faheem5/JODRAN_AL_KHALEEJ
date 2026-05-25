import { FaTruck, FaWrench, FaTools, FaCogs } from 'react-icons/fa';

const equipment = [
  {
    id: 'excavators',
    name: 'Heavy Excavators',
    category: 'Civil & Earthmoving',
    model: 'Caterpillar 320D / 330D',
    quantity: 6,
    icon: FaTruck,
    description: 'High-capacity excavators for deep trenching, pipe laying, and site preparation works.',
  },
  {
    id: 'loaders',
    name: 'Wheel Loaders',
    category: 'Civil & Earthmoving',
    model: 'Caterpillar 950H / 966H',
    quantity: 4,
    icon: FaTruck,
    description: 'Heavy duty wheel loaders for material handling, backfilling, and stockpiling.',
  },
  {
    id: 'trenchers',
    name: 'Specialized Trenchers',
    category: 'Infrastructure & Trenching',
    model: 'Vermeer T555 / T655',
    quantity: 2,
    icon: FaTools,
    description: 'Track trenchers for precise and rapid excavation of utility and optical fiber trenches.',
  },
  {
    id: 'fusion-machines',
    name: 'HDPE Pipe Fusion Machines',
    category: 'Piping & Utilities',
    model: 'Ritmo / McElroy TracStar',
    quantity: 8,
    icon: FaWrench,
    description: 'High-precision butt fusion and electrofusion machines for HDPE potable water and fire water pipelines.',
  },
  {
    id: 'testing-equipment',
    name: 'Hydrotesting & Pressure Pumps',
    category: 'Testing & Commissioning',
    model: 'High-Pressure Hydrostatic Test Pumps',
    quantity: 5,
    icon: FaCogs,
    description: 'Calibrated testing pumps used for pressure and leak testing of potable, irrigation, and fire lines.',
  },
  {
    id: 'fiber-blowers',
    name: 'Fiber Optic Blowing Machines',
    category: 'ICT & Telecom',
    model: 'Plumettaz / Fremco Microflow',
    quantity: 3,
    icon: FaTools,
    description: 'Pneumatic cable blowing machines for installing fiber optic cables in microducts over long distances.',
  },
];

export default equipment;
