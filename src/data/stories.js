import fantasyCover from '@/assets/images/covers/fantasy.jpg'
import sciFiCover from '@/assets/images/covers/sci-fi.jpg'
import romanceCover from '@/assets/images/covers/romance.jpg'
import adventureCover from '@/assets/images/covers/adventure.jpg'
import defaultAvatar from '@/assets/default-avatar.png'

const stories = [
  {
    id: 'the-dragons-covenant',
    title: "The Dragon's Covenant",
    author: 'Helena Grande',
    authorAvatar: defaultAvatar,
    genre: 'Fantasy',
    description:
      'A dying dragon offers a young blacksmith one final bargain: forge a covenant strong enough to save the kingdom, or watch the last of the old magic burn with him.',
    cover: fantasyCover,
    rating: 4.7,
    views: 127100,
    likes: 90200,
  },
  {
    id: 'crown-of-ashen-stars',
    title: 'Crown of Ashen Stars',
    author: 'Marcus Vale',
    authorAvatar: defaultAvatar,
    genre: 'Fantasy',
    description:
      'When the stars begin to fall one by one, a disgraced astronomer must cross a kingdom of ash to find the crown that once kept the night sky whole.',
    cover: fantasyCover,
    rating: 4.5,
    views: 86400,
    likes: 32100,
  },
  {
    id: 'the-last-spellwright',
    title: 'The Last Spellwright',
    author: 'Ivy Ashdown',
    authorAvatar: defaultAvatar,
    genre: 'Fantasy',
    description:
      'The last living spellwright has forgotten every word of power she ever knew, except the one that could undo the war she started.',
    cover: fantasyCover,
    rating: 4.6,
    views: 54200,
    likes: 19800,
  },
  {
    id: 'stellar-exodus',
    title: 'Stellar Exodus',
    author: 'Helena Grande',
    authorAvatar: defaultAvatar,
    genre: 'Sci-fi',
    description:
      'The colony ship Exodus has been travelling for three centuries when its passengers wake to find the promised world already inhabited, and waiting for them.',
    cover: sciFiCover,
    rating: 4.7,
    views: 90200,
    likes: 47300,
  },
  {
    id: 'orbit-of-silence',
    title: 'Orbit of Silence',
    author: 'Nadia Krov',
    authorAvatar: defaultAvatar,
    genre: 'Sci-fi',
    description:
      'A salvage crew answers a distress signal from a station that has been dark for forty years, only to hear their own voices on the other end.',
    cover: sciFiCover,
    rating: 4.4,
    views: 41800,
    likes: 12600,
  },
  {
    id: 'the-ninth-transmission',
    title: 'The Ninth Transmission',
    author: 'Owen Mercer',
    authorAvatar: defaultAvatar,
    genre: 'Sci-fi',
    description:
      'Eight messages have arrived from deep space. The ninth is addressed to one scientist personally, and it knows exactly what she will do next.',
    cover: sciFiCover,
    rating: 4.8,
    views: 73300,
    likes: 35600,
  },
  {
    id: 'letters-to-the-lighthouse',
    title: 'Letters to the Lighthouse',
    author: 'Clara Beaumont',
    authorAvatar: defaultAvatar,
    genre: 'Romance',
    description:
      'Every summer she leaves a letter in the lighthouse tower. This year, someone finally writes back, and he is not the man she imagined.',
    cover: romanceCover,
    rating: 4.6,
    views: 68100,
    likes: 28900,
  },
  {
    id: 'a-season-of-rain',
    title: 'A Season of Rain',
    author: 'Theo Lindqvist',
    authorAvatar: defaultAvatar,
    genre: 'Romance',
    description:
      'Two strangers share a bookshop awning during the wettest autumn on record, and neither is ready to admit that the storm is the best thing that ever happened to them.',
    cover: romanceCover,
    rating: 4.3,
    views: 38400,
    likes: 15300,
  },
  {
    id: 'the-bakery-on-vine-street',
    title: 'The Bakery on Vine Street',
    author: 'Amara Osei',
    authorAvatar: defaultAvatar,
    genre: 'Romance',
    description:
      'A rival baker moves in across the street, and the only thing more dangerous than their rivalry is the way he remembers her order every single morning.',
    cover: romanceCover,
    rating: 4.5,
    views: 49700,
    likes: 21400,
  },
  {
    id: 'the-map-of-broken-roads',
    title: 'The Map of Broken Roads',
    author: 'Elliot Crane',
    authorAvatar: defaultAvatar,
    genre: 'Adventure',
    description:
      'An old smuggler and a runaway heir set out with a map that leads only to places that no longer exist, chasing a treasure everyone else gave up on.',
    cover: adventureCover,
    rating: 4.4,
    views: 57800,
    likes: 17600,
  },
  {
    id: 'where-the-rivers-end',
    title: 'Where the Rivers End',
    author: 'Sana Whitfield',
    authorAvatar: defaultAvatar,
    genre: 'Adventure',
    description:
      'A river guide promises to take a grieving family to the source of the water that shaped their lives, through country no map has ever agreed on.',
    cover: adventureCover,
    rating: 4.2,
    views: 29600,
    likes: 9200,
  },
  {
    id: 'the-glass-compass',
    title: 'The Glass Compass',
    author: 'Rafael Duarte',
    authorAvatar: defaultAvatar,
    genre: 'Adventure',
    description:
      'The compass only points toward what its owner has lost, which is why the expedition has no idea where it is going until there is no way back.',
    cover: adventureCover,
    rating: 4.6,
    views: 64500,
    likes: 24300,
  },
]

export default stories
