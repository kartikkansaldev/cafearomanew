// js/chatbot.js
// A simple Chatbot for Cafe Aroma recommendations

function initChatbot() {
    // Inject Chatbot HTML
    const chatbotHTML = `
        <div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-family: 'Space Mono', monospace;">
            <div id="chatbot-window" style="display: none; width: 320px; height: 450px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; overflow: hidden; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.8); margin-bottom: 15px; transition: all 0.3s ease;">
                <!-- Header -->
                <div style="background: #2a2a2a; padding: 15px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">☕</span>
                        <span style="color: #fff; font-weight: bold; font-family: 'Yellowtail', cursive; font-size: 20px; letter-spacing: 1px;">Aroma Bot</span>
                    </div>
                    <button id="chatbot-close" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 16px; padding: 5px;">✖</button>
                </div>
                
                <!-- Messages Area -->
                <div id="chatbot-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #1a1a1a;">
                    <div style="background: #2a2a2a; color: #eee; padding: 12px; border-radius: 12px; border-bottom-left-radius: 2px; align-self: flex-start; max-width: 85%; font-size: 14px; line-height: 1.4; border: 1px solid #333;">
                        Hi there! 👋 What kind of coffee do you like? Tell me your taste (e.g., sweet, strong, chocolatey) and I'll recommend something perfect from our menu!
                    </div>
                </div>
                
                <!-- Input Area -->
                <div style="padding: 15px; border-top: 1px solid #333; display: flex; background: #222; gap: 10px;">
                    <input type="text" id="chatbot-input" placeholder="I like sweet coffee..." style="flex: 1; padding: 10px; border: 1px solid #444; border-radius: 6px; background: #111; color: #fff; outline: none; font-family: 'Space Mono', monospace; font-size: 13px; transition: border-color 0.2s;" onfocus="this.style.borderColor='#888'" onblur="this.style.borderColor='#444'" />
                    <button id="chatbot-send" style="background: #fff; color: #000; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: 'Space Mono', monospace; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='#ddd'" onmouseout="this.style.background='#fff'">Send</button>
                </div>
            </div>
            
            <!-- Toggle Button -->
            <button id="chatbot-toggle" style="width: 65px; height: 65px; border-radius: 50%; background: #fff; color: #000; border: none; cursor: pointer; font-size: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; margin-left: auto; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                💬
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // NOTE: You requested not to add the API key to GitHub.
    // OPTION 1: Vercel Serverless Function (Recommended & Secure)
    // - Add GROQ_API_KEY in your Vercel Project Settings -> Environment Variables.
    // - The requests will be routed through /api/chat (created for you).
    
    // OPTION 2: Direct API call (Unsecure, only for local testing without Vercel)
    // - Temporarily paste your key here for local testing, BUT DO NOT COMMIT IT TO GITHUB!
    const LOCAL_TESTING_API_KEY = ""; 

    chatbotToggle.addEventListener('click', () => {
        const isHidden = chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '';
        chatbotWindow.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) chatbotInput.focus();
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.style.padding = '12px';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.fontSize = '14px';
        msgDiv.style.lineHeight = '1.4';
        
        if (isUser) {
            msgDiv.style.background = '#fff';
            msgDiv.style.color = '#000';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.borderBottomRightRadius = '2px';
        } else {
            msgDiv.style.background = '#2a2a2a';
            msgDiv.style.color = '#eee';
            msgDiv.style.border = '1px solid #333';
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.borderBottomLeftRadius = '2px';
        }
        
        // Parse markdown bold **text** for basic formatting
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgDiv.innerHTML = formattedText;
        
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function handleSend() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatbotInput.value = '';
        
        // Add loading indicator
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.style.background = '#2a2a2a';
        loadingDiv.style.color = '#aaa';
        loadingDiv.style.border = '1px solid #333';
        loadingDiv.style.padding = '12px';
        loadingDiv.style.borderRadius = '12px';
        loadingDiv.style.borderBottomLeftRadius = '2px';
        loadingDiv.style.alignSelf = 'flex-start';
        loadingDiv.style.fontSize = '13px';
        loadingDiv.innerHTML = '<span style="animation: blink 1.4s infinite both;">.</span><span style="animation: blink 1.4s infinite both; animation-delay: 0.2s;">.</span><span style="animation: blink 1.4s infinite both; animation-delay: 0.4s;">.</span> Typing';
        
        // Inject keyframes for blinking dots
        if (!document.getElementById('chatbot-keyframes')) {
            const style = document.createElement('style');
            style.id = 'chatbot-keyframes';
            style.innerHTML = `@keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }`;
            document.head.appendChild(style);
        }
        
        chatbotMessages.appendChild(loadingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            let botReply = '';

            // Try to use Vercel API Route first
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interest: text })
            });

            if (response.ok) {
                const data = await response.json();
                botReply = data.choices[0].message.content;
            } else {
                try {
                    const errorData = await response.json();
                    botReply = "API Error: " + (errorData.error || "Something went wrong.");
                } catch(e) {
                    botReply = "Sorry, I can't connect right now. (Serverless function failed with status " + response.status + ")";
                }
            }
            
            // Remove loading
            const loader = document.getElementById(loadingId);
            if(loader) loader.remove();
            
            addMessage(botReply, false);
            
        } catch (error) {
            const loader = document.getElementById(loadingId);
            if(loader) loader.remove();
            console.error("Chatbot Error:", error);
            addMessage("Oops! " + error.message, false);
        }
    }

    chatbotSend.addEventListener('click', handleSend);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
