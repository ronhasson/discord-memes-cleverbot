# discord-memes-cleverbot
A Discord bot (using discord.io unofficial API)  that enables you to show memes in discord chat, and talk to Cleverbot when you feel especially alone.

# Features:
 - Show memes in chat (can be an image, a GIF, a youtube video, whatever Discord preview and your imagination allows you). Usage: `[*keyword that triggers a certain regular expression for a meme*]`
 - Register new memes in a file that acts as a meme bank. Usage: `^register [*regular expression*] *link*`
 - Chat with Cleverbot. Usage: `^clever on|off`
 - Flip a coin! Usage: `^coinflip *optional number of times*`

# Notes:
 - In order to use the bot you need to have a Discord account (you may create one especially for the bot, you can be logged in on your computer in one account, and use another one for the bot, they can work independently).
 - The meme bank is called `memes.txt` and is supposed to be in the same directory as the script.
 - Before using the bot you need to fill in the variables at the top of the file.
 - You need [Node.js](https://nodejs.org) to run this bot, and you run it by typing in the command prompt: `node discord-memes-cleverbot.js`
 - You can only register new memes if you have the role that we called "Certified Regular Expressionist", you can remove that restriction in code, or change the name it looks for, do whatever you wish.
 - You can restrict clever bot to a certain channel to prevent spam (it's one of the variables at the top of the file).


Many thanks to [izy521](https://github.com/izy521) for building [discord.io](https://github.com/izy521/discord.io) and answering my questions.


Feel free to fork, change, destroy, or do whatever with my code.
