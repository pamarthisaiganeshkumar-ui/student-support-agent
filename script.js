document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const actionBtns = document.querySelectorAll('.action-btn');

    // Simulate AI Responses database
    const knowledgeBase = {
        'exam': "The final exam schedule is now available. Your CS350 midterm is on Nov 15th at 10:00 AM, and your MATH220 final is Dec 10th. Need me to add these to your calendar?",
        'deadline': "The drop deadline for Fall semester electives is November 18th at 11:59 PM. Make sure to process any changes before then!",
        'elective': "Sure! Since you are on the Software Engineering track, I recommend CS400 (Cloud Computing) or CS420 (AI). Would you like to see the syllabus for either?",
        'cs400': "CS400 (Cloud Computing) is a 3-credit course. Prerequisite: CS300. It covers AWS, Docker, and Kubernetes. Want me to start the registration process?",
        'register': "I've started the registration multi-step process for you. I'm verifying your prerequisites now... Done! You meet all requirements. Shall I confirm your enrollment in CS400 for Spring?",
        'confirm': "Great! You are now successfully enrolled in CS400 for the Spring semester. I've updated your academic plan and calendar.",
        'hello': "Hello Alex! How can I help you with your academic schedule today?",
        'hi': "Hi Alex! Ready to tackle your academics today?",
        'default': "I can help with exam schedules, drop deadlines, finding electives, and course registration. Could you provide a bit more detail?"
    };

    // Helper: Scroll to bottom
    const scrollToBottom = () => {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    // Helper: Add message to chat
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');

        let avatarHtml = '';
        if (sender === 'ai') {
            avatarHtml = `<div class="avatar ai-avatar">✨</div>`;
        }

        messageDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-content glass-panel">
                <p>${text}</p>
            </div>
        `;
        
        chatHistory.appendChild(messageDiv);
        scrollToBottom();
    };

    // Helper: Get AI response based on keyword matching
    const getAiResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        let response = knowledgeBase['default'];

        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (lowerInput.includes(key)) {
                response = value;
                
                // If they typed register, let's visually update the task widget if it exists
                if (key === 'register') {
                    updateTaskWidget(2);
                }
                if (key === 'confirm') {
                    updateTaskWidget(3);
                }
                break;
            }
        }
        return response;
    };

    // Simulate multi-step task update in UI
    const updateTaskWidget = (step) => {
        const steps = document.querySelectorAll('.task-steps li');
        const progressBar = document.querySelector('.progress');
        const statusText = document.querySelector('.task-status');
        
        if (!steps || !progressBar) return;

        if (step === 2) {
            steps[2].className = 'pending';
            steps[2].innerHTML = `<span class="dot"></span> Waiting for confirmation`;
            progressBar.style.width = '80%';
            statusText.innerText = '2.5/3';
        } else if (step === 3) {
            steps[2].className = 'completed';
            steps[2].innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Registered successfully!`;
            progressBar.style.width = '100%';
            progressBar.style.background = 'var(--accent)';
            statusText.innerText = '3/3';
            statusText.style.color = 'var(--accent)';
        }
    };

    // Handle Sending Message
    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add User Message
        addMessage(text, 'user');
        chatInput.value = '';

        // 2. Simulate AI Processing
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message');
        typingIndicator.innerHTML = `
            <div class="avatar ai-avatar">✨</div>
            <div class="message-content glass-panel" style="display: flex; gap: 4px; align-items: center;">
                <div class="dot" style="width: 6px; height: 6px; animation: blink 1s infinite;"></div>
                <div class="dot" style="width: 6px; height: 6px; animation: blink 1s infinite 0.2s;"></div>
                <div class="dot" style="width: 6px; height: 6px; animation: blink 1s infinite 0.4s;"></div>
            </div>
        `;
        chatHistory.appendChild(typingIndicator);
        scrollToBottom();

        // 3. Add AI Response after delay
        setTimeout(() => {
            chatHistory.removeChild(typingIndicator);
            const aiText = getAiResponse(text);
            addMessage(aiText, 'ai');
        }, 1000 + Math.random() * 1000);
    };

    // Event Listeners
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnText = e.target.innerText.trim();
            chatInput.value = btnText;
            handleSend();
        });
    });
    
    // Add simple CSS for blink animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
