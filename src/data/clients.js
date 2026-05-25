import { FaBuilding, FaCity, FaIndustry } from 'react-icons/fa6';

const clients = [
  {
    id: 'aramco',
    name: 'Aramco',
    icon: FaIndustry,
    sector: 'Energy & Industrial Development',
    location: 'Saudi Arabia',
    summary:
      'Infrastructure and utility works delivered for Aramco-related project environments with disciplined field execution.',
    details:
      'Jodran Al Khaleej supports Aramco projects through civil and infrastructure scopes including potable water networks, irrigation systems, valve chambers, smart house connections, testing, and handover support.',
    relationship: 'Repeated project delivery across Spark - Dry Port scopes',
  },
  {
    id: 'modon',
    name: 'Modon',
    icon: FaCity,
    sector: 'Industrial Cities & Infrastructure',
    location: 'Al Madinah Al Munawwarah',
    summary:
      'Infrastructure network delivery for industrial city development and municipal utility systems.',
    details:
      'Jodran Al Khaleej works with Modon project requirements through infrastructure installation, potable water networks, sewer networks, and organized site execution in industrial city environments.',
    relationship: 'Industrial city infrastructure works',
  },
  {
    id: 'sajco',
    name: 'Sajco',
    icon: FaBuilding,
    sector: 'Main Contractor Partner',
    location: 'Saudi Arabia',
    summary:
      'Main contractor collaboration across civil and infrastructure works for utility-focused project packages.',
    details:
      'Jodran Al Khaleej executes specialist scopes under Sajco project packages, supporting potable water, irrigation, sewer, valve chamber, and handover works across Saudi project sites.',
    relationship: 'Main contractor coordination and project execution',
    projectMatch: 'Sajco',
  },
  {
    id: 'damac-edgnx',
    name: 'Damac (Edgnx)',
    icon: FaBuilding,
    sector: 'Data Center Development',
    location: 'Dammam',
    summary:
      'Civil, infrastructure, ICT, electrical, and metal work scopes for Dammam Data Center facilities.',
    details:
      'Jodran Al Khaleej supports Damac (Edgnx) data center projects through interlock, curbstone, precast wall, HDPE potable water, telecom network, MV room, and fabricated metal work scopes.',
    relationship: 'Data center infrastructure and support works',
  },
  {
    id: 'damac-digital',
    name: 'Damac Digital',
    icon: FaBuilding,
    sector: 'Digital Infrastructure',
    location: 'Dammam',
    summary:
      'Civil, structural, architectural, electrical, and metal work scopes for Data Center - Dammam Building B.',
    details:
      'Jodran Al Khaleej executes shell and core works, MV intake room support, Smart RMU installation, and fabricated platforms for Damac Digital data center facilities.',
    relationship: 'Digital infrastructure and building support works',
  },
  {
    id: 'ministry-of-communications',
    name: 'Ministry of Communications',
    icon: FaCity,
    sector: 'Telecommunications Infrastructure',
    location: 'Al-Khobar',
    summary:
      'Telecommunication network rehabilitation works including communication line pipe extension scopes.',
    details:
      'Jodran Al Khaleej supports public telecommunications infrastructure through rehabilitation and pipe extension works for communication networks in Al-Khobar.',
    relationship: 'Telecommunication network rehabilitation',
  },
];

export default clients;
