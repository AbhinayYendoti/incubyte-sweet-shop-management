import { Sweet } from '@/types';

export const sweets: Sweet[] = [
  {
    id: '1',
    name: 'Gulab Jamun',
    description: 'Soft, spongy milk-solid balls soaked in rose-flavored sugar syrup',
    price: 450,
    quantity: 50,
    category: 'mithai',
    image: 'https://images.unsplash.com/photo-1666190020429-9c0d0d57d4de?w=400&h=300&fit=crop',
    origin: 'Rajasthan'
  },
  {
    id: '2',
    name: 'Kaju Katli',
    description: 'Diamond-shaped cashew fudge with silver foil topping',
    price: 850,
    quantity: 30,
    category: 'barfi',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=300&fit=crop',
    origin: 'Punjab'
  },
  {
    id: '3',
    name: 'Motichoor Ladoo',
    description: 'Delicate orange-colored sweet made from tiny boondi pearls',
    price: 550,
    quantity: 45,
    category: 'ladoo',
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop',
    origin: 'Uttar Pradesh'
  },
  {
    id: '4',
    name: 'Gajar Ka Halwa',
    description: 'Rich carrot pudding slow-cooked with milk, ghee and dry fruits',
    price: 350,
    quantity: 0,
    category: 'halwa',
    image: 'https://images.unsplash.com/photo-1605197583222-48b2f3b5e8d8?w=400&h=300&fit=crop',
    origin: 'Punjab'
  },
  {
    id: '5',
    name: 'Rasgulla',
    description: 'Soft spongy cheese balls in light sugar syrup',
    price: 400,
    quantity: 60,
    category: 'mithai',
    image: 'https://images.unsplash.com/photo-1601303516361-27dbe7f50de6?w=400&h=300&fit=crop',
    origin: 'West Bengal'
  },
  {
    id: '6',
    name: 'Besan Ladoo',
    description: 'Traditional gram flour ladoo with ghee and cardamom',
    price: 480,
    quantity: 35,
    category: 'ladoo',
    image: 'https://images.unsplash.com/photo-1666190020429-9c0d0d57d4de?w=400&h=300&fit=crop',
    origin: 'Gujarat'
  },
  {
    id: '7',
    name: 'Pista Barfi',
    description: 'Premium pistachio fudge with rich nutty flavor',
    price: 950,
    quantity: 20,
    category: 'barfi',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=300&fit=crop',
    origin: 'Kashmir'
  },
  {
    id: '8',
    name: 'Moong Dal Halwa',
    description: 'Luxurious yellow lentil halwa with saffron and almonds',
    price: 420,
    quantity: 25,
    category: 'halwa',
    image: 'https://images.unsplash.com/photo-1605197583222-48b2f3b5e8d8?w=400&h=300&fit=crop',
    origin: 'Rajasthan'
  },
  {
    id: '9',
    name: 'Soan Papdi',
    description: 'Flaky, cube-shaped sweet with cardamom and pistachios',
    price: 380,
    quantity: 40,
    category: 'mithai',
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop',
    origin: 'Delhi'
  },
  {
    id: '10',
    name: 'Namak Pare',
    description: 'Crispy diamond-shaped savory snack with cumin',
    price: 220,
    quantity: 100,
    category: 'namkeen',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=300&fit=crop',
    origin: 'Maharashtra'
  },
  {
    id: '11',
    name: 'Mysore Pak',
    description: 'Melt-in-mouth ghee-rich gram flour sweet from South India',
    price: 620,
    quantity: 15,
    category: 'mithai',
    image: 'https://images.unsplash.com/photo-1666190020429-9c0d0d57d4de?w=400&h=300&fit=crop',
    origin: 'Karnataka'
  },
  {
    id: '12',
    name: 'Chakli',
    description: 'Spiral-shaped crispy snack made from rice and lentil flour',
    price: 280,
    quantity: 80,
    category: 'namkeen',
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop',
    origin: 'Maharashtra'
  }
];

export const categories = [
  { id: 'all', name: 'All Sweets', emoji: '🍬' },
  { id: 'mithai', name: 'Mithai', emoji: '🍮' },
  { id: 'ladoo', name: 'Ladoo', emoji: '🟠' },
  { id: 'barfi', name: 'Barfi', emoji: '🟫' },
  { id: 'halwa', name: 'Halwa', emoji: '🥣' },
  { id: 'namkeen', name: 'Namkeen', emoji: '🥨' }
];
