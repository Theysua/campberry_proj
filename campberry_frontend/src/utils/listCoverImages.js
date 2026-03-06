const LIST_COVER_MAP = [
  {
    match: (title) => /pre-med|health science/i.test(title),
    imageUrl:
      'https://images.pexels.com/photos/8533137/pexels-photo-8533137.jpeg?cs=srgb&dl=pexels-artempodrez-8533137.jpg&fm=jpg',
    alt: 'Students collaborating in a health science lab',
  },
  {
    match: (title) => /writing|journalism/i.test(title),
    imageUrl:
      'https://images.pexels.com/photos/8005646/pexels-photo-8005646.jpeg?cs=srgb&dl=pexels-karola-g-8005646.jpg&fm=jpg',
    alt: 'Student writing at a bright desk',
  },
  {
    match: (title) => /research|initiative/i.test(title),
    imageUrl:
      'https://images.pexels.com/photos/6208709/pexels-photo-6208709.jpeg?cs=srgb&dl=pexels-cottonbro-6208709.jpg&fm=jpg',
    alt: 'Students working together in a science lab',
  },
]

export const getListCoverImage = (title = '') =>
  LIST_COVER_MAP.find((item) => item.match(title)) || null
