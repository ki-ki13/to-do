# Slay or Nay

## Inspiration
The idea for **Slay or Nay** was born out of my own struggle with procrastination. I often find myself with a long list of tasks and big dreams to chase—but laziness gets in the way. Traditional to-do lists weren’t enough to keep me motivated. I realized that what actually pushes me is humor and a bit of roasting. When someone jokes about my unfinished tasks, I feel more motivated (and a little called out).

## What It Does
**Slay or Nay** is a fun twist on a traditional to-do list app. Users add and complete tasks throughout the day. Once they’re done, the app evaluates their performance and automatically generates a meme based on the completion rate:
- ✅ **100% Complete** → You get a **praise meme**  
- ✨ **70% or more complete** → You receive a **motivational meme**  
- 🔥 **Less than 70%** → You’re hit with a **roast meme**

The memes are generated using Imgflip and tailored to your progress. Your task history is stored in `localStorage`, allowing the app to track your achievements (or failures!) each time you use it.

## How We Built It
- Brainstormed ideas and created wireframes on paper  
- Researched how memes are made and found a great resource: Imgflip, which offers thousands of meme images  
- Coded the MVP using a simple UI without proper styling to focus on testing core utilities and functionality  
- Styled the web app with a fun and girly theme  

## Challenges We Ran Into
Finding free AI models for meme generation was challenging, and some features of the Imgflip API required a premium account.

## Accomplishments That We're Proud Of
- Successfully combined productivity and humor in a single app  
- Built a working MVP using Next.js with local state and `localStorage`  
- Generated dynamic memes based on user progress  
- Created a tool that turns tasks into entertainment  

## What We Learned
- How to work with APIs, especially how to fetch and format data from the Imgflip API  
- Improved my understanding of `useEffect`, React hooks, and handling side effects in Next.js  
- Gained hands-on experience with Next.js as a framework and how to manage client-side storage with `localStorage`  
- Learned that building something fun and personal can be incredibly motivating  

## What's Next for Slay or Nay
I plan to enhance the experience by adding gamification elements to make it feel more like a game. I also want to implement a database for user authentication and to save users' history data. In the future, I’d also love to:
- Allow users to choose their own meme style  
- Add streaks, badges, and leveling up  
- Let users share their meme results on social media

