module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        // Fast exit: if it's not a reply, stop immediately
        if (!event.messageReply) return;
        
        const { handleReply, commands } = global.client;
        
        // Fast exit: if there are no pending replies in the system, stop
        if (!handleReply || handleReply.length === 0) return;

        const { messageID, threadID, messageReply } = event;

        // 🚀 OPTIMIZATION: Use .find() directly to grab the object in one step
        const indexOfMessage = handleReply.find(e => e.messageID === messageReply.messageID);
        if (!indexOfMessage) return;

        const handleNeedExec = commands.get(indexOfMessage.name);
        
        if (!handleNeedExec) {
            return api.sendMessage(global.getText('handleReply', 'missingValue'), threadID, messageID);
        }

        try {
            let getText2 = () => {};

            // Language processing setup
            if (handleNeedExec.languages && typeof handleNeedExec.languages === 'object') {
                getText2 = (...value) => {
                    const reply = handleNeedExec.languages || {};
                    const langConfig = global.config.language;

                    if (!reply.hasOwnProperty(langConfig)) {
                        // 🛠️ BUG FIX: 'messengeID' typo changed to 'messageID' to prevent crash
                        return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messageID);
                    }

                    let lang = reply[langConfig][value[0]] || '';
                    
                    // 🧹 DE-OBFUSCATED: Cleaned up the weird hex math that just equaled 0
                    for (let i = value.length; i > 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
            }

            // 🚀 OPTIMIZATION: Clean object creation and removed duplicate 'models' assignment
            const contextObj = {
                api,
                event,
                models,
                Users,
                Threads,
                Currencies,
                handleReply: indexOfMessage,
                getText: getText2
            };

            // Execute the reply handler
            handleNeedExec.handleReply(contextObj);
            
        } catch (error) {
            return api.sendMessage(global.getText('handleReply', 'executeError', error.message || error), threadID, messageID);
        }
    };
};
