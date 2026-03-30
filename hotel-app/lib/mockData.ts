import { Hotel } from '../types/hotel';
import { Activity } from '../types/activity';

export const mockHotels: Hotel[] = [
  {
    id: 'h1',
    name: 'Bishoftu (Lake Kuriftu)',
    location: 'Bishoftu, Ethiopia',
    rating: 4.8,
    description: "Immerse yourself in the rhythmic beauty of Ethiopia's Rift Valley. Select your sanctuary along the shores of ancient lakes.",
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
    roomTypes: [
      {
        id: 'r1',
        name: 'Deluxe Garden Room',
        price: 120,
        capacity: 2,
        amenities: ['WiFi', 'Smart TV', 'Mini bar', 'AC', 'Balcony'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu5DY2KNm86ckFGws7R_qZ_U8sl7gmns27zsC9_W282u_fZADuILds3lspIDXboNYBSoWQRPm9Sjch-OmdpoimRF3CSIbql5m9nzDViOzvEqrkon_LulkZk-wRyS_LW_c-2oTafBpWybq2rqyf6TIqM_P1GFUUjfAZo4oVgmxYwfySGtt5d4NOSBd2DDqneB0DVnL6hyP9wJBtI7E_ls2_eFOroHVKSyuG8NDvORijOQcZKBqx7AN4X3rTYJ8q6mFPBG13L_oVvQ'
      },
      {
        id: 'r2',
        name: 'Lake View Suite',
        price: 200,
        capacity: 3,
        amenities: ['Jacuzzi', 'Lounge', 'Room service', 'Premium WiFi'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvmoycqT23MTIbL_yGfjwUiWZjplivEV2ju8DEP-2FUZRy3fGNsVxKSu2uhj2ul3kFp5u2rC0ohQoHAdGdCnSkx74qqQsAoWtvWmUUhPSHlbOPG-fCKykkWdfsHdM67hnJGyefyNAAKJRQ7GrRA6bBEcn8YGjn1iQN_e7FXkYj6_3wuoFPEtL9MdNw8Ph1sepzbEYm1eeG0fswzEVCl6gjRclNian9mhIWJFK1lbGhU0iCUDXmul3d69rVMSULDYdJLZhpalV5dg'
      },
      {
        id: 'r3',
        name: 'Family Villa',
        price: 350,
        capacity: 6,
        amenities: ['2 BR (King+Twin)', 'Kitchenette', 'Outdoor seating'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG7p4roO6bQ6rZ42SC2kE6KHzp81hY_IWY2HkG4_pbfRPXEDLeiaJ2Rcyh63vJ_LlxGwhclbupLCrp3LLf8NN6-p385_-O0Dk8CTqmOxPjPQOlHs4gHvGE1ZMB7_mgm_GA3C3tHAqFhssdCGvHKj_HgKd21ZNVdVjV1oRnu5lxI8JPMx-bERY1Kg6bm682mDdgmiQpqjxdy5iHZKESdea_O0fwRJWp2w30zDuqklat8uYVJ-KaN8qkM_bP92wyF012SOaPKhn1Uw'
      }
    ]
  },
  {
    id: 'h2',
    name: 'Bahir Dar (Lake Tana)',
    location: 'Bahir Dar, Ethiopia',
    rating: 4.9,
    description: 'Experience true Ethiopian hospitality on the shores of Lake Tana, the source of the Blue Nile.',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
    roomTypes: [
      {
        id: 'r4',
        name: 'Tana Signature Suite',
        price: 250,
        capacity: 2,
        amenities: ['Lake View', 'Private Deck', 'Minibar', 'Premium WiFi'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
      }
    ]
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    name: 'Spa Experience',
    description: 'Relaxing full-body treatment with traditional Ethiopian techniques.',
    price: 50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5KvHLD8VbWDA4oZd4ZHIslyM91SdgtcJ1MkiEZTWIIxSZN5AaO6zZsPPO9g1fJN8ZFTxACbl6i16IXoA0X5i_XWZt3H6t8Lvh3AfMhOE3PQ_tEcnHySnO-Hv6YOAJBWlAON3OZnsgPCVQPHVR07RgrbE6ObtPm3fjjEkXVbz7Xc1MyWj7dTmYf-2DrAevSZQ5QZyB6yoOW1KLhZdh6N7UHvX_3FoZ1a5yF1eR4Wrt60f4PqX8y-3tyLmSEeT4T_fosGosionzQQ',
    timeSlots: ['Morning (08:00 - 12:00)', 'Afternoon (13:00 - 17:00)', 'Evening (18:00 - 21:00)'],
    duration: '60 mins',
    category: 'Wellness'
  },
  {
    id: 'a2',
    name: 'Lake Boat Ride',
    description: 'Enjoy a peaceful guided boat ride on the lake.',
    price: 30,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmAgcdvpbndEJQZcymVTgy_EZejy16n333YNri0SkDX2fEjdyl_62-G4H_engRdPZ0AGm5xhrOagwZDNjWAw_Owm7IAOTL0xDqh5Lhlmi2dkjpreM2MioiMaN81LLljjDz-GdMQwTqGta1igQy9CoiALsgCNsa0kGUNUkp-sf6GEyB_ZWJVBzOKUHGZK2ohGJExM0BJNGWJzdCY3gr1cYy0OCRxDZ7Q6RKXhT800vhWSxrSFesC46f6jsY45XP9DR7iFpts4le4Q',
    timeSlots: ['Morning (08:00 - 12:00)', 'Afternoon (13:00 - 17:00)', 'Evening (18:00 - 21:00)'],
    duration: '45 mins',
    category: 'Discovery'
  },
  {
    id: 'a3',
    name: 'Water Park Access',
    description: 'Fun water activities for families and kids.',
    price: 25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBotBpPepV979ds0GeXxOBA8vEJb0xFgltNunnhVbZaYJuj-iIa_dipUXB2GvG0WWZXpGoWLDFJleHdhYIC0_YNU8Lv9mg1jFyQA5tyZdCaBwBj6hiw71uz5o3TrXcTIyIE7HwiwQLd6NFt-cBLp22ZjVGluIBHScdhiZD4HqM7zOJXCCZA8n9El4aN1jJrFD9iWvhe-A1PODrC7R1_AImXuXAlI90T0Iq5eueaqM91B49hDO552j4r26yRKtysuqc_YmiB1SOpdw',
    timeSlots: ['Full Day Access'],
    duration: 'Full day',
    category: 'Family'
  },
  {
    id: 'a4',
    name: 'Cultural Dinner Night',
    description: 'Traditional Ethiopian food, music, and dance experience. Immerse yourself in the rhythmic storytelling of our highlands while savoring authentic spice-rich delicacies.',
    price: 40,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAutSLYUXHnw44RVfwrJX4R2N0hAks7s_d-CKgKTEefamzsYJskg9qhz-UnHDQa2VtCUWkzJAE9l0DszFKndL_8ky4TAYGrx0xEuABW0uEQltt3uzWs7U9YHmkIrohYYgAmemjtEthsF04woboNId1-tJXegFarz05X0ZtpG3HffMe6jzBOjqkrOBjZI5KFfm7SaAzmLjXl3dleBM7DfhntdH4pZbb44xfLmGNeNtM7yyLAZ6XSCA7Ev9ejaKUsJT3yvUa6lcLcPA',
    timeSlots: ['Evening (18:00 - 21:00)', 'Late Evening (21:00 - 23:30)'],
    duration: 'Evening',
    category: 'Heritage'
  }
];
