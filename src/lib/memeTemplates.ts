export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  textAreas: {
    top?: boolean;
    bottom?: boolean;
    custom?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    imageUrl: '/memes/drake-template.jpg',
    textAreas: {
      custom: [
        { x: 250, y: 50, width: 200, height: 100 },
        { x: 250, y: 200, width: 200, height: 100 }
      ]
    }
  },
  {
    id: 'distracted_boyfriend',
    name: 'Distracted Boyfriend',
    imageUrl: '/memes/distracted-boyfriend-template.jpg',
    textAreas: {
      bottom: true
    }
  },
  {
    id: 'success_kid',
    name: 'Success Kid',
    imageUrl: '/memes/success-kid-template.jpg',
    textAreas: {
      top: true,
      bottom: true
    }
  },
  {
    id: 'crying_cat',
    name: 'Crying Cat',
    imageUrl: '/memes/crying-cat-template.jpg',
    textAreas: {
      top: true
    }
  },
  {
    id: 'thumbs_up_cat',
    name: 'Thumbs Up Cat',
    imageUrl: '/memes/thumbs-up-cat-template.jpg',
    textAreas: {
      top: true
    }
  }
];

export const getMemeTemplate = (type: 'roast' | 'praise'): MemeTemplate => {
  if (type === 'praise') {
    return MEME_TEMPLATES.find(t => t.id === 'success_kid') || MEME_TEMPLATES[2];
  } else {
    return MEME_TEMPLATES.find(t => t.id === 'crying_cat') || MEME_TEMPLATES[3];
  }
};