const Discord = require('discord.js');
const bot = new Discord.Client();
const osu = require('node-osu');
const cfg = require('./cfg.json');

const prefix = cfg.prefix;
const token = cfg.token;
const osuToken = cfg.osuToken

var osuApi = new osu.Api(osuToken, {
  notFoundAsError: true,
  completeScores: true
})

bot.login(token);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setActivity(`osu help | Serving in ${bot.guilds.array().length} servers`, { type: "PLAYING" });
});

bot.on('message', message => {

  if (!message.content.toLowerCase().startsWith('osu ')) { return; }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const osuEmoji = '422113795410755585';
  const checkMark = '✅';

  if (command.startsWith('help')) {
    message.react(checkMark).then(msg => {
    const embed = new Discord.RichEmbed()
      .setTitle("List of all commands")
      .setDescription("Use prefix 'osu ' before the command")
      .setColor("#ff69b4")
      .setFooter("Requested by " + msg.message.author.tag, msg.message.author.avatarURL)
      .setTimestamp()
      .addField("help", "Show this list")
      .addField("ping", "Uh, you know what it does")
      .addField("stats", "Show overall statistics of given player")
      .addField("top", "Show top 5 plays of given player")
      .addField("recent", "Show 5 last played matches of given player")
      .addField("invite", "Invite the bot to your server!")
    msg.message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }
  if (command.startsWith('top')) {
    let nick = args.join(' ');
    if(nick.length == 0){
      const embed = new Discord.RichEmbed()
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTitle('Correct usage: osu top Nickname')
        .setTimestamp()
        message.channel.send({embed});
      return;}
    osuApi.getUserBest({ u: `${nick}` }).then(scores => {
      message.react(checkMark).then(msg => {
      let title = {};
      let score = {};
      let fifty = {};
      let hundreds = {};
      let threeHundreds = {};
      let miss = {};
      let pp = {};
      let maxCombo = {};
      let rank = {};
      let date = {};
      let diff = {};
      let acc = {};
      let perfect = {};
      let beatmapID = {};
      for (let i = 0; i < 5; i++) {
        title[i] = scores[i][1].title;
        score[i] = "**Score: " + scores[i][0].score + "** ";
        fifty[i] = parseInt(scores[i][0].counts['50']) + "x<:hit50:447112150293676039> ";
        hundreds[i] = parseInt(scores[i][0].counts['100']) + "x<:hit100:447112172749717504> ";
        threeHundreds[i] = parseInt(scores[i][0].counts['300']) + "x<:hit300:447112196183425054> ";
        miss[i] = parseInt(scores[i][0].counts.miss) + "x<:miss:447112106790092811> ";
        pp[i] = parseInt(scores[i][0].pp);
        if (scores[i][0].rank == 'X') {
          rank[i] = "Rank: <:rankingX:447114943674843136> ";
        } else if (scores[i][0].rank == 'XH') {
          rank[i] = "Rank: <:rankingXH:447114972364013591> ";
        } else if (scores[i][0].rank == 'SH') {
          rank[i] = "Rank: <:rankingSH:447114913647689728> ";
        } else if (scores[i][0].rank == 'S') {
          rank[i] = "Rank: <:rankingS:447114890302455855> "
        } else if (scores[i][0].rank == 'A') {
          rank[i] = "Rank: <:rankingA:447114758483607562> "
        } else if (scores[i][0].rank == 'B') {
          rank[i] = "Rank: <:rankingB:447114809956106240> "
        } else if (scores[i][0].rank == 'C') {
          rank[i] = "Rank: <:rankingC:447114837672198144> "
        } else if (scores[i][0].rank == 'D') {
          rank[i] = "Rank: <:rankingD:447114859205885964> "
        } else {
          rank[i] = "Rank: " + scores[i][0].rank + " ";
        }
        date[i] = scores[i][0].date;
        diff[i] = parseFloat(scores[i][1].difficulty.rating).toFixed(2);
        if (scores[i][0].perfect) {
          maxCombo[i] = "Combo: **" + scores[i][0].maxCombo + "** ";
        } else {
          maxCombo[i] = "Combo: " + scores[i][0].maxCombo + " ";
        }
        beatmapID[i] = scores[i][1].id;
      }
      const embed = new Discord.RichEmbed()
        .setTitle("Top 5 plays for **" + nick + "**")
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTimestamp()
        .addField(
          "1# " + title[0] + " (" + diff[0] + "★) " + rank[0] + "PP: " + pp[0],
          "|  " + score[0] + maxCombo[0] + "| " + threeHundreds[0] + hundreds[0] + fifty[0] + miss[0] + "| " +
          "[map](https://osu.ppy.sh/b/" + beatmapID[0] + ")"
        )
        .addField(
          "2# " + title[1] + " (" + diff[1] + "★) " + rank[1] + "PP: " + pp[1],
          "|  " + score[1] + maxCombo[1] + "| " + threeHundreds[1] + hundreds[1] + fifty[1] + miss[1] + "| " +
          "[map](https://osu.ppy.sh/b/" + beatmapID[1] + ")"
        )
        .addField(
          "3# " + title[2] + " (" + diff[2] + "★) " + rank[2] + "PP: " + pp[2],
          "|  " + score[2] + maxCombo[2] + "| " + threeHundreds[2] + hundreds[1] + fifty[2] + miss[2] + "| " +
          "[map](https://osu.ppy.sh/b/" + beatmapID[2] + ")"
        )
        .addField(
          "4# " + title[3] + " (" + diff[3] + "★) " + rank[3] + "PP: " + pp[3],
          "|  " + score[3] + maxCombo[3] + "| " + threeHundreds[3] + hundreds[3] + fifty[3] + miss[3] + "| " +
          "[map](https://osu.ppy.sh/b/" + beatmapID[3] + ")"
        )
        .addField(
          "5# " + title[4] + " (" + diff[4] + "★) " + rank[4] + "PP: " + pp[4],
          "|  " + score[4] + maxCombo[4] + "| " + threeHundreds[4] + hundreds[4] + fifty[4] + miss[4] + "| " +
          "[map](https://osu.ppy.sh/b/" + beatmapID[4] + ")"
        )
      message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }).catch(err=>{

    message.channel.send('Unable to find user with name ' + args.join(" "))

  });
  } 

  // RRRR   EEEEEE   CCCCC  EEEEEE  N    N  TTTTTTT
  // R   R  E       C       E       N    N     T
  // R   R  E      C        E       NN   N     T
  // RRRR   EEEEE  C        EEEEE   N N  N     T
  // R R    E      C        E       N  N N     T
  // R  R   E       C       E       N    N     T
  // R   R  EEEEEE   CCCCC  EEEEEE  N    N     T

  if (command.startsWith('recent')) {
    let nick = message.content.split(" ").join(" ").slice(11);
    if(nick.length == 0){
      const embed = new Discord.RichEmbed()
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTitle('Correct usage: osu recent Nickname')
        .setTimestamp()
        message.channel.send({embed});
      return;}
    osuApi.getUserRecent({ u: `${nick}` }).then(scores => {
      message.react(checkMark).then(msg => {
      let title = {};
      let score = {};
      let fifty = {};
      let hundreds = {};
      let threeHundreds = {};
      let miss = {};
      let pp = {};
      let maxCombo = {};
      let rank = {};
      let date = {};
      let diff = {};
      let acc = {};
      let perfect = {};
      for (let i = 0; i < 5; i++) {
        title[i] = scores[i][1].title;
        score[i] = "**Score: " + scores[i][0].score + "** ";
        fifty[i] = parseInt(scores[i][0].counts['50']) + "x<:hit50:447112150293676039> ";
        hundreds[i] = parseInt(scores[i][0].counts['100']) + "x<:hit100:447112172749717504> ";
        threeHundreds[i] = parseInt(scores[i][0].counts['300']) + "x<:hit300:447112196183425054> ";
        miss[i] = parseInt(scores[i][0].counts.miss) + "x<:miss:447112106790092811> ";
        if (scores[i][0].pp) {
          pp[i] = "PP: " + parseInt(scores[i][0].pp);
        } else {
          pp[i] = " ";
        }
        if (scores[i][0].rank == 'X') {
          rank[i] = "Rank: <:rankingX:447114943674843136> ";
        } else if (scores[i][0].rank == 'XH') {
          rank[i] = "Rank: <:rankingXH:447114972364013591> ";
        } else if (scores[i][0].rank == 'SH') {
          rank[i] = "Rank: <:rankingSH:447114913647689728> ";
        } else if (scores[i][0].rank == 'S') {
          rank[i] = "Rank: <:rankingS:447114890302455855> "
        } else if (scores[i][0].rank == 'A') {
          rank[i] = "Rank: <:rankingA:447114758483607562> "
        } else if (scores[i][0].rank == 'B') {
          rank[i] = "Rank: <:rankingB:447114809956106240> "
        } else if (scores[i][0].rank == 'C') {
          rank[i] = "Rank: <:rankingC:447114837672198144> "
        } else if (scores[i][0].rank == 'D') {
          rank[i] = "Rank: <:rankingD:447114859205885964> "
        } else {
          rank[i] = "Rank: " + scores[i][0].rank + " ";
        }
        date[i] = scores[i][0].date;
        diff[i] = parseFloat(scores[i][1].difficulty.rating).toFixed(2);
        if (scores[i][0].perfect) {
          maxCombo[i] = "Combo: **" + scores[i][0].maxCombo + "** ";
        } else {
          maxCombo[i] = "Combo: " + scores[i][0].maxCombo + " ";
        }
      }
      const embed = new Discord.RichEmbed()
        .setTitle("Recent 5 plays for **" + nick + "**")
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTimestamp()
        .addField(
          "1# " + title[0] + " (" + diff[0] + "★) " + rank[0] + pp[0],
          "|  " + score[0] + maxCombo[0] + "| " + threeHundreds[0] + hundreds[0] + fifty[0] + miss[0] + "|"
        )
        .addField(
          "2# " + title[1] + " (" + diff[1] + "★) " + rank[1] + pp[0],
          "|  " + score[1] + maxCombo[1] + "| " + threeHundreds[1] + hundreds[1] + fifty[1] + miss[1] + "|"
        )
        .addField(
          "3# " + title[2] + " (" + diff[2] + "★) " + rank[2] + pp[0],
          "|  " + score[2] + maxCombo[2] + "| " + threeHundreds[2] + hundreds[1] + fifty[2] + miss[2] + "|"
        )
        .addField(
          "4# " + title[3] + " (" + diff[3] + "★) " + rank[3] + pp[0],
          "|  " + score[3] + maxCombo[3] + "| " + threeHundreds[3] + hundreds[3] + fifty[3] + miss[3] + "|"
        )
        .addField(
          "5# " + title[4] + " (" + diff[4] + "★) " + rank[4] + pp[0],
          "|  " + score[4] + maxCombo[4] + "| " + threeHundreds[4] + hundreds[4] + fifty[4] + miss[4] + "|"
        )
      message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }).catch(err=>{

    message.channel.send('Unable to find user with name ' + args.join(" "))

  });
  }

  if (command.startsWith('stats')) {
    let nick = message.content.split(" ").join(" ").slice(10);
    if(nick.length == 0){
      const embed = new Discord.RichEmbed()
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTitle('Correct usage: osu stats Nickname')
        .setTimestamp()
        message.channel.send({embed});
      return;}
    osuApi.getUser({ u: `${nick}` }).then(user => {
      message.react(checkMark).then(msg=>{
      let n = user.name;
      let userID = user.id;
      let acc = user.accuracyFormatted;
      let pp = parseInt(user.pp.raw);
      let country = user.country;
      if (country == 'PL') {
        country = 'https://osu.ppy.sh/images/flags/PL.png';
      } else if (country == 'BR') {
        country = 'https://osu.ppy.sh/images/flags/BR.png';
      } else if (country == 'CN') {
        country = 'https://osu.ppy.sh/images/flags/CN.png';
      } else if (country == 'DE') {
        country = 'https://osu.ppy.sh/images/flags/DE.png';
      } else if (country == 'DK') {
        country = 'https://osu.ppy.sh/images/flags/DK.png';
      } else if (country == 'ES') {
        country = 'https://osu.ppy.sh/images/flags/ES.png';
      } else if (country == 'FR') {
        country = 'https://osu.ppy.sh/images/flags/FR.png';
      } else if (country == 'GB') {
        country = 'https://osu.ppy.sh/images/flags/GB.png';
      } else if (country == 'ID') {
        country = 'https://osu.ppy.sh/images/flags/ID.png';
      } else if (country == 'IT') {
        country = 'https://osu.ppy.sh/images/flags/IT.png';
      } else if (country == 'JP') {
        country = 'https://osu.ppy.sh/images/flags/JP.png';
      } else if (country == 'KR') {
        country = 'https://osu.ppy.sh/images/flags/KR.png';
      } else if (country == 'NL') {
        country = 'https://osu.ppy.sh/images/flags/NL.png';
      } else if (country == 'RU') {
        country = 'https://osu.ppy.sh/images/flags/RU.png';
      } else if (country == 'SE') {
        country = 'https://osu.ppy.sh/images/flags/SE.png';
      } else if (country == 'TH') {
        country = 'https://osu.ppy.sh/images/flags/TH.png';
      } else if (country == 'TW') {
        country = 'https://osu.ppy.sh/images/flags/TW.png';
      } else if (country == 'VN') {
        country = 'https://osu.ppy.sh/images/flags/VN.png';
      }
      let plays = user.counts.plays;
      let rank = user.pp.rank;
      let crank = user.pp.countryRank;
      let rankedScore = user.scores.ranked;
      let totalScore = user.scores.total;
      let level = parseInt(user.level);
      let SS = "<:ScoreSSSmall60:447404946292211724>: " + user.counts.SS;
      let S = "<:Score_S_Badge:447404932354539520>: " + user.counts.S;
      let A = "<:Score_A_Badge:447404908455657473>: " + user.counts.A;
      let fifty = "<:hit50:447112150293676039>: " + user.counts['50'];
      let hundreds = "<:hit100:447112172749717504>: " + user.counts['100'];
      let threeHundreds = "<:hit300:447112196183425054>: " + user.counts['300'];
      const embed = new Discord.RichEmbed()
        .setAuthor(nick + " ( " + level + " lvl )", country)
        .setColor("#ff69b4")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        .setTitle("#" + rank + " | " + pp + "pp" + " | " + acc)
        .setDescription(plays + " plays" + " Ranked Score: " + rankedScore)
        .setTimestamp()
        .addField(A + " " + S + " " + SS, threeHundreds + " " + hundreds + " " + fifty)
      message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }).catch(err=>{

    message.channel.send('Unable to find user with name ' + args.join(" "))

  });
  }
  if (command.startsWith('guilds')) {
    if(message.author.id != '438047413073346575'){return;}
    message.react(checkMark).then(msg => {
    const embed = new Discord.RichEmbed()
      .setTitle("Bot stats")
      .setColor("#ff69b4")
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
      .setTimestamp()
      .addField("Servers", bot.guilds.size)
      .addField("Channels", bot.channels.size)
      .addField("Users", bot.users.size)
    message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }
  if (command.startsWith('invite')) {
    message.react(checkMark).then(msg => {
    const embed = new Discord.RichEmbed()
    .setColor("#ff69b4")
    .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
    .setTimestamp()
    .setTitle('Add me to your server')
    .setURL('https://discordapp.com/oauth2/authorize?client_id=438047413073346575&scope=bot&permissions=67456064')
    .setDescription('Join support server: https://discord.gg/D6PbRCa')
    message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }
  if(command.startsWith('ping')){
    message.react(checkMark).then(msg => {
    const embed = new Discord.RichEmbed()
    .setColor("#ff69b4")
    .setFooter("Requested by " + message.author.tag, message.author.avatarURL)
    .setTimestamp()
    .setTitle("Pong! (took " + Math.floor(bot.ping) + "ms)")
    message.channel.send({ embed }).then(msg.message.react(osuEmoji));
    });
  }
});
