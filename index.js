const Discord = require('discord.js')
const client = new Discord.Client
const prefix = "!"
const log = "842881905434165279"
const bdd = require('./bdd.json');
var fs = require('fs');

client.login(process.env.TOKEN)

function savebdd() {
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (err) => {
        if(err) message.channel.send('Erreur');
    });
}


client.on("ready", function (){
    console.log('Bot ready')
    client.user.setActivity('!help', { type: "PLAYING" })
})


//clear 
client.on('message', async message => {
    if(message.content.startsWith(`${prefix}clear`)) {
        let args = message.content.split(" ");
        let nrb = args[1];

        if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
        const ttelement = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setDescription(`Veuillez suivre le patern suivant : \`${prefix}clear\` \`[Nombre de message]\``)
        if(!nrb) return message.channel.send(ttelement)
        if(isNaN(nrb)) return message.channel.send
        if(nrb < 1 || nrb > 100) return;

        message.delete().then(message => {
            message.channel.bulkDelete(nrb, true).then(messages => {
                const good = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`Suppression de ${messages.size} message(s) efféctué`)
                message.channel.send(good).then(msg => {
                    msg.delete({ timeout: 3000 })
                })
            })
        })
    }
})

//commande ban
client.on('message', async message => {
    if(message.channel.type === 'dm') return;

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}ban`) {
        let userban = message.mentions.members.first();
        if(!message.member.hasPermission('BAN_MEMBERS')) return;

        const reason = args.slice(1).join(' ');
        const ttelement = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`Veuillez suivre le patern suivant : \`${prefix}ban\` \`[Pseudo de la personne en mention]\` \`[Raison]\``)
        if(!reason) return message.channel.send(ttelement)

        const banembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('__KICK__')
                .setDescription(`${user} à été kick\n**Raison :** ${reason}\n**Autheur : ${message.author}**`)
                .setTimestamp()
                .setFooter('Squeek Protect')

        message.channel.send(banembed)
        

    }
})

client.on('message', async message => {
    if(message.channel.type === 'dm') return;
    if(!message.member.hasPermission('KICK_MEMBERS')) return;

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}kick`) {
        if(!message.member.hasPermission('KICK_MEMBERS')) return;
        let toKick = message.mentions.members.first();
        const reason = args.slice(1).join(' ');
        const ttelement = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`Veuillez suivre le patern suivant : \`${prefix}kick\` \`[Pseudo de la personne en mention]\` \`[Raison]\``)
        if(!reason) return message.channel.send(ttelement)

        toKick.kick({
            reason: reason
        })
        const kickembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('__KICK__')
                .setDescription(`${user} à été kick\n**Raison :** ${reason}\n**Autheur : ${message.author}**`)
                .setTimestamp()
                .setFooter('Squeek Protect')

        message.channel.send(kickembed)

    }
})

//anti lien sauf gif
client.on('message', async message => {
    if(message.member.hasPermission('MANAGE_MESSAGES')) return;
    if(message.content.startsWith('https://tenor.com/')) return;
    else {
        if(message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.') || message.content.includes('.fr') || message.content.includes('.net') || message.content.includes('.com') || message.content.includes('.gg') || message.content.includes('.com') || message.content.includes('.gouv') || message.content.includes('.org')){
            message.delete()
    }
    }
})


//mute
client.on('message', async message => {
    if(message.channel.type === 'dm') return;
    if(!message.member.hasPermission('MUTE_MEMBERS')) return;

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')

    

    if (cmd === `${prefix}mute`) {
        if (!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Muted',
                    permissions: 0,
                    color: 'F0000'
                    
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(' ');
        const ttelement = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`Veuillez suivre le patern suivant : \`${prefix}mute\` \`[Pseudo de la personne en mention]\` \`[Raison]\``)
        if(!reason) return message.channel.send(ttelement)

        const good = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Squeek Protect')
            .setTimestamp()
            .setTitle('__MUTE__')
            .setDescription(`Le membre ${user} a été mute\n**Autheur :** ${message.author}\n**Raison :** ${reason}`)

        user.roles.add(muteRole)
        client.channels.cache.get(log).send(good)
    }
    if(message.content.startsWith(`${prefix}unmute`)) {
        let user = message.mentions.members.first()
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if(user === undefined){
            const ttelement = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Veuillez suivre le patern suivant : \`${prefix}unmute\` \`[Pseudo de la personne en mention]\``)
            message.channel.send(ttelement);
        } else {
            const goodunmute = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setFooter('Squeek Protect')
            .setTimestamp()
            .setTitle('__UNMUTE__')
            .setDescription(`Le membre ${user} a été unmute\n**Autheur :** ${message.author}`)
            user.roles.remove(muteRole)
            client.channels.cache.get(log).send(goodunmute)
        }
    }
    
})


//warn
client.on('message', async message => {
    if(message.content.startsWith(`${prefix}warn`)){
        if(message.member.hasPermission('BAN_MEMBERS')){ 

            const ttelement = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Veuillez suivre le patern suivant : \`${prefix}warn\` \`[Pseudo de la personne en mention]\``)

            if(!message.mentions.users.first()) return message.channel.send(ttelement)

            const utilisateur = message.mentions.users.first().id
            const user = message.mentions.users.first()
            const toKick = message.guild.members.resolve(user)

            if(bdd["warn"][utilisateur] === 2){
                const kickembed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('__BAN__')
                    .setDescription(`${user} à été ban\n**Raison :** 3 warn\n**Autheur : ${message.author}**`)
                    .setTimestamp()
                    .setFooter('Squeek Protect')
                    client.channels.cache.get(log).send(kickembed)


                const firstwarn = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('__WARN__')
                    .setDescription(`${user} a été warn par ${message.author}\nil a maintenant 3 warn`)
                message.channel.send(firstwarn)

                delete bdd["warn"][utilisateur]
                savebdd();
                toKick.ban()
            } 
            else{
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    savebdd();
                    const firstwarn = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('__WARN__')
                        .setDescription(`${user} a été warn\n**Nombre de warn :** ${bdd["warn"][utilisateur]}\n**Autheur :** ${message.author}`)
                        client.channels.cache.get(log).send(firstwarn)
                }
                else{
                    bdd["warn"][utilisateur]++
                    savebdd();
                    const secwarn = new Discord.MessageEmbed()
                        .setTitle('__WARN__')
                        .setColor('RED')
                        .setDescription(`${user} a été warn\n**Nombre de warn :** ${bdd["warn"][utilisateur]}\n**Autheur :** ${message.author}`)
                        client.channels.cache.get(log).send(secwarn)
                }
            }

        }
    }
})

//reset warn
client.on('message', async message => {
    if(message.content.startsWith(`${prefix}resetwarn`)) {
        if(message.member.hasPermission('BAN_MEMBERS')){
            const ttelement = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Veuillez suivre le patern suivant : \`${prefix}resetwarn\` \`[Pseudo de la personne en mention]\``)
            if(!message.mentions.users.first()) return message.channel.send(ttelement)

            utilisateur = message.mentions.users.first().id
            user = message.mentions.users.first()

            delete bdd["warn"][utilisateur]
            savebdd();
            const restewarn = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('__RESET WARN__')
                .setDescription(`Les warns de ${user} on été remis a 0 par ${message.author}`)
                client.channels.cache.get(log).send(restewarn)
        }
    }
})

//view warn
client.on('message', async message => {
    if(message.content.startsWith(`${prefix}viewwarn`)) {
        if(message.member.hasPermission('BAN_MEMBERS')){
            const ttelement = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Veuillez suivre le patern suivant : \`${prefix}viewwarn\` \`[Pseudo de la personne en mention]\``)
            if(!message.mentions.users.first()) return message.channel.send(ttelement)
            utilisateur = message.mentions.users.first().id
            user = message.mentions.users.first()

            if(!bdd["warn"][utilisateur]){
                const nowarn = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`${user} à 0 warn`)
                message.channel.send(nowarn)
            } else {
                const viewwarn = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setDescription(`${user} à ${bdd["warn"][utilisateur]} warn(s)`)

            message.channel.send(viewwarn)
            }
        
        }
    }
})

const help = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
    .setFooter('Squeek Protect')
    .setTimestamp()
    .setDescription(`**__Liste des commandes__** \n\n\`${prefix}ban\` \`${prefix}kick\` \`${prefix}warn\` \`${prefix}resetwarn\` \`${prefix}viewwarn\` \`${prefix}mute\` \`${prefix}unmute\` \`${prefix}clear\` \`${prefix}info\`\n\nPour toute informations sur une commande faites \`${prefix}help\` + \`[nom de la commande]\`\n\n**__Liste des fonctionnalitées__**\n\n\`anti lien sauf gif\`\n\nPour toute informations sur une fonctionnalitée faites \`${prefix}help\` + \`[nom de la fonctionnalitée]\``)

client.on('message', message => {
    if(message.content === prefix + 'help') {
        message.channel.send(help)
    }
})

const helpban = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Ban__**\n\nCette commande permet de bannir une personne\n\nSyntaxe : \`${prefix}ban\` \`[membre]\` \`[raison]\`\n\nUtilisable avec la permission : *BAN_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help ban'){
        message.channel.send(helpban)
    }
})

const kickhelp = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Kick__**\n\nCette commande permet de kick une personne\n\nSyntaxe : \`${prefix}kick\` \`[membre]\` \`[raison]\`\n\nUtilisable avec la permission : *KICK_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help kick'){
        message.channel.send(kickhelp)
    }
})

const helpwarn = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Warn__**\n\nCette commande permet de warn une personne\n\nSyntaxe : \`${prefix}warn\` \`[membre]\`\n\nSpécificité : Au bout de 3 warns le membre est ban\n\nUtilisable avec la permission : *BAN_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help warn'){
        message.channel.send(helpwarn)
    }
})

const resetwarnhelp = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Reset Warn__**\n\nCette commande permet de reset tout les warns d'une personne\n\nSyntaxe : \`${prefix}resetwarn\` \`[membre]\`\n\nUtilisable avec la permission : *BAN_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help resetwarn'){
        message.channel.send(resetwarnhelp)
    }
})

const viewwanrhelp = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help View Warn__**\n\nCette commande permet de voir le nombre de warn d'une personne\n\nSyntaxe : \`${prefix}viewwarn\` \`[membre]\`\n\nUtilisable avec la permission : *BAN_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help viewwarn'){
        message.channel.send(viewwanrhelp)
    }
})


const helpmute = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Mute__**\n\nCette commande permet de mute une personne\n\nSyntaxe : \`${prefix}mute\` \`[membre]\`\n\nSpécificité : Si le serveur ne possède pas de role "Muted" alors le bot va le créer lui même\n\nUtilisable avec la permission : *MUTE_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help mute'){
        message.channel.send(helpmute)
    }
})

const unmutehelp = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Unmute__**\n\nCette commande permet de unmute une personne\n\nSyntaxe : \`${prefix}unmute\` \`[membre]\`\n\nUtilisable avec la permission : *MUTE_MEMBERS*`)

client.on('message', message => {
    if(message.content === prefix +'help unmute'){
        message.channel.send(unmutehelp)
    }
})

const helpclear = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Clear__**\n\nCette commande permet de supprimer des messages\n\nSyntaxe : \`${prefix}clear\` \`[Nbr de message]\`\n\nUtilisable avec la permission : *MANAGE_MESSAGES*`)

client.on('message', message => {
    if(message.content === prefix +'help clear'){
        message.channel.send(helpclear)
    }
})

const helpantilien = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help AntiLien__**\n\nCette fonctionnalitée permet de supprimer tout les lien sauf les gifs\n\nSyntaxe : \`Aucune\`\n\nPermission non pris en compte : *MANAGE_MESSAGES*`)

client.on('message', message => {
    if(message.content === prefix +'help anti lien sauf gif'){
        message.channel.send(helpantilien)
    }
})

const infohelp = new Discord.MessageEmbed()
.setColor('BLUE')
.setThumbnail('https://images.emojiterra.com/google/android-10/512px/1f6e0.png')
.setFooter('Squeek Protect')
.setTimestamp()
.setDescription(`**__Help Info__**\n\nCette commande permet d'afficher les informations du bot\n\nSyntaxe : \`${prefix}info\`\n\nUtilisable avec la permission : *AUCUNE*`)

client.on('message', message => {
    if(message.content === prefix +'help info'){
        message.channel.send(infohelp)
    }
})

const info = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTimestamp()
    .setFooter('Squeek Protect')
    .setDescription(`**Version du bot :** 1.0\n\n**Prefix :** ${prefix}\n\n**Créateur :** Kape_Roblochon#0001 `)


client.on('message', message => {
    if(message.content === prefix + 'info'){
        message.channel.send(info)
    }
})
