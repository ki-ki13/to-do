import { MemeData, DailyGoal } from './types';
import { getMemeTemplate, MEME_TEMPLATES, MemeTemplate } from './memeTemplates';

export class MemeGenerator {
  static generateMemeText(
    completedTasks: number,
    totalTasks: number,
    goal: DailyGoal
  ): MemeData {
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
   
    if (completionRate === 1) {
      return this.generatePraiseMeme(goal.title);
    } else if (completionRate >= 0.7) {
      return this.generateMotivationalMeme(completedTasks, totalTasks);
    } else {
      return this.generateRoastMeme(completedTasks, totalTasks, goal.title);
    }
  }

  private static generatePraiseMeme(goalTitle: string): MemeData {
    const praisePhrases = [
      `Crushed it! ${goalTitle} ✅`,
      "Look who's got their life together! 🏆",
      "Task master level: LEGENDARY",
      "When you actually do what you said you'd do 💪",
      "Plot twist: You're actually productive!"
    ];

    return {
      text: praisePhrases[Math.floor(Math.random() * praisePhrases.length)],
      template: 'success_kid',
      type: 'praise'
    };
  }

  private static generateMotivationalMeme(completed: number, total: number): MemeData {
    const motivationalPhrases = [
      `${completed}/${total} done! Almost there champion!`,
      "So close you can taste the victory! 🎯",
      `${completed} down, ${total - completed} to go. You got this!`,
      "The finish line is calling your name! 📞"
    ];

    return {
      text: motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)],
      template: 'thumbs_up_cat',
      type: 'praise'
    };
  }

  private static generateRoastMeme(completed: number, total: number, goalTitle: string): MemeData {
    const roastPhrases = [
      `${completed}/${total}? Even my plant is more productive 🌱`,
      "Netflix: 'Are you still watching?' You: 'Obviously' 📺",
      `${goalTitle}? More like ${goalTitle.toLowerCase()}-n't`,
      "Procrastination level: Master Class 🎓",
      `${completed} tasks done. Your future self is judging you 👀`,
      "That to-do list isn't going to do itself... oh wait 🤔"
    ];

    return {
      text: roastPhrases[Math.floor(Math.random() * roastPhrases.length)],
      template: 'crying_cat',
      type: 'roast'
    };
  }

  static async createMemeCanvas(memeData: MemeData): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
   
    if (!ctx) throw new Error('Could not get canvas context');

    // Get the template configuration
    const template = MEME_TEMPLATES.find(t => t.id === memeData.template);
    if (!template) throw new Error('Template not found');

    canvas.width = 500;
    canvas.height = 500;

    try {
      // Load and draw the template image
      const img = await this.loadImage(template.imageUrl);
      
      // Scale image to fit canvas
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    } catch (error) {
      console.warn('Could not load template image, using fallback', error);
      // Fallback: solid background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Add text based on template configuration
    this.addTextToCanvas(ctx, memeData.text, template, canvas.width, canvas.height);

    return canvas;
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private static addTextToCanvas(
    ctx: CanvasRenderingContext2D,
    text: string,
    template: MemeTemplate,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    // Set up text styling
    ctx.font = 'bold 32px Impact, Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    const lines = this.wrapText(ctx, text, canvasWidth - 40);

    if (template.textAreas.custom) {
      // Use custom text areas (like Drake template)
      template.textAreas.custom.forEach((area, index) => {
        if (index < lines.length) {
          const textX = area.x + area.width / 2;
          const textY = area.y + area.height / 2;
          
          ctx.strokeText(lines[index], textX, textY);
          ctx.fillText(lines[index], textX, textY);
        }
      });
    } else {
      // Use top/bottom positioning
      const lineHeight = 40;
      
      if (template.textAreas.top && template.textAreas.bottom) {
        // Split text between top and bottom
        const midPoint = Math.ceil(lines.length / 2);
        const topLines = lines.slice(0, midPoint);
        const bottomLines = lines.slice(midPoint);
        
        // Top text
        const topStartY = 60;
        topLines.forEach((line, index) => {
          const y = topStartY + (index * lineHeight);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
        
        // Bottom text
        const bottomStartY = canvasHeight - (bottomLines.length * lineHeight) - 20;
        bottomLines.forEach((line, index) => {
          const y = bottomStartY + (index * lineHeight);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      } else if (template.textAreas.top) {
        // Top only
        const startY = 60;
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      } else if (template.textAreas.bottom) {
        // Bottom only
        const startY = canvasHeight - (lines.length * lineHeight) - 20;
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      } else {
        // Center (fallback)
        const startY = canvasHeight / 2 - (lines.length * lineHeight) / 2;
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      }
    }
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
}