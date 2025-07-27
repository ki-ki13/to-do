import { MemeData, DailyGoal } from './types';
import { getMemeTemplate, MEME_TEMPLATES, MemeTemplate } from './memeTemplates';

export class AIMemeGenerator {
  
  // Template pools for variety
  private static TEMPLATE_POOLS = {
    praise: [
      'success_kid', 'drake_yes', 'thumbs_up_cat', 'leonardo_cheers', 
      'oprah_you_get', 'satisfied_seal', 'you_can_do_it', 'determined_baby',
      'rocky_balboa', 'motivational_lion'
    ],
    roast: [
      'crying_cat', 'disappointed_guy', 'facepalm', 
      'distracted_boyfriend', 'this_is_fine', 'patrick_star'
    ]
  };

  // Free Imgflip template IDs (no premium needed)
  private static IMGFLIP_TEMPLATES = {
    praise: [
      { id: '61579', name: 'One Does Not Simply' },
      { id: '87743020', name: 'Two Buttons' },
      { id: '129242436', name: 'Change My Mind' },
      { id: '222403160', name: 'Bernie I Am Once Again Asking' },
      { id: '131087935', name: 'Running Away Balloon' },
      { id: '4030713', name: 'Laughing Leo' },
      { id: '101470', name: 'Ancient Aliens' }
    ],
    roast: [
      { id: '112126428', name: 'Distracted Boyfriend' },
      { id: '131940431', name: 'Gru\'s Plan' },
      { id: '247375501', name: 'Buff Doge vs. Cheems' },
      { id: '27813981', name: 'Hide the Pain Harold' },
      { id: '80707627', name: 'Sad Pablo Escobar' },
      { id: '102156234', name: 'Mocking Spongebob' }
    ]
  };

  // MAIN METHOD - This is what you'll use
  static async generateVariedMeme(
    completedTasks: number,
    totalTasks: number,
    goal: DailyGoal
  ): Promise<{ canvas?: HTMLCanvasElement; imageUrl?: string; memeData: MemeData }> {
    
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
    let memeData: MemeData;
    
    // Step 1: Generate meme text and data
    try {
      if (completionRate === 1) {
        memeData = await this.generateAIPraiseMeme(goal.title);
      } else if (completionRate >= 0.7) {
        memeData = await this.generateAIMotivationalMeme(completedTasks, totalTasks);
      } else {
        memeData = await this.generateAIRoastMeme(completedTasks, totalTasks, goal.title);
      }
    } catch (error) {
      console.warn('AI generation failed, using static memes:', error);
      memeData = this.generateStaticMeme(completedTasks, totalTasks, goal);
    }

    // Step 2: Try multiple generation methods for variety
    const result: { canvas?: HTMLCanvasElement; imageUrl?: string; memeData: MemeData } = { memeData };
    
    // Random choice: 60% canvas, 40% Imgflip for variety
    const useCanvas = Math.random() < 0.6;
    
    try {
      if (useCanvas) {
        // Try canvas first
        result.canvas = await this.createVariedCanvas(memeData);
      } else {
        // Try Imgflip first
        result.imageUrl = await this.generateImgflipMeme(memeData);
      }
    } catch (error) {
      console.warn('Primary method failed, trying fallback:', error);
      
      try {
        // Fallback to other method
        if (useCanvas) {
          result.imageUrl = await this.generateImgflipMeme(memeData);
        } else {
          result.canvas = await this.createVariedCanvas(memeData);
        }
      } catch (fallbackError) {
        console.warn('Fallback failed, using basic canvas:', fallbackError);
        // Final fallback - basic canvas
        result.canvas = await this.createBasicCanvas(memeData);
      }
    }

    return result;
  }

  // AI Generation Methods
  private static async generateAIPraiseMeme(goalTitle: string): Promise<MemeData> {
    const prompt = `Create a short, funny, congratulatory meme caption for someone who completed their daily goal: "${goalTitle}". Make it celebratory, witty, and perfect for social media. Keep it under 50 characters. Just return the caption text, nothing else.`;
    
    const aiText = await this.callGroqAI(prompt);
    const cleanText = this.cleanAIResponse(aiText) || `Crushed it! ${goalTitle} ✅`;
    
    return {
      text: cleanText,
      template: this.getRandomTemplate('praise'),
      type: 'praise',
      isAIGenerated: true
    };
  }

  private static async generateAIMotivationalMeme(completed: number, total: number): Promise<MemeData> {
    const prompt = `Create a short, motivational meme caption for someone who completed ${completed} out of ${total} tasks. Make it encouraging, funny, and perfect for a motivational meme. Keep it under 50 characters. Just return the caption text, nothing else.`;
    
    const aiText = await this.callGroqAI(prompt);
    const cleanText = this.cleanAIResponse(aiText) || `${completed}/${total} done! Almost there champion!`;
    
    return {
      text: cleanText,
      template: this.getRandomTemplate('praise'),
      type: 'praise',
      isAIGenerated: true
    };
  }

  private static async generateAIRoastMeme(completed: number, total: number, goalTitle: string): Promise<MemeData> {
    const prompt = `Create a short, playfully sarcastic meme caption roasting someone who only completed ${completed} out of ${total} tasks for their goal "${goalTitle}". Make it funny but not mean, perfect for internet meme culture. Keep it under 50 characters. Just return the caption text, nothing else.`;
    
    const aiText = await this.callGroqAI(prompt);
    const cleanText = this.cleanAIResponse(aiText) || `${completed}/${total}? Even my plant is more productive 🌱`;
    
    return {
      text: cleanText,
      template: this.getRandomTemplate('roast'),
      type: 'roast',
      isAIGenerated: true
    };
  }

  // Static Meme Generation (fallback)
  private static generateStaticMeme(completed: number, total: number, goal: DailyGoal): MemeData {
    const completionRate = total > 0 ? completed / total : 0;
    
    const phrases = {
      praise: [
        `CRUSHED IT! ${goal.title.toUpperCase()} ✅`,
        "LOOK WHO'S GOT THEIR LIFE TOGETHER! 🏆",
        "TASK MASTER LEVEL: LEGENDARY",
        "WHEN YOU ACTUALLY DO WHAT YOU SAID YOU'D DO 💪",
        "GOAL COMPLETED | DOPAMINE ACTIVATED 🧠",
        `${completed}/${total} DONE! ALMOST THERE CHAMPION!`,
        "SO CLOSE YOU CAN TASTE THE VICTORY! 🎯",
        `${completed} DOWN, ${total - completed} TO GO!`,
        "KEEP PUSHING! GREATNESS AWAITS! 💪",
        "FINAL STRETCH! MAKE IT COUNT! ⭐"
      ],
      roast: [
        `${completed}/${total}? EVEN MY PLANT IS MORE PRODUCTIVE 🌱`,
        "NETFLIX: 'ARE YOU STILL WATCHING?' YOU: 'OBVIOUSLY' 📺",
        "PROCRASTINATION LEVEL: MASTER CLASS 🎓",
        `${completed} TASKS DONE. YOUR FUTURE SELF IS JUDGING YOU 👀`,
        "COMMITMENT ISSUES DETECTED! 🚨"
      ]
    };

    // Use praise for high completion (>=70%), roast for low completion
    const type: 'praise' | 'roast' = completionRate >= 0.7 ? 'praise' : 'roast';
    const randomPhrase = phrases[type][Math.floor(Math.random() * phrases[type].length)];

    return {
      text: randomPhrase,
      template: this.getRandomTemplate(type),
      type,
      isAIGenerated: false
    };
  }

  // Canvas Generation
  private static async createVariedCanvas(memeData: MemeData): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
   
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = 500;
    canvas.height = 500;

    // Try to load template image, fallback to generated background
    try {
      const template = MEME_TEMPLATES.find(t => t.id === memeData.template);
      if (template?.imageUrl) {
        const img = await this.loadImage(template.imageUrl);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      } else {
        throw new Error('No template image');
      }
    } catch (error) {
      this.createVariedBackground(ctx, canvas.width, canvas.height, memeData.type);
    }

    this.addTextToCanvas(ctx, memeData.text, canvas.width, canvas.height);

    if (memeData.isAIGenerated) {
      this.addAIBadge(ctx, canvas.width, canvas.height);
    }

    return canvas;
  }

  // Imgflip Generation (free templates)
  private static async generateImgflipMeme(memeData: MemeData): Promise<string> {
    const templates = this.IMGFLIP_TEMPLATES[memeData.type] || this.IMGFLIP_TEMPLATES.praise;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    const formData = new FormData();
    formData.append('template_id', randomTemplate.id);
    formData.append('username', process.env.NEXT_PUBLIC_IMGFLIP_USERNAME || 'imgflip_hubot');
    formData.append('password', process.env.NEXT_PUBLIC_IMGFLIP_PASSWORD || 'imgflip_hubot');
    
    // Split text for top/bottom format
    const parts = memeData.text.includes('|') ? memeData.text.split('|') : [memeData.text, ''];
    formData.append('text0', parts[0]?.trim() || memeData.text);
    formData.append('text1', parts[1]?.trim() || '');

    const response = await fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error_message || 'Imgflip API failed');
    }
  }

  // Utility Methods
  private static getRandomTemplate(type: string): string {
    const templates = this.TEMPLATE_POOLS[type as keyof typeof this.TEMPLATE_POOLS] || this.TEMPLATE_POOLS.praise;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private static async callGroqAI(prompt: string): Promise<string> {
    const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!API_KEY) {
      throw new Error('No Groq API key configured');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', 
        messages: [
          {
            role: 'system',
            content: 'You are a witty meme caption generator. Create short, funny captions perfect for internet memes. Be concise and punchy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.8,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private static cleanAIResponse(aiResponse: string): string | null {
    if (!aiResponse) return null;
    
    let cleaned = aiResponse.trim()
      .replace(/^["']|["']$/g, '')
      .replace(/^(Here's a|Here is a|Caption:|Meme:|Text:|Sure,|Certainly)/i, '')
      .trim()
      .split('\n')[0]
      .replace(/[*"'`]/g, '');
    
    if (cleaned.length > 60) {
      cleaned = cleaned.substring(0, 57) + '...';
    }
    
    return cleaned || null;
  }

  private static createVariedBackground(ctx: CanvasRenderingContext2D, width: number, height: number, type: string): void {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    switch (type) {
      case 'praise':
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#8BC34A');
        break;
      case 'roast':
        gradient.addColorStop(0, '#F44336');
        gradient.addColorStop(1, '#E91E63');
        break;
      default:
        gradient.addColorStop(0, '#2196F3');
        gradient.addColorStop(1, '#00BCD4');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add some visual texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 20 + 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  private static addTextToCanvas(ctx: CanvasRenderingContext2D, text: string, width: number, height: number): void {
    ctx.font = 'bold 36px Impact, Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';

    const lines = this.wrapText(ctx, text.toUpperCase(), width - 60);
    const lineHeight = 45;
    const startY = (height - lines.length * lineHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      for (let i = 0; i < 3; i++) {
        ctx.strokeText(line, width / 2, y);
      }
      ctx.fillText(line, width / 2, y);
    });
  }

  private static wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  private static createBasicCanvas(memeData: MemeData): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 500;
      canvas.height = 500;
      
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(0, 0, 500, 500);
      
      this.addTextToCanvas(ctx, memeData.text, 500, 500);
      resolve(canvas);
    });
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private static addAIBadge(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = 'rgba(0, 100, 200, 0.9)';
    ctx.fillRect(width - 50, height - 30, 45, 25);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', width - 27, height - 17);
  }
}